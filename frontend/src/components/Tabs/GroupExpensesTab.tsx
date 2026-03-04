import { PlusOutlined, SwapOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Space } from "antd";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { ExpenseResponse } from "../../models/Expense";
import ExpenseGroupForm from "../../pages/Group/ExpenseGroupForm";
import AppCard from "../Card/AppCard";
import ExpenseList from "../Lists/ExpenseList";
import AppModal from "../Modal/AppModal";
import type { GroupMember } from "../../models/Group";


interface Props {
  expenses: ExpenseResponse[];
  currency: string;
  members: GroupMember[];
}

export const groupExpenseSchema = z.object({
  description: z.string().optional(),
  amount: z.number().min(1, "Số tiền phải lớn hơn 0"),
  paidBy: z.string().min(1, "Chọn người trả tiền"),
  date: z.date(),
  splitType: z.enum(["EQUAL", "PERCENTAGE", "EXACT"], {
    message: "Chọn phương thức chia tiền",
  }),
  splits: z
    .array(
      z.object({
        userId: z.string(),
        value: z.number().min(0, "Số tiền phải lớn hơn hoặc bằng 0"),
      }),
    )
    .optional(),
});

const GroupExpensesTab = ({ expenses, currency, members }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const form = useForm<z.infer<typeof groupExpenseSchema>>({
    resolver: zodResolver(groupExpenseSchema),
    defaultValues: {
      description: "",
      amount: 0,
      splitType: "EQUAL",
      paidBy: "",
      date: new Date(),
      splits: [],
    },
  });

  const handleSubmit = (data: z.infer<typeof groupExpenseSchema>) => {
    console.log("Form data:", data);
  };
  return (
      <AppCard title="Danh sách chi tiêu" onClick={() => setIsModalOpen(true)}>
        <div className="flex justify-between mb-6">
          <AppModal
            title={"Thêm chi tiêu nhóm"}
            isOpen={isModalOpen}
            onSubmit={form.handleSubmit(handleSubmit)}
            onClose={() => setIsModalOpen(false)}
          >
            <ExpenseGroupForm form={form} members={members} />
          </AppModal>

          <div style={{ padding: 0 }} className="rounded-2xl">
            <ExpenseList expenses={expenses} currency={currency} />
          </div>
        </div>
      </AppCard>
  );
};

export default GroupExpensesTab;
