import { z } from 'zod';

export const QualityEnum = z.enum(['HIGH', 'MEDIUM', 'LOW']);
export enum QualityEnumValues {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}
export const ConcernEnum = z.enum([
  'NONE',
  'CONFIDENTIAL',
  'COMPLEX',
  'CLARITY',
  'REFUSAL',
]);

export enum ConcernEnumValues {
  NONE = 'NONE',
  CONFIDENTIAL = 'CONFIDENTIAL',
  COMPLEX = 'COMPLEX',
  CLARITY = 'CLARITY',
  REFUSAL = 'REFUSAL',
}
export const RepetitionEnum = z.enum(['NEEDED', 'NOT_NEEDED']);
export enum RepetitionEnumValues {
  NEEDED = 'NEEDED',
  NOT_NEEDED = 'NOT_NEEDED',
}
export const QualityResponseSchema = z.object({
  type: QualityEnum,
  rationale: z.string(),
});

export const ConcernResponseSchema = z.object({
  type: ConcernEnum,
  rationale: z.string(),
});

export const RepetitionResponseSchema = z.object({
  type: RepetitionEnum,
  rationale: z.string(),
});

export type QualityClassificationResult = z.infer<typeof QualityResponseSchema>;
export type ConcernClassificationResult = z.infer<typeof ConcernResponseSchema>;
export type RepetitionClassificationResult = z.infer<typeof RepetitionResponseSchema>;
export type ConversationMessage = {
  role: 'user' | 'assistant';
  content: string;
};
export type ConversationHistory = ConversationMessage[];
