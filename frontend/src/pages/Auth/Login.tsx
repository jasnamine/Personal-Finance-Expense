import { GoogleOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { Card, Divider, Form, Typography } from "antd";
import AppButton from "../../components/Button/AppButton";
import AppInput from "../../components/Input/AppInput";

const { Title, Text } = Typography;

const Login = () => {
  const onFinish = (values: any) => {
    console.log("Login data:", values);
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
          Đăng Nhập
        </Title>
        <Text
          type="secondary"
          style={{ display: "block", textAlign: "center" }}
        >
          Quản lý chi tiêu của bạn ngay hôm nay
        </Text>

        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ remember: true }}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <AppInput prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <AppInput
              type="password"
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
            />
          </Form.Item>
          <AppButton type="primary" htmlType="submit" block>
            Đăng nhập
          </AppButton>
          <div style={{ textAlign: "center", marginTop: 16 }}>
            {" "}
            Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>{" "}
          </div>{" "}
          <Divider plain style={{ color: "#8c8c8c", fontSize: "12px" }}>
            Hoặc đăng nhập với
          </Divider>{" "}
          <AppButton
            icon={<GoogleOutlined />}
            size="large"
            block
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderColor: "#d9d9d9",
            }}
          >
            {" "}
            Tiếp tục với Google{" "}
          </AppButton>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
