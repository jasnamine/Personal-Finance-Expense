import { Avatar, Card, Space, Typography } from "antd";
import type { GroupMember } from "../../models/Group";
import type { Balance } from "../../models/Settlement";
import { formatCurrency } from "../../utils/formatCurrency";

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

  return (
    <div className="flex flex-col gap-3">
      {balances?.map((b) => {
        const user = getUser(b.userId);
        const isPositive = b.balance > 0;
        const isZero = Math.abs(b.balance) < 0.01;

        return (
          <Card
            key={b.userId}
            className="rounded-xl mb-3 shadow-sm"
            bodyStyle={{ padding: "12px 16px" }}
          >
            <div className="flex justify-between items-center w-full">
              <Space size="middle">
                <Avatar
                  size={40}
                  className="bg-blue-500 flex items-center justify-center text-white"
                >
                  {user?.email?.[0].toUpperCase() ?? "?"}
                </Avatar>
                <div className="flex flex-col">
                  <Text strong style={{ fontSize: "14px" }}>
                    {user?.email ?? "Unknown"}
                  </Text>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {isZero
                      ? "Settled Up"
                      : isPositive
                        ? "To be received"
                        : "Owes"}
                  </Text>
                </div>
              </Space>

              <div className="text-right">
                <Text
                  strong
                  style={{
                    fontSize: "16px",
                    color: isZero
                      ? "#9ca3af"
                      : isPositive
                        ? "#16a34a"
                        : "#dc2626",
                  }}
                >
                  {isZero
                    ? "Settled"
                    : `${isPositive ? "+" : "-"}${formatCurrency(Math.abs(b.balance), currency)}`}
                </Text>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default MemberBalanceCard;
