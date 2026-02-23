import { List, Button, Popconfirm, Space, Tag, Typography } from "antd";
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
    <List
      itemLayout="horizontal"
      dataSource={expenses}
      renderItem={(item) => (
        <List.Item
          className="px-6 py-5 hover:bg-gray-50 group"
          actions={[
            <Button
              type="text"
              icon={<EditOutlined />}
              className="opacity-0 group-hover:opacity-100"
            />,
            <Popconfirm title="Xóa chi tiêu này?">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                className="opacity-0 group-hover:opacity-100"
              />
            </Popconfirm>,
          ]}
        >
          <div className="flex items-center w-full gap-4">
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
          </div>
        </List.Item>
      )}
    />
  );
};

export default ExpenseList;
