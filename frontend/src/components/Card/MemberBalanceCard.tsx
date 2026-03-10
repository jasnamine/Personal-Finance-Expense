import { Avatar, Card, Space, Typography } from "antd";
import type { GroupMember } from "../../models/Group";
import type { Balance } from "../../models/Settlement";

const { Text } = Typography;

interface Props {
  members: GroupMember[];
  balances: Balance[];
  currency: string;
}

const MemberBalanceCard = ({ balances, members, currency }: Props) => {
  const getUser = (userId: string) => {
    return members.find((m) => m.userId === userId);
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency,
    }).format(amount);

  return (
    <div className="rounded-2xl">
      {balances?.map((b) => {
        const user = getUser(b.userId);

        const isPositive = b.balance > 0;
        const isZero = Math.abs(b.balance) < 0.01;

        return (
          <Card key={b.userId} className="flex justify-between py-3">
            <Space>
              <Avatar>{user?.email?.[0].toUpperCase() ?? "?"}</Avatar>
              <div>
                <Text strong>{user?.email ?? "Unknown"}</Text>
                <br />

                <Text type="secondary" className="text-xs">
                  {isZero
                    ? "Đã thanh toán đủ"
                    : isPositive
                      ? "Được trả"
                      : "Cần trả"}
                </Text>
              </div>
            </Space>

            <Text
              strong
              className={
                isZero
                  ? "text-gray-400"
                  : isPositive
                    ? "text-green-600"
                    : "text-red-600"
              }
            >
              {isZero ? "—" : formatCurrency(Math.abs(b.balance))}
            </Text>
          </Card>
        );
      })}
    </div>
  );
};

export default MemberBalanceCard;
