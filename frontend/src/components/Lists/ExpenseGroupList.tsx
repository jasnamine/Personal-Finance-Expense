import {
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Button, Card, Popconfirm, Space, Typography } from "antd";
import dayjs from "dayjs";
import { TrendingDown } from "lucide-react";
import type { GroupExpenseResponse } from "../../models/Group";

const { Text } = Typography;

interface Props {
  expenses: GroupExpenseResponse[];
  currency: string;
  onEditGroupExpense: (data: GroupExpenseResponse) => void;
  onDeleteGroupExpense: (id: string) => void;
}

const formatCurrency = (v: number, currency: string) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency,
  }).format(v);

const ExpenseGroupList = ({
  expenses,
  currency,
  onEditGroupExpense,
  onDeleteGroupExpense,
}: Props) => {
  return (
    <div className="space-y-3 w-full gap-2">
      {expenses.map((expense) => (
        <Card
          key={expense._id}
          className="w-full border rounded-lg hover:bg-gray-50"
          styles={{
            body: {
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            },
          }}
        >
          <div className="flex items-center gap-4 flex-1 min-w-0 group">
            <div className="bg-red-100 p-3 rounded-full flex-shrink-0">
              <TrendingDown className="size-5 text-red-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate mb-1">{expense.description}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                <CalendarOutlined className="size-3" />
                <span>{dayjs(expense.date).format("DD/MM/YYYY")}</span>
                <span>•</span>
                <span className="max-w-[100px] truncate">
                  {expense.paidBy || "Unknown"} trả
                </span>
                <span>•</span>
                <span>Chia {expense.splits?.length || 0} người</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Text strong className="text-red-500 whitespace-nowrap">
              {formatCurrency(expense.amount, currency)}
            </Text>

            <Space>
              <Button
                type="text"
                onClick={() => onEditGroupExpense(expense)}
                icon={<EditOutlined />}
                className="text-gray-400 hover:text-blue-500"
              />
              <Popconfirm
                title="Xóa chi tiêu này?"
                onConfirm={() => onDeleteGroupExpense(expense._id)}
              >
                <Button type="text" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </Space>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ExpenseGroupList;
