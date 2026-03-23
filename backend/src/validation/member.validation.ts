import { z } from "zod";

const objectId = z.string();
export const addMemberSchema = z.object({
  body: z.object({
    groupId: objectId,
    email: z.string().email("Invalid email format"),
    role: z.enum(["OWNER", "EDITOR", "VIEWER"]),
  }),
});

export const updateMemberRoleSchema = z.object({
  params: z.object({
    groupId: objectId,
  }),
  body: z.object({
    userId: objectId,
    role: z.enum(["OWNER", "EDITOR", "VIEWER"], {
      errorMap: () => ({ message: "Role must be OWNER, EDITOR, or VIEWER" }),
    }),
  }),
});

export const memberParamSchema = z.object({
  params: z.object({
    groupId: objectId,
    memberId: objectId.optional(),
  }),
});
