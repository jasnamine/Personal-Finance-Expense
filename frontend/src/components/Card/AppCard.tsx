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
        <AppButton type="primary" size="large" block onClick={onClick}>
          Thêm mới
        </AppButton>
      }
    >
      {children}
    </Card>
  );
};

export default AppCard;
