import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Table, Tag } from "antd";
import type { ExpenseResponse } from "../../models/Expense";
import { formatCurrency } from "../../utils/formatCurrency";
import { useAuthStore } from "../../stores/authStore";

interface ExpenseListProps {
  expenses: ExpenseResponse[];
  page: number;
  total: number;
  onChangePage: (page: number) => void;
  onEditExpense: (data: ExpenseResponse) => void;
  onDeleteExpense: (id: string) => void;
}
const ExpenseList = ({
  expenses,
  page,
  total,
  onChangePage,
  onEditExpense,
  onDeleteExpense,
}: ExpenseListProps) => {
  const { user } = useAuthStore();

  const currency = user?.currency || "VND";
  return (
    <Table
      dataSource={expenses}
      rowKey="_id"
      pagination={{
        current: page,
        pageSize: 5,
        total: total,
        onChange: onChangePage,
      }}
      columns={[
        {
          title: "",
          align: "center",
          dataIndex: "categoryId",
          render: (category) => (
            <img
              src={category?.icon}
              alt={category?.name}
              className="w-6 h-6"
            />
          ),
        },
        {
          title: "Category",
          dataIndex: "categoryId",
          render: (category) => <p>{category?.name}</p>,
        },
        {
          title: "Transaction type",
          dataIndex: "categoryId",
          render: (category) => (
            <Tag
              color={category?.type === "EXPENSE" ? "red" : "green"}
              variant="solid"
            >
              {category?.type}
            </Tag>
          ),
        },
        {
          title: "Amount",
          dataIndex: "amount",
          render: (a) => <p> {formatCurrency(a || 0, currency)}</p>,
        },
        {
          title: "Description",
          dataIndex: "description",
          render: (d) => <p>{d}</p>,
        },
        {
          title: "Action",
          render: (_, expense: ExpenseResponse) => (
            <Space>
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => onEditExpense(expense)}
              />
              <Popconfirm
                title="Delete Transaction"
                description="Are you sure you want to delete this record?"
                onConfirm={() => onDeleteExpense(expense._id)}
              >
                <Button type="text" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </Space>
          ),
        },
      ]}
    />
  );
};

export default ExpenseList;
