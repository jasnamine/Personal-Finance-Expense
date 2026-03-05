import { ArrowRightOutlined, CalendarOutlined } from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Row,
  Tooltip,
  Typography,
} from "antd";
import type { GroupResponse } from "../../models/Group";
import dayjs from "dayjs"; 
import { useNavigate } from "react-router-dom";

const { Text, Paragraph } = Typography;

interface GroupListProps {
  groups: GroupResponse[];
}

const GroupList = ({ groups }: GroupListProps) => {
  const formatDate = (date?: Date) => {
    if (!date) return "N/A";
    return dayjs(date).format("DD/MM/YYYY");
  };

  const navigate = useNavigate();

  return (
    <Row gutter={[16, 16]}>
      {groups.map((group) => (
        <Col xs={24} sm={12} lg={8} xl={6} key={group._id}>
          <Card
            hoverable
            className="group-card h-full border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
            styles={{
              body: {
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                height: "100%"
              },
            }}
          >
            {/* Title and Badge */}
            <div className="flex justify-between items-start mb-2">
              <Text
                strong
                className="text-base truncate flex-1 pr-2"
                title={group.name}
              >
                {group.name}
              </Text>
              <Badge
                count={`${group.members.length} người`}
                style={{
                  backgroundColor: "#f5f5f5",
                  color: "#595959",
                  fontSize: "11px",
                  border: "none",
                }}
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <Paragraph
                type="secondary"
                className="text-xs italic line-clamp-2"
                style={{
                  minHeight: "32px", 
                  marginBottom: 0,
                }}
              >
                {group.description || ""}
              </Paragraph>
            </div>

            {/* Date and Timeline */}
            <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-4 bg-gray-50 p-2 rounded-lg">
              <CalendarOutlined style={{ color: "#1890ff" }} />
              <span>
                {formatDate(group.startDate)} - {formatDate(group.endDate)}
              </span>
            </div>

            {/* Members Preview */}
            <div className="flex items-center gap-2 mb-6">
              <Avatar.Group
                maxCount={3}
                size="small"
                maxStyle={{
                  color: "#f56a00",
                  backgroundColor: "#fde3cf",
                }}
              >
                {group.members.map((member, index) => (
                  <Tooltip title={member.email} key={member.userId}>
                    <Avatar
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#1890ff" : "#722ed1",
                      }}
                    >
                      {member.email.charAt(0).toUpperCase()}
                    </Avatar>
                  </Tooltip>
                ))}
              </Avatar.Group>
              {group.members.length > 3 && (
                <Text type="secondary" style={{ fontSize: "11px" }}>
                  +{group.members.length - 3}
                </Text>
              )}
            </div>

            {/* Action */}
            <div className="mt-auto">
              <Button
                block
                type="text"
                className="flex justify-between items-center hover:bg-blue-50 text-blue-600 font-medium px-2 rounded-md transition-colors"
                style={{ height: "36px" }}
                onClick={() => navigate(`/group/group-detail/${group._id}`)}
              >
                <span className="text-xs">Xem chi tiết</span>
                <ArrowRightOutlined className="text-[10px]" />
              </Button>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default GroupList;
