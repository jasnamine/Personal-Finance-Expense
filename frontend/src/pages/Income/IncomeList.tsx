import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Space, Table } from "antd";
const INITIAL_CATEGORIES = [
  {
    _id: "c1",
    name: "Ăn uống",
    amount: 2000,
    description: "tiền bún riu",
    group: "xtok",
    type: "INCOME",
    icon: "💰",
    color: "#52c41a",
  },
  {
    _id: "c2",
    name: "Thưởng",
    type: "INCOME",
    icon: "🧧",
    color: "#13c2c2",
  },
  {
    _id: "c3",
    name: "Ăn uống",
    type: "EXPENSE",
    icon: "🍔",
    color: "#f5222d",
  },
  {
    _id: "c4",
    name: "Di chuyển",
    type: "EXPENSE",
    icon: "🚗",
    color: "#fa8c16",
  },
  {
    _id: "c5",
    name: "Mua sắm",
    type: "EXPENSE",
    icon: "🛍️",
    color: "#722ed1",
  },
  {
    _id: "c6",
    name: "Mua sắm",
    type: "EXPENSE",
    icon: "🛍️",
    color: "#722ed1",
  },
  {
    _id: "c5",
    name: "Mua sắm",
    type: "EXPENSE",
    icon: "🛍️",
    color: "#722ed1",
  },
  {
    _id: "c5",
    name: "Mua sắm",
    type: "EXPENSE",
    icon: "🛍️",
    color: "#722ed1",
  },
  {
    _id: "c5",
    name: "Mua sắm",
    type: "EXPENSE",
    icon: "🛍️",
    color: "#722ed1",
  },
  {
    _id: "c5",
    name: "Mua sắm",
    type: "EXPENSE",
    icon: "🛍️",
    color: "#722ed1",
  },
];
const IncomeList = () => {
  return (
    <Table
      dataSource={INITIAL_CATEGORIES}
      rowKey="_id"
      columns={[
        {
          title: "",
          dataIndex: "icon",
          render: (i) => <span style={{ fontSize: 24 }}>{i}</span>,
        },
        {
          title: "Danh mục",
          dataIndex: "name",
          render: (n) => <p>{n}</p>,
        },
        {
          title: "Số tiền",
          dataIndex: "amount",
          render: (a) => <p>{a}</p>,
        },
        {
          title: "Mô tả",
          dataIndex: "description",
          render: (d) => <p>{d}</p>,
        },
        {
          title: "Group",
          dataIndex: "group",
          render: (d) => <p>{d}</p>,
        },
        {
          title: "Hành động",
          render: () => (
            <Space>
              <Button type="text" icon={<EditOutlined />} />
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Space>
          ),
        },
      ]}
    />
  );
};

export default IncomeList;
