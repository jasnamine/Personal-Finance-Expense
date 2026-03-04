import { GoogleOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Card, Divider, Typography } from "antd";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { publicApi } from "../../api";
import type { ErrorMessage } from "../../api/ApiService";
import AppButton from "../../components/Button/AppButton";
import AppInput from "../../components/Input/AppInput";
import InputError from "../../components/Input/InputError";
import ResourceURL from "../../constants/ResourceURL";
import NotifyUtils from "../../lib/NotifyUtils";
import type { LoginRequest, LoginResponse } from "../../models/Authetication";
import {useAuthStore} from "../../stores/authStore"

const { Title, Text } = Typography;

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Tối thiểu 6 ký tự"),
});

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation<LoginResponse, ErrorMessage, LoginRequest>({
    mutationFn: (data) => publicApi.post(ResourceURL.LOGIN, data),
    onSuccess: (data) => {
      setAuth({
        user: data.data,
        accessToken: data.data.accessToken,
        isAuthenticated: true,
      });
      NotifyUtils.success("Đăng nhập thành công! Chuyển đến trang chủ...");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    },
    onError: (err: any) => {
      NotifyUtils.error(
        err.response.data.message || "Đăng nhập thất bại! Vui lòng thử lại.",
      );
    },
  });

  const onSubmit = (data: LoginRequest) => {
    loginMutation.mutate(data);
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

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <Controller
            name="email"
            control={form.control}
            render={({ field }) => (
              <AppInput
                type="email"
                prefix={<MailOutlined />}
                placeholder="Email"
                {...field}
              />
            )}
          />

          <InputError error={form.formState.errors.email} />

          <Controller
            name="password"
            control={form.control}
            render={({ field }) => (
              <AppInput
                type="password"
                prefix={<LockOutlined />}
                placeholder="Password"
                {...field}
              />
            )}
          />
          <InputError error={form.formState.errors.password} />

          <AppButton type="primary" htmlType="submit" block>
            Đăng nhập
          </AppButton>

          <div style={{ textAlign: "center", marginTop: 16 }}>
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </div>

          <Divider plain style={{ color: "#8c8c8c", fontSize: "12px" }}>
            Hoặc đăng nhập với
          </Divider>

          <AppButton icon={<GoogleOutlined />} size="large" block>
            Tiếp tục với Google
          </AppButton>
        </form>
      </Card>
    </div>
  );
};

export default Login;
