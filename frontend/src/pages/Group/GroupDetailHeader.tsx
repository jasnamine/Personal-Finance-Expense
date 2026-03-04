import {
  ArrowDownOutlined,
  CalendarOutlined,
  DollarCircleOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Row,
  Statistic,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import AppModal from "../../components/Modal/AppModal";
import type { GroupDetailResponse } from "../../models/Group";
import MemberForm from "./MemberForm";
interface GroupDetailProps {
  group: GroupDetailResponse;
  members: GroupDetailResponse["members"];
}
const { Title, Paragraph } = Typography;
const GroupDetailHeader = ({ group, members }: GroupDetailProps) => {
  const formatVND = (v: any) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(v);
  
  console.log(members)

  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const handleSubmit = () => {};
  return (
    <Card className="shadow-sm rounded-2xl border-none mb-6 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <Title level={2} style={{ margin: 0 }}>
              {group.group.name}
            </Title>
            <Badge
              count={group.members?.length + " người"}
              style={{ backgroundColor: "#f0f0f0", color: "#595959" }}
            />
          </div>
          <Paragraph type="secondary" className="mb-4">
            {group.group.description}
          </Paragraph>
          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <CalendarOutlined className="text-blue-500" />
              <span>
                {dayjs(group.group.startDate).format("DD/MM/YYYY")} -{" "}
                {dayjs(group.group.endDate).format("DD/MM/YYYY")}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-start">
          <Button
            icon={<TeamOutlined />}
            className="rounded-lg h-10"
            onClick={() => setIsMemberModalOpen(true)}
          >
            Quản lý thành viên
          </Button>
        </div>
      </div>

      <Divider className="my-6" />

      {/* Stats Row */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={8}>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-red-50/50 border border-red-100">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xl">
              <ArrowDownOutlined />
            </div>
            <Statistic
              title={
                <span className="text-gray-500 text-xs uppercase tracking-wider font-semibold">
                  Tổng chi tiêu
                </span>
              }
              value={group.totalExpense}
              formatter={formatVND}
              styles={{
                content: {
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "#1f2937",
                },
              }}
            />
          </div>
        </Col>
        <Col xs={12} sm={8}>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-50/50 border border-blue-100 h-full">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl">
              <TeamOutlined />
            </div>
            <Statistic
              title={
                <span className="text-gray-500 text-xs uppercase tracking-wider font-semibold">
                  Thành viên
                </span>
              }
              value={group.members?.length || 4}
              suffix="người"
              styles={{
                content: {
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "#1f2937",
                },
              }}
            />
          </div>
        </Col>
        <Col xs={12} sm={8}>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-green-50/50 border border-green-100 h-full">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl">
              <DollarCircleOutlined />
            </div>
            <Statistic
              title={
                <span className="text-gray-500 text-xs uppercase tracking-wider font-semibold">
                  Giao dịch
                </span>
              }
              value={group.expenses?.length || 0}
              styles={{
                content: {
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "#1f2937",
                },
              }}
            />
          </div>
        </Col>
      </Row>

      <AppModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        title="Quản lý thành viên"
        onSubmit={handleSubmit}
        isFooterVisible={false}
      >
        <MemberForm members={members ?? []} />
      </AppModal>
    </Card>
  );
};
export default GroupDetailHeader;
