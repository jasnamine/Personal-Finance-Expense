import { notification } from "antd";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import type { ReactNode } from "react";

class NotifyUtils {
  static success(message: ReactNode) {
    notification.open({
      message: "Thông báo",
      description: message,
      icon: <CheckCircleFilled style={{ color: "#52c41a" }} />,
      duration: 5,
    });
  }

  static error(message: ReactNode) {
    notification.open({
      message: "Thông báo",
      description: message,
      icon: <CloseCircleFilled style={{ color: "#ff4d4f" }} />,
      duration: 5,
    });
  }

  static info(message: ReactNode) {
    notification.open({
      message: "Thông báo",
      description: message,
      duration: 5,
    });
  }
}

export default NotifyUtils;
