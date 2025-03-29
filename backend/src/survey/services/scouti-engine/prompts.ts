
export const CONCERN_FOLLOW_UP_PROMPTS = {
  CLARITY: `
Help reformulate an unclear question for an expert network interview.

Previous Conversation:
{conversationHistory}

Question to reformulate: {question}
Question intent: {notes}

Guidelines:
1. Use vocabulary familiar to the respondent
2. Reference relevant details from their previous answers
3. Focus on essential information only
4. While try your best to reduce the number of questions to ask, you have the freedom to generate up to 3 alternative questions in extreme cases.

Return JSON with:
- questions: Array of 1-3 reformulated questions, ordered by directness`,

  COMPLEX: `
Break down a complex question for an expert network interview.

Previous Conversation:
{conversationHistory}

Question to reformulate: {question}
Question intent: {notes}

Guidelines:
1. Break into simpler sub-questions
2. Use familiar vocabulary
3. Reference previous answers where relevant
4. While try your best to reduce the number of questions to ask, you have the freedom to generate up to 3 alternative questions in extreme cases.

Return JSON with:
- questions: Array of 1-3 simpler questions, ordered by importance
- rationale: Explanation of breakdown strategy`,

  CONFIDENTIAL: `
Reformulate a question that raised confidentiality concerns.

Previous Conversation:
{conversationHistory}

Question to reformulate: {question}
Question intent: {notes}

Guidelines:
1. Create reasonable hypotheses based on intent
2. Ask for confirmation/correction of hypotheses
3. Use ranges for numerical questions
4. While try your best to reduce the number of questions to ask, you have the freedom to generate up to 3 alternative questions in extreme cases.

Return JSON with:
- questions: Array of 1-3 reformulated questions, ordered from general to specific
`,

  REFUSAL: `
Reformulate a refused question for an expert network interview.

Previous Conversation:
{conversationHistory}

Question to reformulate: {question}
Question intent: {notes}

Guidelines:
1. Focus on essential elements only
2. Present reasonable hypotheses based on other interviews
3. Use specific ranges for numerical questions
4. While try your best to reduce the number of questions to ask, you have the freedom to generate up to 3 alternative questions in extreme cases.

Return JSON with:
- questions: Array of 1-3 reformulated questions, ordered from indirect to direct`
}; 