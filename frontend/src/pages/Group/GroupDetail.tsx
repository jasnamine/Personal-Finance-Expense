import { Empty, Skeleton, Tabs, Typography } from "antd";
import { useParams } from "react-router-dom";
import ResourceURL from "../../constants/ResourceURL";
import useGetById from "../../hooks/use-get-by-id";
import type { GroupDetailResponse } from "../../models/Group";
import GroupDetailHeader from "./GroupDetailHeader";
import BalanceTab from "../../components/Tabs/BalanceTab";
import GroupExpensesTab from "../../components/Tabs/GroupExpensesTab";
import MemberForm from "./MemberForm";

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

  const { id } = useParams() as { id: string };

  const { data, isLoading } = useGetById<GroupDetailResponse>(
    ResourceURL.GROUP,
    "groups",
    id,
  );

  if (isLoading) return <Skeleton />;

  if (!data) return <Empty />;
  return (
    <div className="pb-10">
      <GroupDetailHeader group={data} />

      <Tabs
        items={[
          {
            key: "expenses",
            label: "Chi tiêu",
            children: (
              <GroupExpensesTab
                expenses={data?.expenses ?? []}
                currency={data.group.baseCurrency}
              />
            ),
          },
          {
            key: "balances",
            label: "Số dư",
            children: (
              <BalanceTab
                members={data.members}
                currency={data.group.baseCurrency}
              />
            ),
          },
        ]}
      />
      <MemberForm members={data.members} />
    </div>
  );
};

export default GroupDetail;
