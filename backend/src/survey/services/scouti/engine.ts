import { SessionState, SessionTextQuestion } from 'src/survey/mappers/session-state.mapper';
import { QualityClassifier, ConcernClassifier, RepetitionClassifier } from './classifiers';
import { QualityFollowUpGenerator, ConcernFollowUpGenerator } from './follow-ups';
import { ConversationHistory, QualityEnumValues, ConcernEnumValues, RepetitionEnumValues } from './schema';
import { CheckpointEvaluator } from './checkpoint-evaluator';

export class ScoutiEngine {
  private qualityClassifier: QualityClassifier;
  private concernClassifier: ConcernClassifier;
  private repetitionClassifier: RepetitionClassifier;
  private qualityFollowUpGenerator: QualityFollowUpGenerator;
  private concernFollowUpGenerator: ConcernFollowUpGenerator;
  private readonly classifierModel = 'gpt-4o-mini';
  private readonly followupGeneratorModel = 'o3-mini';

  constructor() {
    this.qualityClassifier = new QualityClassifier(this.classifierModel);
    this.concernClassifier = new ConcernClassifier(this.classifierModel);
    this.repetitionClassifier = new RepetitionClassifier(this.classifierModel);
    this.qualityFollowUpGenerator = new QualityFollowUpGenerator(this.followupGeneratorModel);
    this.concernFollowUpGenerator = new ConcernFollowUpGenerator(this.followupGeneratorModel);
  }

  async generateFollowUpQuestions(
    state: SessionState,
    currentQuestion: SessionTextQuestion,
    currentAnswer: string,
    conversationHistory: ConversationHistory = []
  ): Promise<string[]> {
    try {
      // First check for concerns
      const [concernResult, qualityResult] = await Promise.all([
        this.concernClassifier.checkConcerns(currentQuestion.text, currentAnswer),
        this.qualityClassifier.checkQuality(currentQuestion.text, currentAnswer)
      ]);

      // If there are concerns, only generate concern-based follow-ups
      if (concernResult.type !== ConcernEnumValues.NONE) {
        const concernFollowUps = await this.concernFollowUpGenerator.generateFollowUp(
          currentQuestion.text,
          currentAnswer,
          concernResult.type as ConcernEnumValues,
          conversationHistory,
          state.context
        );
        return (concernFollowUps.questions || []).filter(q => q.trim().length > 0);
      }

      if (qualityResult.type !== QualityEnumValues.HIGH) {
        return []
      }

      // If no concerns, check quality and generate quality-based follow-ups
      const qualityFollowUps = await this.qualityFollowUpGenerator.generateFollowUp(
        currentQuestion.text,
        currentAnswer,
        qualityResult.type as QualityEnumValues,
        conversationHistory,
        state.context
      );

      return (qualityFollowUps.questions || []).filter(q => q.trim().length > 0);
    } catch (error) {
      console.error('Error processing response:', error);
      throw error;
    }
  }

  async detectRepetition(currentQuestion: SessionTextQuestion, conversationHistory: ConversationHistory = []): Promise<{
    detected: boolean;
    reason: string;
  }> {
    const repetitionResult = await this.repetitionClassifier.checkRepetition(currentQuestion.text, conversationHistory);
    return {
      detected: repetitionResult.type === RepetitionEnumValues.NOT_NEEDED,
      reason: repetitionResult.rationale
    }
  }

  async evaluateCheckpoint(condition: string, conversationHistory: ConversationHistory = []): Promise<{
    result: "TRUE" | "FALSE" | "UNKNOWN";
    steps: string;
    conditionType: "POSITIVE" | "NEGATIVE";
  }> {
    const checkpointEvaluator = new CheckpointEvaluator();
    return checkpointEvaluator.evaluate(condition, conversationHistory);
  }
}



