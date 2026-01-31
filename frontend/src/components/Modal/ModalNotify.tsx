import { CheckCircleFilled } from "@ant-design/icons";
import { Modal, Result, Typography } from "antd";
import AppButton from "../Button/AppButton";

const { Text, Title } = Typography;

interface ModalNotifyProps {
  isModalOpen: boolean;
  handleClose: () => void;
}

const ModalNotify = ({ isModalOpen, handleClose }: ModalNotifyProps) => {
  return (
    <Modal
      open={isModalOpen}
      onCancel={handleClose}
      footer={null}
      centered
      width={450}
      closeIcon={null}
    >
      <div className="relative pt-10 pb-8 px-6 text-center">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-32 bg-blue-50 -z-10" />

        <Result
          icon={
            <CheckCircleFilled style={{ fontSize: "72px", color: "#52c41a" }} />
          }
          title={
            <Title level={2} style={{ marginTop: "16px", color: "#1a1a1a" }}>
              Đăng ký thành công!
            </Title>
          }
          subTitle={
            <div className="px-4">
              <Text type="secondary" className="text-base block mb-6">
                Chào mừng bạn gia nhập cộng đồng.
              </Text>
            </div>
          }
          extra={[
            <AppButton
              key="later"
              type="text"
              className="mt-2 text-gray-500 hover:text-blue-600"
              onClick={handleClose}
            >
              Bỏ qua lúc này
            </AppButton>,
          ]}
        />
      </div>
    </Modal>
  );
};

export default ModalNotify;
