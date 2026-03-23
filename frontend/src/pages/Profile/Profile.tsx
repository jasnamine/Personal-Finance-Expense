import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Input,
  Row,
  Select,
  Space,
  Typography,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { privateApi } from "../../api";
import ResourceURL from "../../constants/ResourceURL";
import type { ProfileForm } from "../../models/Authetication";
import { useAuthStore } from "../../stores/authStore";
import {
  fetchCurrencyOptions,
  type CurrencyOption,
} from "../../utils/currency";
import { getInitials } from "../../utils/getInitials";
import InputError from "../../components/Input/InputError";

const { Title, Text } = Typography;

export const profileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(30, "Username cannot exceed 30 characters"),

  email: z.string().email("Invalid email address"),
  currency: z.string().min(1, "Please select a currency"),
});

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [currencies, setCurrencies] = useState<CurrencyOption[]>([]);
  const [loadingCurrencies, setLoadingCurrencies] = useState(false);

  const { user, setAuth } = useAuthStore();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      email: "",
      currency: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        email: user.email,
        currency: user.currency,
      });
    }
  }, [user, reset]);

  const queryClient = useQueryClient();

  const { mutate: updateProfile } = useMutation<any, Error, ProfileForm>({
    mutationFn: (body: ProfileForm) => privateApi.put(ResourceURL.USER, body),

    onSuccess: (data) => {
      const updatedUser = data.data;

      if (user) {
        setAuth({
          user: {
            ...user,
            username: updatedUser.username,
            currency: updatedUser.currency,
          },
        });
      }
      message.success("Profile updated successfully!");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (err: any) => {
      message.error(err?.message || "Failed to update profile");
    },
  });

  const onSubmit = (data: ProfileForm) => {
    updateProfile(data);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoadingCurrencies(true);
      try {
        const options = await fetchCurrencyOptions();
        setCurrencies(options);
      } catch {
        message.error("Failed to load currency list");
      } finally {
        setLoadingCurrencies(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="animate-in">
      <Card
        className="rounded-2xl shadow-sm border-none overflow-hidden"
        title={
          <Space>
            <UserOutlined /> User Profile
          </Space>
        }
        extra={
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center justify-center py-2">
            <Avatar
              style={{ backgroundColor: "red", verticalAlign: "middle" }}
              size={80}
            >
              {getInitials(user?.email)}
            </Avatar>

            <Title level={5} style={{ margin: "12px 0 0 0" }}>
              {user?.username}
            </Title>
          </div>

          <Divider />

          <Row justify="center" gutter={16} className="mb-4">
            <Col span={16}>
              <Text strong className="block mb-1">
                Username
              </Text>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <Input {...field} size="large" disabled={!isEditing} />
                )}
              />
            </Col>
          </Row>
          <InputError error={errors?.username?.message} />

          <Row justify="center" gutter={16} className="mb-4">
            <Col span={16}>
              <Text strong className="block mb-1">
                Email
              </Text>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input {...field} size="large" disabled />
                )}
              />
            </Col>
          </Row>

          <Row justify="center" gutter={16}>
            <Col span={16}>
              <div className="flex flex-col">
                <Text strong className="block mb-1">
                  Default Currency
                </Text>
                <Controller
                  name="currency"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className="w-full mt-1"
                      size="large"
                      loading={loadingCurrencies}
                      disabled={!isEditing}
                      showSearch
                      options={currencies}
                      placeholder="Select currency"
                    />
                  )}
                />
              </div>
            </Col>
          </Row>
          <InputError error={errors?.currency?.message} />
          {isEditing && (
            <Row justify="center">
              <Col span={16}>
                <div className="flex justify-end mt-6">
                  <Button
                    htmlType="submit"
                    type="primary"
                    className="bg-blue-600 border-blue-600 h-10 px-8 rounded-lg shadow-md hover:bg-blue-700"
                  >
                    Save Changes
                  </Button>
                </div>
              </Col>
            </Row>
          )}
        </form>
      </Card>
    </div>
  );
};

export default Profile;
