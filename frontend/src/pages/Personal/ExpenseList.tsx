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
          title: "Danh mục",
          dataIndex: "categoryId",
          render: (category) => <p>{category?.name}</p>,
        },
        {
          title: "Loại giao dịch",
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
          title: "Số tiền",
          dataIndex: "amount",
          render: (a) => <p> {formatCurrency(a || 0, currency)}</p>,
        },
        {
          title: "Mô tả",
          dataIndex: "description",
          render: (d) => <p>{d}</p>,
        },
        {
          title: "Hành động",
          render: (_, expense: ExpenseResponse) => (
            <Space>
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => onEditExpense(expense)}
              />
              <Popconfirm
                title="Xóa chi tiêu này?"
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
