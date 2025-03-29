import { OpenAI } from 'openai';
import {
  type ConversationHistory,
  QualityEnumValues,
  ConcernEnumValues
} from './schema';
import { CONCERN_FOLLOW_UP_PROMPTS } from './prompts';
import { config } from './config';
import { storage } from '../storage';

export type QualityFollowUpResponse = {
  questions: string[];
};

export type ConcernFollowUpResponse = {
  questions: string[];
};

abstract class BaseFollowUpGenerator {
  protected client: OpenAI;
  protected model: string;

  constructor(model: string = 'o3-mini') {
    this.client = new OpenAI({ apiKey: config.openai.apiKey });
    this.model = model;
  }

  protected async logFollowUp(type: string, inputs: Record<string, any>, result: any) {
    try {
      const timestamp = new Date().toISOString();
      const questionText = inputs.question;

      // Create a log entry for this follow-up
      const followUpEntry = {
        timestamp,
        generator: type,
        model: this.model,
        inputs,
        result
      };

      // Read existing data for this question if it exists
      const filePath = `follow_ups/by_question/${questionText.slice(0, 50).replace(/[^a-zA-Z0-9]/g, '_')}.json`;
      let questionData;

      try {
        const existingData = await storage.readFile(filePath);
        questionData = JSON.parse(existingData);
      } catch {
        questionData = {
          question: questionText,
          follow_ups: []
        };
      }

      // Add new follow-up
      questionData.follow_ups.push(followUpEntry);

      // Write back the updated data
      await storage.writeFile(filePath, JSON.stringify(questionData, null, 2));
    } catch (error) {
      console.error(`Failed to log follow-up:`, error);
      // Don't throw error to avoid interrupting main flow
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
      console.error('LLM call failed:', error);
      throw error;
    }
  }

  protected validateFollowUpResponse(response: any): QualityFollowUpResponse | ConcernFollowUpResponse {
    if (!response.questions || !Array.isArray(response.questions)) {
      throw new Error('Invalid questions array');
    }
    if (response.questions.length > 3) {
      response.questions = response.questions.slice(0, 3);
    }
    if (response.questions.some(q => typeof q !== 'string')) {
      throw new Error('Invalid question format');
    }
    return response;
  }

  protected formatConversationHistory(history: ConversationHistory): string {
    return history
      .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n\n');
  }

}

// Quality Follow-up Generator
export class QualityFollowUpGenerator extends BaseFollowUpGenerator {
  private readonly QUALITY_FOLLOWUP_PROMPT = `
    You are an expert survey follow-up question generator. Your task is to generate follow-up questions 
    based on a low or medium quality response to improve the depth and quality of information.

    IMPORTANT: While try your best to reduce the number of questions to ask, you have the freedom to generate up to 3 alternative questions in extreme cases.

    Survey Domain Context: {context}
    Previous Conversation:
    {conversationHistory}

    Current Question: {question}
    Current Question Answer: {answer}
    Current Question Objectives: {notes}
    Quality Assessment: {quality}
    Quality Assessment Rationale: {qualityRationale}

    Guidelines for generating follow-up questions:
    1. Focus on Depth:
       - For LOW quality: Ask for basic elaboration and specific examples
       - For MEDIUM quality: Probe deeper into reasoning and implications

    2. Question Structure:
       - Keep questions open-ended but focused
       - One clear ask per question
       - Use simple, clear language
       - Reference previous answers when relevant (e.g., "You mentioned X, could you elaborate on...")

    3. Question Types Based on Quality:
       LOW Quality Response:
       - Ask for specific examples
       - Request basic elaboration
       - Break down complex topics
       - Focus on one aspect at a time

       MEDIUM Quality Response:
       - Probe for underlying reasoning
       - Ask about implications
       - Explore connections
       - Seek quantification

    5. AVOID:
       - Leading questions
       - Yes/no questions (unless confirming a specific point)
       - Multiple questions in one
       - Repetitive questions or topics already covered in conversation history
       - Questions about information already provided
       - Overly complex or technical language

    Return a JSON object with:
    - questions: Array of 1-3 follow-up questions (strings[])
  `;

  async generateFollowUp(
    question: string,
    answer: string,
    quality: QualityEnumValues,
    qualityRationale: string,
    conversationHistory: ConversationHistory = [],
    context: string,
    instructions: string
  ): Promise<QualityFollowUpResponse> {
    const prompt = this.QUALITY_FOLLOWUP_PROMPT
      .replace('{question}', question)
      .replace('{answer}', answer)
      .replace('{quality}', quality)
      .replace('{qualityRationale}', qualityRationale)
      .replace('{conversationHistory}', this.formatConversationHistory(conversationHistory))
      .replace('{context}', context)
      .replace('{notes}', instructions || 'No extra objectives provided');

    const response = await this.evaluate(prompt);
    const result = this.validateFollowUpResponse(response);

    await this.logFollowUp('QUALITY', {
      question,
      answer,
      quality,
      qualityRationale,
      conversationHistory,
      context,
      instructions
    }, result);

    return result;
  }
}

// Concern Follow-up Generator
export class ConcernFollowUpGenerator extends BaseFollowUpGenerator {
  private readonly PROMPTS = CONCERN_FOLLOW_UP_PROMPTS;

  async generateFollowUp(
    question: string,
    instructions: string,
    concernType: ConcernEnumValues,
    conversationHistory: ConversationHistory = [],
  ): Promise<ConcernFollowUpResponse> {
    if (concernType === ConcernEnumValues.NONE) {
      const result = { questions: [] };
      await this.logFollowUp('CONCERN', {
        question,
        instructions,
        concernType,
        conversationHistory
      }, result);
      return result;
    }

    const prompt = this.PROMPTS[concernType]
      .replace('{question}', question)
      .replace('{conversationHistory}', this.formatConversationHistory(conversationHistory))
      .replace('{notes}', instructions || 'No extra objectives provided');

    const response = await this.evaluate(prompt);
    const result = this.validateFollowUpResponse(response);

    await this.logFollowUp('CONCERN', {
      question,
      instructions,
      concernType,
      conversationHistory
    }, result);

    return result;
  }
} 