export const STORAGE_KEYS = {
  DRAFT: (userId: string) => `verselite_draft_${userId}`,
  PENDING_PUBLISHES: (userId: string) => `verselite_pending_${userId}`,
};
