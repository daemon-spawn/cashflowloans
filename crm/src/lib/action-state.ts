export type ActionState = {
  ok?: boolean;
  error?: string;
  fields?: Record<string, string[]>;
  message?: string;
  /** Set when the API asks for confirmation (e.g. approving a blacklisted client). */
  needsOverride?: boolean;
};

export const idle: ActionState = {};
