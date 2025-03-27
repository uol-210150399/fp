import { ConversationHistory } from "./schema";

export const formatConversationHistory = (history: ConversationHistory): string => {
  return history
    .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
    .join('\n\n');
}