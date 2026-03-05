import { Avatar, Checkbox, InputNumber, Space, Typography } from "antd";
import { Controller, useWatch, type UseFormReturn } from "react-hook-form";
import type { GroupExpenseRequest, GroupMember } from "../../models/Group";

const { Text } = Typography;

interface Props {
  form: UseFormReturn<GroupExpenseRequest>;
  members: GroupMember[];
}

const SplitMoneySection = ({ form, members }: Props) => {
  const splitType = useWatch({
    control: form.control,
    name: "splitType",
  });

  const splits = useWatch({
    control: form.control,
    name: "splits",
  });

  const selectedUsers = splits?.map((s) => s.userId) ?? [];

  const toggleUser = (userId: string, checked: boolean) => {
    const currentSplits = splits ?? [];

    if (checked) {
      form.setValue("splits", [...currentSplits, { userId, value: 0, splitType }]);
    } else {
      form.setValue(
        "splits",
        currentSplits.filter((s) => s.userId !== userId),
      );
    }
  };

  return (
    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 mt-4">
      {members.map((m) => {
        const isSelected = selectedUsers.includes(m.userId);
        const splitIndex = splits?.findIndex((s) => s.userId === m.userId);

        return (
          <div
            className={`flex items-center justify-between py-3 px-4 rounded-xl mb-2 transition-all border ${
              isSelected
                ? "bg-white border-blue-100 shadow-sm"
                : "bg-transparent border-transparent opacity-60"
            }`}
            key={m.userId}
          >
            <Checkbox
              checked={isSelected}
              onChange={(e) => toggleUser(m.userId, e.target.checked)}
            >
              <Space>
                <Avatar
                  size="small"
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m.email}`}
                />
                <Text strong={isSelected} className="text-sm">
                  {m.email}
                </Text>
              </Space>
            </Checkbox>

            {isSelected && splitIndex !== undefined && splitIndex >= 0 && (
              <Controller
                name={`splits.${splitIndex}.value`}
                control={form.control}
                render={({ field }) =>
                  splitType === "EQUAL" ? (
                    <Text strong className="text-blue-600">
                      {field.value ?? 0}
                    </Text>
                  ) : (
                    <InputNumber
                      {...field}
                      size="small"
                      min={0}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      className="w-28 rounded-md"
                    />
                  )
                }
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SplitMoneySection;
