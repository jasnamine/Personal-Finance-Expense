import { Card, Col, Row, Skeleton } from "antd";
import React, { useMemo, Suspense } from "react";
import ResourceURL from "../../constants/ResourceURL";
import useGetAllApi from "../../hooks/use-get-all-api";
import type { DashboardResponse } from "../../models/Dashboard";
import { useAuthStore } from "../../stores/authStore";
import { formatCurrency } from "../../utils/formatCurrency";
const AnalyticsCharts = React.lazy(
  () => import("../../components/Chart/AnalyticsCharts"),
);

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

  const monthlyData = useMemo(() => {
    const monthlyMap: Record<string, any> = {};

    dashboard?.monthlyStats?.forEach((item) => {
      const { month, year, type } = item._id;
      const key = `${month}/${year}`;

      if (!monthlyMap[key]) {
      monthlyMap[key] = { month: `M${month}`, income: 0, expense: 0 };
      }

      if (type === "INCOME") monthlyMap[key].income = item.total;
      else monthlyMap[key].expense = item.total;
    });

    return Object.values(monthlyMap);
  }, [dashboard?.monthlyStats]);

  return (
    <div className="space-y-6">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Total Balance">
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
          <Card title="Total Income">
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(summary?.totalIncome || 0, currency)}
            </p>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Total Expense">
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(summary?.totalExpense || 0, currency)}
            </p>
          </Card>
        </Col>
      </Row>
      <Suspense fallback={<Skeleton active paragraph={{ rows: 8 }} />}>
        <AnalyticsCharts
          categoryData={categoryData}
          monthlyData={monthlyData}
        />
      </Suspense>
    </div>
  );
};

export default Dashboard;
