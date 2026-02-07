import { Breadcrumb } from "antd";
import { Content } from "antd/es/layout/layout";
import { useLocation } from "react-router-dom";

const Dashboard = () => {
  const location = useLocation();
  console.log(location.pathname);
  return (
    <Content>
      <Breadcrumb style={{ margin: 2 }} items={[{ title: "Home" }]} />
      <div>Content</div>
    </Content>
  );
};
export default Dashboard;
