import { BarChartOutlined, PieChartOutlined } from "@ant-design/icons";
import { Card, Col, Row, Space } from "antd";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  Legend as RechartsLegend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ResourceURL from "../../constants/ResourceURL";
import useGetAllApi from "../../hooks/use-get-all-api";
import type { DashboardResponse } from "../../models/Dashboard";
import { useAuthStore } from "../../stores/authStore";
import { formatCurrency } from "../../utils/formatCurrency";
import { COLORS } from "../../constants/Constant";

const Dashboard = () => {
  const { data } = useGetAllApi<DashboardResponse>(
    ResourceURL.DASHBOARD,
    "dashboard",
  );

  const { user } = useAuthStore();

  const currency = user?.currency || "VND";

  const dashboard = data?.data as DashboardResponse | undefined;

  const summary = dashboard?.summary;

  const categoryData = dashboard?.categoryStats ?? [];

  const monthlyMap: Record<string, any> = {};

  dashboard?.monthlyStats?.forEach((item) => {
    const { month, year, type } = item._id;

    const key = `${month}/${year}`;

    if (!monthlyMap[key]) {
      monthlyMap[key] = {
        month: `T${month}`,
        income: 0,
        expense: 0,
      };
    }

    if (type === "INCOME") {
      monthlyMap[key].income = item.total;
    } else {
      monthlyMap[key].expense = item.total;
    }
  });

  const monthlyData = Object.values(monthlyMap);

  return (
    <div className="space-y-6">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Số dư">
            <p
              className={`text-2xl font-bold ${
                summary?.balance && summary.balance >= 0
                  ? "text-blue-600"
                  : "text-orange-600"
              }`}
            >
              {formatCurrency(summary?.balance || 0, currency)}
            </p>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Thu nhập">
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(summary?.totalIncome || 0, currency)}
            </p>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Chi tiêu">
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(summary?.totalExpense || 0, currency)}
            </p>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card
            title={
              <Space>
                <PieChartOutlined /> Phân bổ chi tiêu theo danh mục
              </Space>
            }
            className="rounded-2xl border-none shadow-sm h-full focus:outline-none"
          >
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    activeShape={false}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="total"
                    nameKey="_id"
                    label
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value) =>
                      `${Number(value ?? 0).toLocaleString()} VND`
                    }
                  />

                  <RechartsLegend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* BAR CHART */}

        <Col span={12}>
          <Card
            title={
              <Space>
                <BarChartOutlined /> Thu nhập & Chi tiêu theo tháng
              </Space>
            }
            className="rounded-2xl border-none shadow-sm h-full"
          >
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />

                  <XAxis dataKey="month" axisLine={false} tickLine={false} />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v / 1000000}M`}
                  />

                  <Tooltip
                    formatter={(value) =>
                      `${Number(value ?? 0).toLocaleString()} VND`
                    }
                    cursor={{ fill: "none" }}
                  />

                  <RechartsLegend />

                  <Bar
                    dataKey="income"
                    name="Thu nhập"
                    fill="#82ca9d"
                    radius={[4, 4, 0, 0]}
                  />

                  <Bar
                    dataKey="expense"
                    name="Chi tiêu"
                    fill="#ff7875"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
