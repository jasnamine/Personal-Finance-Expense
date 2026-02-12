import { PlusOutlined } from "@ant-design/icons";
import { Card } from "antd";
import AppButton from "../Button/AppButton";
interface AppCardProps {
  onClick: () => void;
  title: string;
  children: React.ReactElement;
}

const AppCard = ({ onClick, title, children }: AppCardProps) => {
  return (
    <Card
      title={title}
      className="shadow-sm border-none"
      extra={
        <AppButton
          icon={<PlusOutlined />}
          type="primary"
          block
          onClick={onClick}
        >
          Thêm mới
        </AppButton>
      }
    >
      {children}
    </Card>
  );
};

export default AppCard;
