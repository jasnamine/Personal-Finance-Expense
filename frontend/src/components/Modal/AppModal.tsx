import { Button, Modal } from "antd";
import { Plus } from "lucide-react";
import type React from "react";

interface AppModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  onSubmit: () => void;
  isFooterVisible?: boolean;
}

const AppModal = ({
  isOpen,
  onClose,
  children,
  title,
  onSubmit,
  isFooterVisible = true,
}: AppModalProps) => {
  return (
    <Modal
      title={<div className="pb-1 border-b">{title}</div>}
      open={isOpen}
      onCancel={onClose}
      footer={
        isFooterVisible && [
          <Button key="cancel" size="large" onClick={onClose}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            size="large"
            icon={<Plus />}
            onClick={onSubmit}
          >
            {title}
          </Button>,
        ]
      }
      centered
    >
      <section className="py-1">{children}</section>
    </Modal>
  );
};

export default AppModal;
