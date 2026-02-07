import { Card } from "antd";
import AppButton from "../Button/AppButton";
interface AppCardProps{
    onClick: () => void;
    title: string;
}

const AppCard = ({ onClick, title }: AppCardProps) => {
  return (
    <Card
      title={title}
      className="shadow-sm border-none"
      extra={
        <AppButton type="primary" size="large" block onClick={onClick}>
          Thêm mới
        </AppButton>
      }
    ></Card>
  );
};

export default AppCard;