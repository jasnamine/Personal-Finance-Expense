import { Content } from "antd/es/layout/layout";
import { useState } from "react";
import AppCard from "../../components/Card/AppCard";
import GroupDetail from "./GroupDetail";
import GroupList from "./GroupList";

const Group = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Content>
      <AppCard title={"Nhóm của bạn"} onClick={() => setIsModalOpen(true)}>
        <section>
          <GroupList />
        </section>
      </AppCard>
      <GroupDetail />
    </Content>
  );
};

export default Group;
