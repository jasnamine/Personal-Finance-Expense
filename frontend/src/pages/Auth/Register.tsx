import {
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Form, Typography } from "antd";
import AppButton from "../../components/Button/AppButton";
import AppInput from "../../components/Input/AppInput";

const { Title, Text } = Typography;

const Register = () => {
  const onFinish = (values: any) => {
    console.log("Register data:", values);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f2f5",
      }}
    >
      <Card style={{ width: 400 }}>
        <Title level={2} style={{ textAlign: "center" }}>
          Đăng Ký
        </Title>
        <Text
          type="secondary"
          style={{ display: "block", textAlign: "center" }}
        >
          Tạo tài khoản mới miễn phí
        </Text>

        <Form layout="vertical" onFinish={onFinish} style={{ marginTop: 24 }}>
          {/* Username */}
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Vui lòng nhập tên người dùng" },
            ]}
          >
            <AppInput
              prefix={<UserOutlined />}
              placeholder="Tên người dùng"
            />
          </Form.Item>

          {/* Email */}
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <AppInput
              prefix={<MailOutlined />}
              placeholder="Email"
            />
          </Form.Item>

          {/* Password */}
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu" },
              { min: 6, message: "Mật khẩu tối thiểu 6 ký tự" },
            ]}
          >
            <AppInput
              type="password"
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
            />
          </Form.Item>

          {/* Submit */}
          <AppButton type="primary" htmlType="submit" block>
            Đăng ký
          </AppButton>

          {/* Link to login */}
          <div style={{ textAlign: "center", marginTop: 16 }}>
            Đã có tài khoản? <a href="/login">Đăng nhập</a>
          </div>

          {/* Google register */}
          <AppButton
            icon={
              <svg
                width="16"
                height="16"
                viewBox="0 0 48 48"
                style={{ marginRight: 4 }}
              >
                <path
                  fill="#FFC107"
                  d="M43.6 20.1H42V20H24v8h11.3C33.7 32.1 29.2 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.3 1 7.2 2.7l5.7-5.7C33.5 6.1 28.9 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.2-.4-3.9z"
                />
              </svg>
            }
            block
            centerContent
            style={{ marginTop: 12 }}
          >
            Đăng ký với Google
          </AppButton>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
