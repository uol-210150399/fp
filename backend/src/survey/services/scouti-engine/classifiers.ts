import { OpenAI } from 'openai';
import { QualityResponseSchema, ConcernResponseSchema, RepetitionResponseSchema, QualityClassificationResult, ConcernClassificationResult, RepetitionClassificationResult, ConversationHistory } from './schema';
import { config } from './config';
import { storage } from '../storage';
import { formatConversationHistory } from './utils';

abstract class BaseClassifier {
  protected client: OpenAI;
  protected model: string;

  constructor(model: string = 'gpt-4o-mini') {
    this.client = new OpenAI({ apiKey: config.openai.apiKey });
    this.model = model;
  }

  protected async logClassification(type: string, inputs: Record<string, any>, result: any) {
    try {
      const timestamp = new Date().toISOString();
      const logEntry = {
        timestamp,
        classifier: type,
        model: this.model,
        inputs,
        result
      };

      await storage.appendToFile(`classifications/${type.toLowerCase()}_logs.json`, JSON.stringify(logEntry) + '\n');
    } catch (error) {
      console.error(`Failed to log classification:`, error);
      // Don't throw error to avoid interrupting main classification flow
    }
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
Evaluate the quality of an expert survey answer based on the following inputs:

Question: {question}
Question Objectives: {instructions}
Answer: {answer}

**Task:** Determine whether the overall answer is HIGH/MEDIUM/LOW, HIGH if all key themes are addressed with most of them with quality HIGH, MEDIUM if most aspects have been addressed with quality MEDIUM or HIGH, LOW if not all aspects have been addressed and the quality is mostly LOW.

**Classification Criteria for type:**

- **Quality: HIGH**
  - **Detail & Depth:** Provides a clear explanation of what the answer is and how it was reached (e.g., through reasoning or process).
  - **Additional Insight:** Offers novel or in-depth information that goes beyond restating known facts.

- **Quality: MEDIUM**
  - **Adequate Coverage:** Covers the sub-question but may miss some reasoning or deeper context.
  - **Partial Insight:** Provides the necessary facts but lacks extensive elaboration on the process behind the conclusions.

- **Quality: LOW**
  - **Superficiality:** Offers a minimal response that barely touches on the theme or offers no response.
  - **Lack of Explanation:** States conclusions without explaining the underlying rationale or background or reason (where needed).

Return JSON with:
- type: Overall HIGH/MEDIUM/LOW rating
- rationale: Brief explanation of missing/incomplete aspects`;

  async checkQuality(question: string, instructions: string, answer: string): Promise<QualityClassificationResult> {
    const response = await this.evaluate(this.QUALITY_PROMPT
      .replace('{question}', question)
      .replace('{instructions}', instructions || 'No extra objectives provided')
      .replace('{answer}', answer));

    const result = QualityResponseSchema.parse(response);

    await this.logClassification('QUALITY', { question, instructions, answer }, result);
    return result;
  }
}

export class ConcernClassifier extends BaseClassifier {
  private readonly CONCERN_PROMPT = `
Classify the respondent's answer based on any concerns they express. Consider ONLY the content of their answer.

Question: {question}
Answer: {answer}

Categories (choose exactly one):
1. REPETITIVE - Answer indicates the question was already asked
2. CONFIDENTIAL - Answer mentions inability to share private/confidential information
3. CLARITY - Answer states the question is unclear or needs clarification
4. COMPLEX - Answer indicates the question is too complex or technical
5. REFUSAL - Answer explicitly refuses to respond
6. NONE - Answer provides a direct response without raising concerns

Return JSON with:
- type: One category from above
- rationale: Brief justification for the classification`;

  async checkConcerns(question: string, answer: string): Promise<ConcernClassificationResult> {
    const response = await this.evaluate(this.CONCERN_PROMPT
      .replace('{question}', question)
      .replace('{answer}', answer));

    const result = ConcernResponseSchema.parse(response);

    await this.logClassification('CONCERN', { question, answer }, result);
    return result;
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
    const formattedHistory = formatConversationHistory(conversationHistory);

    const prompt = this.REPETITION_PROMPT
      .replace('{conversationHistory}', formattedHistory ? formattedHistory : 'No conversation history yet.')
      .replace('{question}', question);

    const response = await this.evaluate(prompt);
    const result = RepetitionResponseSchema.parse(response);

    await this.logClassification('REPETITION', { question, conversationHistory }, result);
    return result;
  }
} 