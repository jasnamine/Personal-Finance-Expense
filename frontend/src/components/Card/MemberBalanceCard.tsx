import { Avatar, Card, Space, Typography } from "antd";

const { Text } = Typography;

interface Props {
  members: any[];
  currency: string;
}

const MemberBalanceCard = ({ members }: Props) => {
  return (
    <Card title="Số dư thành viên" className="rounded-2xl">
      {members.map((m, i) => (
        <div key={i} className="flex justify-between py-3">
          <Space>
            <Avatar>{m.name[0]}</Avatar>
            <Text strong>{m.name}</Text>
          </Space>

          <Text strong>0</Text>
        </div>
      ))}
    </Card>
  );
};

export default MemberBalanceCard;
