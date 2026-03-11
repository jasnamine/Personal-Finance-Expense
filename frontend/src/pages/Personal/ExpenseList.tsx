import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Table, Tag } from "antd";
import type { ExpenseResponse } from "../../models/Expense";

interface ExpenseListProps {
  expenses: ExpenseResponse[];
  onEditExpense: (data: ExpenseResponse) => void;
  onDeleteExpense: (id: string) => void;
}
const ExpenseList = ({
  expenses,
  onEditExpense,
  onDeleteExpense,
}: ExpenseListProps) => {
  return (
    <Table
      dataSource={expenses}
      rowKey="_id"
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
          render: (a) => <p>{a}</p>,
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
