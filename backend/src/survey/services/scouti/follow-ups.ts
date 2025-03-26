import { OpenAI } from 'openai';
import {
  type ConversationHistory,
  QualityEnumValues,
  ConcernEnumValues
} from './schema';

export type QualityFollowUpResponse = {
  questions: string[];
};

export type ConcernFollowUpResponse = {
  questions: string[];
};

abstract class BaseFollowUpGenerator {
  protected client: OpenAI;
  protected model: string;

  constructor(model: string = 'gpt-4o-mini') {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
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
    You are an expert interview follow-up question generator. Your task is to generate follow-up questions 
    based on a low or medium quality response to improve the depth and quality of information.

    IMPORTANT: Generate up to 3 follow-up questions **maximum**.

    Context: {context}
    Previous Conversation:
    {conversationHistory}

    Current Question: {question}
    Current Answer: {answer}
    Quality Assessment: {quality}

    Guidelines for generating follow-up questions:
    1. Focus on Depth:
       - For LOW quality: Ask for basic elaboration and specific examples
       - For MEDIUM quality: Probe deeper into reasoning and implications

    2. Question Structure:
       - Keep questions open-ended but focused
       - One clear ask per question
       - Use simple, clear language
       - Maximum 25 words per question
       - Reference previous answers when relevant (e.g., "You mentioned X, could you elaborate on...")

    3. Priority Assignment:
       - HIGH: Critical missing information about core themes
       - MEDIUM: Important but not urgent clarifications
       - LOW: Nice-to-have details or tangential points

    4. Question Types Based on Quality:
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
    conversationHistory: ConversationHistory = [],
    context: string
  ): Promise<QualityFollowUpResponse> {
    const prompt = this.QUALITY_FOLLOWUP_PROMPT
      .replace('{question}', question)
      .replace('{answer}', answer)
      .replace('{quality}', quality)
      .replace('{conversationHistory}', this.formatConversationHistory(conversationHistory))
      .replace('{context}', context);

    const response = await this.evaluate(prompt);
    return this.validateFollowUpResponse(response);
  }
}

// Concern Follow-up Generator
export class ConcernFollowUpGenerator extends BaseFollowUpGenerator {
  private readonly CONCERN_FOLLOWUP_PROMPT = `
    You are an expert interview follow-up question generator. Your task is to generate a follow-up question 
    to address a specific concern raised in the respondent's answer.

    IMPORTANT: Generate up to 3 follow-up questions maximum.

    Context: {context}
    Previous Conversation:
    {conversationHistory}

    Current Question: {question}
    Current Answer: {answer}
    Concern Type: {concernType}

    Guidelines for generating follow-up questions based on concern type:

    1. COMPLEX Concerns:
       - Break down complex topics into simpler parts
       - Ask for clarification of technical terms
       - Request practical examples
       - Focus on one aspect at a time
       - Reference previous explanations if available

    2. UNCLEAR Concerns:
       - Seek specific clarification on ambiguous points
       - Ask for concrete examples
       - Rephrase key points for confirmation
       - Focus on precise details
       - Reference unclear terms or concepts from previous answers

    3. INCOMPLETE Concerns:
       - Target missing critical information
       - Ask about specific gaps
       - Request additional context
       - Focus on key missing elements
       - Consider information provided in previous answers

    4. Question Structure:
       - Keep questions simple and direct
       - One clear ask per question
       - Use plain language
       - Maximum 25 words per question
       - Reference previous answers when relevant

    5. Priority Assignment:
       - HIGH: Critical clarifications needed for core understanding
       - MEDIUM: Important but not blocking clarifications
       - LOW: Minor clarifications or edge cases

    6. AVOID:
       - Leading questions
       - Multiple questions in one
       - Questions about information already provided in conversation history
       - Overly complex language
       - Yes/no questions (unless confirming a specific point)
       - Repetitive questions or topics already covered

    Return a JSON object with:
    - questions: Array of 1-3 follow-up questions (strings[])
  `;

  async generateFollowUp(
    question: string,
    answer: string,
    concernType: ConcernEnumValues,
    conversationHistory: ConversationHistory = [],
    context: string
  ): Promise<ConcernFollowUpResponse> {
    // Don't generate follow-up for NONE concern type
    if (concernType === ConcernEnumValues.NONE) {
      return {
        questions: [],
      };
    }

    const prompt = this.CONCERN_FOLLOWUP_PROMPT
      .replace('{question}', question)
      .replace('{answer}', answer)
      .replace('{concernType}', concernType)
      .replace('{conversationHistory}', this.formatConversationHistory(conversationHistory))
      .replace('{context}', context);

    const response = await this.evaluate(prompt);
    return this.validateFollowUpResponse(response);
  }
} 