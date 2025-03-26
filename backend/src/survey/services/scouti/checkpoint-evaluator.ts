import OpenAI from "openai";
import { ConversationHistory } from "./schema";
import { config } from "./config";

export class CheckpointEvaluator {
  private readonly client: OpenAI;
  private readonly model: string;

  constructor(model: string = 'o3-mini') {
    this.client = new OpenAI({ apiKey: config.openai.apiKey });
    this.model = model;
  }

  async evaluate(condition: string, conversationHistory: ConversationHistory): Promise<{
    result: "TRUE" | "FALSE" | "UNKNOWN";
    steps: string;
    conditionType: "POSITIVE" | "NEGATIVE";
  }> {
    const prompt = `
Please use the conversation history (which has accurate information) between the 'user' and 'assistant' to evaluate the following condition:
{condition}

The conversation history is:
{conversationHistory}

For the evaluation, follow these steps:
1. Determine if the condition is POSITIVE (affirmative) or NEGATIVE (contains a negation).
2. For entity resolution, when matching entities (companies, locations, organizations):
   - Treat partial entity names as matches in both directions (e.g., "Cola" and "Coca-Cola" refer to the same entity regardless of which version appears in the condition or response)
   - Accept common acronyms as equivalent (e.g., NYC for New York City)
3. Evaluate if the condition is TRUE, FALSE, or UNKNOWN.

Think carefully and provide detailed reasoning for each step.

IMPORTANT: 
- For the evaluation result:
  - Return TRUE if you are certain the condition is met.
  - Return FALSE if you are certain the condition is not met.
  - Return UNKNOWN if there is not enough information to determine whether the condition is met or not.
- When matching entities, consider partial name matches as equivalent entities (e.g., 'Cola' and 'Coca-Cola')"

Return a JSON object with:
{
    "result": "TRUE" | "FALSE" | "UNKNOWN",
    "steps": "string",
    "conditionType": "POSITIVE" | "NEGATIVE"
}
    `
    const updatedPrompt = prompt.replace("{condition}", condition).replace("{conversationHistory}", conversationHistory.join("\n"));
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [{ role: 'user', content: updatedPrompt }],
      response_format: { type: 'json_object' },
    });

    const result = response.choices[0]?.message?.content;
    if (!result) {
      return {
        result: "UNKNOWN",
        steps: "No response from LLM",
        conditionType: "POSITIVE"
      }
    }
    return JSON.parse(result);
  }
}
