import { Row, Col } from "antd";
import MemberBalanceCard from "../Card/MemberBalanceCard";


interface Props {
  members: any[];
  currency: string;
}

const BalanceTab = ({ members, currency }: Props) => {
  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} md={12}>
        <MemberBalanceCard members={members} currency={currency} />
      </Col>
    </Row>
  );
};

export default BalanceTab;
