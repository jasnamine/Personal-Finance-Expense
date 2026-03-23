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
import { COLORS } from "../../constants/Constant";
import type { CategoryStat, MonthlyStat } from "../../models/Dashboard";

interface AnalyticsChartsProps {
  categoryData: CategoryStat[];
  monthlyData: MonthlyStat[];
}

const AnalyticsCharts = ({
  categoryData,
  monthlyData,
}: AnalyticsChartsProps) => {
  return (
    <Row gutter={16}>
      <Col span={12}>
        <Card
          title={
            <Space>
              <PieChartOutlined /> Expense Distribution
            </Space>
          }
          className="shadow-sm h-full"
        >
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
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
                  formatter={(v) => `${Number(v).toLocaleString()} VND`}
                />
                <RechartsLegend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </Col>

      <Col span={12}>
        <Card
          title={
            <Space>
              <BarChartOutlined /> Income & Expenses
            </Space>
          }
          className="shadow-sm h-full"
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
                  formatter={(v) => `${Number(v).toLocaleString()} VND`}
                  cursor={{ fill: "none" }}
                />
                <RechartsLegend />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#82ca9d"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="expense"
                  name="Expenses"
                  fill="#ff7875"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default AnalyticsCharts;
