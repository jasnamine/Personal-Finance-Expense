import { Card, Button, Popconfirm, Space, Tag, Typography } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;

interface Props {
  expenses: any[];
  currency: string;
}

const formatCurrency = (v: number, currency: string) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency,
  }).format(v);

const ExpenseList = ({ expenses, currency }: Props) => {
  return (
    <div className="space-y-3">
      {expenses.map((item) => (
        <Card
          key={item._id}
          className="hover:bg-gray-50 transition-all"
          styles={{ body: { padding: "20px 24px" } }}
        >
          <div className="flex items-center w-full gap-4 group">
            <div className="flex-1">
              <Text strong>{item.description}</Text>

              <Space className="text-xs text-gray-400">
                <span>
                  <CalendarOutlined /> {dayjs(item.date).format("DD/MM/YYYY")}
                </span>
                <Tag>{item.type}</Tag>
              </Space>
            </div>

            <Text strong className="text-red-500">
              {formatCurrency(item.amount, currency)}
            </Text>

            <Space>
              <Button
                type="text"
                icon={<EditOutlined />}
                className="opacity-0 group-hover:opacity-100"
              />

              <Popconfirm title="Xóa chi tiêu này?">
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  className="opacity-0 group-hover:opacity-100"
                />
              </Popconfirm>
            </Space>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ExpenseList;
