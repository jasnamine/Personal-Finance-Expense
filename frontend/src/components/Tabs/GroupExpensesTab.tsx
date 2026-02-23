import { PlusOutlined, SwapOutlined } from "@ant-design/icons";
import { Button, Card, Space, Typography } from "antd";
import type { ExpenseResponse } from "../../models/Expense";
import ExpenseList from "../Lists/ExpenseList";

const { Title } = Typography;

interface Props {
  expenses: ExpenseResponse[];
  currency: string;
}

const GroupExpensesTab = ({ expenses, currency }: Props) => {
  return (
    <>
      <div className="flex justify-between mb-6">
        <Space>
          <Button type="primary" icon={<PlusOutlined />}>
            Thêm chi tiêu
          </Button>
          <Button icon={<SwapOutlined />}>Thanh toán</Button>
        </Space>
      </div>

      <Card bodyStyle={{ padding: 0 }} className="rounded-2xl">
        <div className="p-6 border-b">
          <Title level={5}>Danh sách chi tiêu</Title>
        </div>

        <ExpenseList expenses={expenses} currency={currency} />
      </Card>
    </>
  );
};

export default GroupExpensesTab;
