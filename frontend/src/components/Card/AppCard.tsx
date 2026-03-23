import { PlusOutlined } from "@ant-design/icons";
import { Card } from "antd";
import AppButton from "../Button/AppButton";
import type { GroupRole } from "../../types";
interface AppCardProps {
  onClick: () => void;
  title: string;
  children: React.ReactElement;
  role?: GroupRole;
}

const AppCard = ({ onClick, title, children, role }: AppCardProps) => {
 const canCreate = !role || role === "OWNER" || role === "EDITOR";
  return (
    <Card
      title={title}
      className="shadow-sm border-none"
      extra={
        canCreate && (
          <AppButton
            icon={<PlusOutlined />}
            type="primary"
            block
            onClick={onClick}
          >
            Add New
          </AppButton>
        )
      }
    >
      {children}
    </Card>
  );
};

export default AppCard;
