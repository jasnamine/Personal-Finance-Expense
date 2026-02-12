import { ArrowRightOutlined, CalendarOutlined } from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Empty,
  Row,
  Tooltip,
  Typography,
} from "antd";
import { Content } from "antd/es/layout/layout";
import { useState } from "react";
import AppCard from "../../components/Card/AppCard";
import GroupDetail from "./GroupDetail";
const { Title, Text, Paragraph } = Typography;
const GroupList = () => {
      const formatVND = (amount: any) => {
        return new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(amount);
      };

      const INITIAL_GROUPS = [
        {
          _id: "g1",
          name: "Du lịch Đà Nẵng 2026",
          description: "Chuyến đi team building",
          startDate: "20/02",
          endDate: "23/02/2026",
          members: ["Bạn", "Hoa", "Tuấn", "Linh"],
          totalDebt: 500000,
        },
        {
          _id: "g2",
          name: "Gia đình nhỏ",
          description: "Chi tiêu sinh hoạt hàng tháng",
          startDate: "01/01",
          endDate: "31/12/2026",
          members: ["Bạn", "Vợ", "Con"],
          totalDebt: -1200000,
        },
      ];
  return (
    <Row gutter={[16, 16]}>
      {INITIAL_GROUPS.map((group) => (
        <Col xs={24} sm={12} lg={8} xl={6} key={group._id}>
          <Card
            hoverable
            className="group-card h-full border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
            bodyStyle={{
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              height: "100%",
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
            {group.description && (
              <Paragraph
                type="secondary"
                className="text-xs mb-4 line-clamp-2 italic"
                style={{ minHeight: "32px" }}
              >
                {group.description}
              </Paragraph>
            )}

            {/* Date and Timeline */}
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 bg-gray-50 p-2 rounded-lg">
              <CalendarOutlined style={{ color: "#1890ff" }} />
              <span></span>
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
                {group.members.map((name, index) => (
                  <Tooltip title={name} key={index}>
                    <Avatar
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#1890ff" : "#722ed1",
                      }}
                    >
                      {name.charAt(0).toUpperCase()}
                    </Avatar>
                  </Tooltip>
                ))}
              </Avatar.Group>
              {group.members.length > 3 && (
                <Text type="secondary" style={{ fontSize: "11px" }}>
                  +{group.members.length - 3} thành viên
                </Text>
              )}
            </div>

            {/* Financial Status & Action */}
            <div className="mt-auto space-y-3">
              <Button
                block
                type="text"
                className="flex justify-between items-center hover:bg-blue-50 text-blue-600 font-medium px-2 rounded-md transition-colors"
                style={{ height: "36px" }}
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
