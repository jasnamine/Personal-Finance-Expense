// src/enums/GroupRole.ts
export const GROUP_ROLE = {
  OWNER: "OWNER",
  EDITOR: "EDITOR",
  VIEWER: "VIEWER",
} as const;

export type GroupRole = keyof typeof GROUP_ROLE;

