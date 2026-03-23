import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Card, Typography } from "antd";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { publicApi } from "../../api";
import type { ErrorMessage } from "../../api/ApiService";
import AppButton from "../../components/Button/AppButton";
import AppInput from "../../components/Input/AppInput";
import InputError from "../../components/Input/InputError";
import ResourceURL from "../../constants/ResourceURL";
import NotifyUtils from "../../lib/NotifyUtils";
import type {
  RegisterRequest,
  RegistrationResponse,
} from "../../models/Authetication";

const { Title, Text } = Typography;

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .max(30, "Username cannot exceed 30 characters"),
    email: z.string().email("Invalid email format"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const Register = () => {
  const navigate = useNavigate();

  const form = useForm<RegisterRequest>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const registerMutation = useMutation<
    RegistrationResponse,
    ErrorMessage,
    RegisterRequest
  >({
    mutationFn: (data) => publicApi.post(ResourceURL.REGISTER, data),
    onSuccess: () => {
      NotifyUtils.success("Registration successful! Redirecting to login");
      form.reset();
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    },
    onError: (err: any) => {
      NotifyUtils.error(
        err.response.data.message || "Registration failed. Please try again.",
      );
    },
  });

  const onSubmit = (data: RegisterRequest) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
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

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <Controller
            name="username"
            control={form.control}
            render={({ field }) => (
              <AppInput
                placeholder="Username"
                {...field}
                prefix={<UserOutlined />}
              />
            )}
          />

          <InputError error={form.formState.errors.username?.message} />
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

          <InputError error={form.formState.errors.email?.message} />

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
          <InputError error={form.formState.errors.password?.message} />

          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field }) => (
              <AppInput
                type="password"
                prefix={<LockOutlined />}
                placeholder="Confirm password"
                {...field}
              />
            )}
          />

          <InputError error={form.formState.errors.confirmPassword?.message} />

          <AppButton type="primary" htmlType="submit" block>
            Register
          </AppButton>

          <div style={{ textAlign: "center", marginTop: 16 }}>
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Register;
