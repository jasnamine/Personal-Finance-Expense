import { Button, Modal } from "antd";
import { Plus } from "lucide-react";
import type React from "react";

interface AppModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const AppModal = ({ isOpen, onClose, children, title }: AppModalProps) => {
  return (
    <Modal
      title={<div className="pb-1 border-b">{title}</div>}
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button size="large" onClick={onClose}>
          Hủy
        </Button>,
        <Button type="primary" htmlType="submit" size="large" icon={<Plus />}>
          {title}
        </Button>,
      ]}
      centered
    >
      <section className="py-1">{children}</section>
    </Modal>
  );
};

export default AppModal;
