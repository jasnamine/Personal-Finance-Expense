import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { Group } from "../models/Group";

interface GroupState {
  group: Group | null;
  setGroup: (data: Partial<GroupState>) => void;
}

export const useGroupStore = create<GroupState>()(
  devtools(
    persist(
      (set) => ({
        group: null,

        setGroup: (data) =>
          set((state) => ({ ...state, ...data }), false, "auth/setGroup"),
      }),
      {
        name: "group-storage",
      },
    ),
    {
      name: "GroupStore",
    },
  ),
);
