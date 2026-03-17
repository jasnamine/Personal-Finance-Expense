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
import { useAuthStore } from "../../stores/authStore";

const { Title, Text } = Typography;

interface CurrencyOption {
  value: string;
  label: string;
  searchLabel: string;
}

interface ProfileForm {
  username: string;
  email: string;
  currency: string;
}

export const profileSchema = z.object({
  username: z.string().min(8, "Username phải có ít nhất 8 ký tự"),

  email: z.string().email("Email không hợp lệ"),

  currency: z.string().min(1, "Vui lòng chọn tiền tệ"),
});

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [currencies, setCurrencies] = useState<CurrencyOption[]>([]);
  const [loadingCurrencies, setLoadingCurrencies] = useState(false);

  const { user, setAuth } = useAuthStore();

  const { control, handleSubmit, reset } = useForm<ProfileForm>({
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
      message.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (err: any) => {
      message.error(err?.message || "Cập nhật thất bại");
    },
  });

  const onSubmit = (data: ProfileForm) => {
    updateProfile(data);
  };

  useEffect(() => {
    const fetchCurrencies = async () => {
      setLoadingCurrencies(true);

      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=currencies,name",
        );

        const data = await response.json();

        const currencyMap: Record<string, any> = {};

        data.forEach((country: any) => {
          if (country.currencies) {
            Object.entries(country.currencies).forEach(
              ([code, details]: any) => {
                if (!currencyMap[code]) {
                  currencyMap[code] = {
                    code,
                    name: details.name,
                    country: country.name.common,
                  };
                }
              },
            );
          }
        });

        const options: CurrencyOption[] = Object.values(currencyMap)
          .sort((a: any, b: any) => a.code.localeCompare(b.code))
          .map((item: any) => ({
            value: item.code,
            label: `${item.code} - ${item.country} (${item.name})`,
            searchLabel: `${item.code} ${item.country} ${item.name}`,
          }));

        setCurrencies(options);
      } catch {
        message.error("Không thể tải danh sách tiền tệ");
      } finally {
        setLoadingCurrencies(false);
      }
    };

    fetchCurrencies();
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return "??";
    const parts = name.split(" ");
    return parts.length === 1
      ? parts[0][0].toUpperCase()
      : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="animate-in">
      <Card
        className="rounded-2xl shadow-sm border-none overflow-hidden"
        title={
          <Space>
            <UserOutlined /> Thông tin chi tiết
          </Space>
        }
        extra={
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Hủy" : "Chỉnh sửa"}
          </Button>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center justify-center py-2">
            <Avatar
              size={80}
              className="shadow-md text-4xl bg-blue-500 flex items-center justify-center"
            >
              {getInitials(user?.username)}
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
              {/* Bọc vào div để đẩy Select xuống dòng */}
              <div className="flex flex-col">
                <Text strong className="block mb-1">
                  Tiền tệ mặc định
                </Text>
                <Controller
                  name="currency"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className="w-full mt-1" // mt-1 để tạo khoảng cách nhỏ với text phía trên
                      size="large"
                      loading={loadingCurrencies}
                      disabled={!isEditing}
                      showSearch
                      options={currencies}
                      placeholder="Chọn tiền tệ"
                    />
                  )}
                />
              </div>
            </Col>
          </Row>
          {isEditing && (
            <Row justify="center">
              <Col span={16}>
                <div className="flex justify-end mt-6">
                  <Button
                    htmlType="submit"
                    type="primary"
                    className="bg-blue-600 border-blue-600 h-10 px-8 rounded-lg shadow-md hover:bg-blue-700"
                  >
                    Lưu thay đổi
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
