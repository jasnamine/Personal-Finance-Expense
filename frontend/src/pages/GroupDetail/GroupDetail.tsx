import { Empty, Skeleton, Tabs } from "antd";
import { useParams } from "react-router-dom";
import BalanceTab from "../../components/Tab/BalanceTab";
import GroupExpensesTab from "../../components/Tab/GroupExpensesTab";
import ResourceURL from "../../constants/ResourceURL";
import useGetById from "../../hooks/use-get-by-id";
import type {
  GroupDetailResponse,
  GroupMemberResponse,
} from "../../models/Group";
import GroupDetailHeader from "./GroupDetailHeader";

const GroupDetail = () => {
  const { id } = useParams() as { id: string };

  const { data, isLoading } = useGetById<GroupDetailResponse>(
    ResourceURL.GROUP,
    "group-detail",
    id,
  );

  const { data: membersData } = useGetById<GroupMemberResponse>(
    ResourceURL.GROUP_MEMBER,
    "group-members",
    id,
  );

  const member = membersData?.data?.members ?? [];


  if (isLoading) return <Skeleton />;

  if (!data) return <Empty />;
  return (
    <div className="pb-10">
      <GroupDetailHeader group={data} members={member} />
      <Tabs
        items={[
          {
            key: "expenses",
            label: "Expenses",
            children: (
              <GroupExpensesTab
                expenses={data?.expenses ?? []}
                currency={data.group.baseCurrency}
                members={data.members ?? []}
              />
            ),
          },
          {
            key: "balances",
            label: "Balances",
            children: (
              <BalanceTab
                members={data.members ?? []}
                currency={data.group.baseCurrency}
              />
            ),
          },
        ]}
      />
    </div>
  );
};

export default GroupDetail;
