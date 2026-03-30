// frontend/types.ts
export interface CampaignResult {
  factSheet: Record<string, any>; // or a more specific type if you know the keys
  finalContent: string;
  logs: string[];
}