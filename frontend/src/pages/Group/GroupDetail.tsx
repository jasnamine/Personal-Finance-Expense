import {
  ArrowDownOutlined,
  ArrowRightOutlined,
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  List,
  Popconfirm,
  Row,
  Space,
  Tabs,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import GroupDetailHeader from "./GroupDetailHeader";

const { Title, Text, Paragraph } = Typography;
const GroupDetail = () => {
  const expenses = [
    {
      id: "1",
      description: "Ăn tối nhà hàng hải sản",
      amount: 1200000,
      date: "2026-02-21",
      paidBy: "An trả",
      category: "Ăn uống",
      split: "Chia 4 người",
    },
    {
      id: "2",
      description: "Thuê xe máy",
      amount: 800000,
      date: "2026-02-21",
      paidBy: "Bình trả",
      category: "Di chuyển",
      split: "Chia 4 người",
    },
    {
      id: "3",
      description: "Khách sạn 3 đêm",
      amount: 4000000,
      date: "2026-02-20",
      paidBy: "Bạn trả",
      category: "Nhà ở",
      split: "Chia 4 người",
    },
  ];

  const formatVND = (v: any) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(v);
  return (
    <div className="animate-in  pb-10">
      {/* Group Header Card */}
      <GroupDetailHeader />

      {/* Actions & Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <Space size="middle">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="h-10 px-6 rounded-lg bg-black border-black hover:bg-gray-800"
          >
            Thêm chi tiêu
          </Button>
          <Button icon={<SwapOutlined />} className="h-10 px-6 rounded-lg">
            Thanh toán
          </Button>
        </Space>
      </div>

      <Tabs
        className="custom-tabs"
        items={[
          {
            key: "expenses",
            label: "Chi tiêu",
            children: (
              <Card
                className="rounded-2xl border-none shadow-sm"
                bodyStyle={{ padding: 0 }}
              >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <Title level={5} style={{ margin: 0 }}>
                    Danh sách chi tiêu
                  </Title>
                </div>
                <List
                  itemLayout="horizontal"
                  dataSource={expenses}
                  renderItem={(item) => (
                    <List.Item
                      className="px-6 py-5 hover:bg-gray-50/50 transition-colors group"
                      actions={[
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          className="opacity-0 group-hover:opacity-100"
                        />,
                        <Popconfirm
                          title="Xóa chi tiêu này?"
                          okText="Xóa"
                          cancelText="Hủy"
                        >
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
                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                          <ArrowDownOutlined style={{ fontSize: "16px" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Text strong className="block text-sm md:text-base">
                            {item.description}
                          </Text>
                          <Space
                            className="text-xs text-gray-400 flex-wrap"
                            split={<span className="text-gray-300">•</span>}
                          >
                            <span className="flex items-center gap-1">
                              <CalendarOutlined />{" "}
                              {dayjs(item.date).format("DD/MM/YYYY")}
                            </span>
                            <span>{item.paidBy}</span>
                            <span>{item.split}</span>
                            <Tag
                              bordered={false}
                              color="blue"
                              style={{ fontSize: "10px", lineHeight: "18px" }}
                            >
                              {item.category}
                            </Tag>
                          </Space>
                        </div>
                        <div className="text-right ml-4">
                          <Text
                            strong
                            className="text-base text-red-500 whitespace-nowrap"
                          >
                            {formatVND(item.amount)}
                          </Text>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
            ),
          },
          {
            key: "balances",
            label: "Số dư",
            children: (
              <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                  <Card
                    title="Số dư thành viên"
                    className="rounded-2xl border-none shadow-sm"
                  >
                    {[
                      { name: "Bạn", amount: 3500000, type: "plus" },
                      { name: "An", amount: -1200000, type: "minus" },
                      { name: "Bình", amount: -800000, type: "minus" },
                      { name: "Hoa", amount: -1500000, type: "minus" },
                    ].map((m, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center py-4 border-b last:border-none border-gray-50"
                      >
                        <Space size="middle">
                          <Avatar style={{ backgroundColor: "#1890ff" }}>
                            {m.name[0]}
                          </Avatar>
                          <div>
                            <Text strong>{m.name}</Text>
                            <div className="text-[10px] text-gray-400">
                              {m.type === "plus" ? "Được trả" : "Cần trả"}
                            </div>
                          </div>
                        </Space>
                        <Text
                          strong
                          className={
                            m.type === "plus"
                              ? "text-green-600"
                              : "text-red-500"
                          }
                        >
                          {m.type === "plus" ? "+" : "-"}
                          {formatVND(Math.abs(m.amount))}
                        </Text>
                      </div>
                    ))}
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card
                    title="Gợi ý thanh toán"
                    className="rounded-2xl border-none shadow-sm"
                  >
                    {[
                      { from: "An", to: "Bạn", amount: 1200000 },
                      { from: "Bình", to: "Bạn", amount: 800000 },
                      { from: "Hoa", to: "Bạn", amount: 1500000 },
                    ].map((debt, i) => (
                      <div
                        key={i}
                        className="p-4 bg-blue-50/50 rounded-xl mb-3 flex justify-between items-center border border-blue-100"
                      >
                        <div className="flex items-center gap-2">
                          <Text strong>{debt.from}</Text>
                          <ArrowRightOutlined className="text-gray-400 text-xs" />
                          <Text strong>{debt.to}</Text>
                        </div>
                        <Text strong className="text-blue-600">
                          {formatVND(debt.amount)}
                        </Text>
                      </div>
                    ))}
                  </Card>
                </Col>
              </Row>
            ),
          },
        ]}
      />
    </div>
  );
};

export default GroupDetail;
