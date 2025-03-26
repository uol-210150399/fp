import { OpenAI } from 'openai';
import { QualityResponseSchema, ConcernResponseSchema, RepetitionResponseSchema, QualityClassificationResult, ConcernClassificationResult, RepetitionClassificationResult, ConversationHistory } from './schema';
import { config } from './config';


abstract class BaseClassifier {
  protected client: OpenAI;
  protected model: string;

  constructor(model: string = 'gpt-4o-mini') {
    this.client = new OpenAI({ apiKey: config.openai.apiKey });
    this.model = model;
  }

  protected async evaluate(prompt: string): Promise<any> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      });

      const result = response.choices[0]?.message?.content;
      if (!result) throw new Error('No response from LLM');

      return JSON.parse(result);
    } catch (error) {
      console.error(`The classifier evaluation failed using model ${this.model}:`, error);
      throw error;
    }
  }
}

export class QualityClassifier extends BaseClassifier {
  private readonly QUALITY_PROMPT = `
    You are a classification engine evaluating the quality of answers in expert survey.
    
    Analyze the response quality based on:
    1. Completeness - Does it address all key aspects?
    2. Depth - Is there sufficient detail and explanation?
    3. Relevance - Does it directly answer the question?
    4. Clarity - Is the response clear and well-structured?
    
    Classify the response as:
    - HIGH: Comprehensive, detailed, relevant, and clear
    - MEDIUM: Adequate but could use more detail or clarity
    - LOW: Incomplete, superficial, or unclear
    
    Question: {question}
    Answer: {answer}
    
    Return a JSON object with:
    - quality: The classification (HIGH/MEDIUM/LOW)
    - rationale: Brief explanation of the classification
  `;

  async checkQuality(question: string, answer: string): Promise<QualityClassificationResult> {
    const prompt = this.QUALITY_PROMPT
      .replace('{question}', question)
      .replace('{answer}', answer);

    const response = await this.evaluate(prompt);
    return QualityResponseSchema.parse(response);
  }
}

export class ConcernClassifier extends BaseClassifier {
  private readonly CONCERN_PROMPT = `
    Analyze the response for potential concerns:
    
    Types of concerns:
    - COMPLEX: Answer is too technical or complicated
    - UNCLEAR: Response is ambiguous or hard to follow
    - INCOMPLETE: Missing critical information
    - NONE: No significant concerns
    
    Question: {question}
    Answer: {answer}
    
    Return a JSON object with:
    - type: The primary concern type (NONE/COMPLEX/UNCLEAR/INCOMPLETE)
    - rationale: Brief explanation of the concern
  `;

  async checkConcerns(question: string, answer: string): Promise<ConcernClassificationResult> {
    const prompt = this.CONCERN_PROMPT
      .replace('{question}', question)
      .replace('{answer}', answer);

    const response = await this.evaluate(prompt);
    return ConcernResponseSchema.parse(response);
  }
}

export class RepetitionClassifier extends BaseClassifier {
  private readonly REPETITION_PROMPT = `
    Analyze if this question would yield new information given the conversation history.
    
    Guidelines:
    1. Check if key aspects of the question have been thoroughly covered
    2. Consider if the question might reveal new perspectives
    3. Evaluate if the question approaches the topic from a different angle
    
    Conversation History:
    {conversationHistory}
    
    Proposed Question: {question}
    
    Return a JSON object with:
    - type: Whether the question is NEEDED or NOT_NEEDED
    - rationale: Brief explanation of the decision
  `;

  async checkRepetition(question: string, conversationHistory: ConversationHistory): Promise<RepetitionClassificationResult> {
    const formattedHistory = conversationHistory
      .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n\n');

    const prompt = this.REPETITION_PROMPT
      .replace('{conversationHistory}', formattedHistory)
      .replace('{question}', question);

    const response = await this.evaluate(prompt);
    return RepetitionResponseSchema.parse(response);
  }
} 