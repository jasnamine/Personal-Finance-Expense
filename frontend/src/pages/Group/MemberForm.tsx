import { DeleteOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Avatar,
  Button,
  Input,
  List,
  Popconfirm,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import type { GroupMember } from "../../models/Group";

const { Text } = Typography;
const { Option } = Select;

interface MemberFormProps {
  members: GroupMember[];
}

export const memberSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  role: z.enum(["OWNER", "EDITOR", "VIEWER"]),
});

const MemberForm = ({ members }: MemberFormProps) => {
  const form = useForm<z.infer<typeof memberSchema>>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      email: "",
      role: "VIEWER",
    },
  });

  const handleChangeRole = (userId: string, newRole: string) => {
    // Gọi API để cập nhật vai trò của thành viên
    console.log(`Cập nhật vai trò của ${userId} thành ${newRole}`);
  };

  const handleDelete = (userId: string) => {
    // Gọi API để xóa thành viên khỏi nhóm
    console.log(`Xóa thành viên ${userId} khỏi nhóm`);
  };
  return (
    <form>
      <label className="block mb-1 ">Thêm thành viên:</label>
      <Controller
        name="email"
        control={form.control}
        render={({ field }) => (
          <Input {...field} placeholder="Email người muốn mời" size="large" />
        )}
      />
      {/* Tiền tệ cơ bản */}

      <label className="block mb-1 font-medium">Thành viên:</label>
      <List
        dataSource={members}
        renderItem={(item) => (
          <div className="flex items-center justify-between py-3 px-4 bg-gray-50/50 hover:bg-gray-50 rounded-xl transition-all mb-2 border border-gray-100">
            <Space size="middle">
              <Avatar size={40}>{item.email?.charAt(0).toUpperCase()}</Avatar>

              <div>
                <div className="flex items-center gap-2">
                  <Text strong className="text-sm">
                    {item.email}
                  </Text>

                  <Tag
                    color={
                      item.role === "OWNER"
                        ? "gold"
                        : item.role === "EDITOR"
                          ? "blue"
                          : "default"
                    }
                  >
                    {item.role}
                  </Tag>
                </div>
              </div>
            </Space>

            <Space size="small">
              <Select
                size="small"
                className="w-[150px]"
                value={item.role}
                onChange={(value) => handleChangeRole(item.userId, value)}
              >
                <Option value="OWNER">Chủ sở hữu</Option>
                <Option value="EDITOR">Biên tập viên</Option>
                <Option value="VIEWER">Người xem</Option>
              </Select>

              {item.role !== "OWNER" && (
                <Popconfirm
                  title="Xóa thành viên?"
                  description={`Xóa ${item.userId} khỏi nhóm?`}
                  onConfirm={() => handleDelete(item.userId)}
                  okText="Xóa"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true }}
                >
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                  />
                </Popconfirm>
              )}
            </Space>
          </div>
        )}
      />
    </form>
  );
};

export default MemberForm;
