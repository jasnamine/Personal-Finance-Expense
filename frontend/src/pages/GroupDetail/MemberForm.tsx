import { DeleteOutlined, UserAddOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Input,
  Popconfirm,
  Select,
  Space,
  Typography,
} from "antd";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import z from "zod";
import AppButton from "../../components/Button/AppButton";
import InputError from "../../components/Input/InputError";
import ResourceURL from "../../constants/ResourceURL";
import useCreateApi from "../../hooks/use-create-api";
import useDeleteApi from "../../hooks/use-delete-api";
import useUpdateApi from "../../hooks/use-update-api";
import NotifyUtils from "../../lib/NotifyUtils";
import { socket } from "../../lib/socket";
import type {
  GroupMember,
  GroupMemberRequest,
  GroupMemberResponse,
} from "../../models/Group";
import { useAuthStore } from "../../stores/authStore";
import type { GroupRole } from "../../types";

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
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      role: "VIEWER",
    },
  });
  const { user } = useAuthStore();
  const currentUserRole = members.find((m) => m.userId === user?.id)?.role;
  const isOwner = currentUserRole === "OWNER";

  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  useEffect(() => {
    socket.emit("join:group", id);

    return () => {
      socket.emit("leave:group", id);
    };
  }, [id]);

  const createApi = useCreateApi<GroupMemberRequest, GroupMemberResponse>(
    ResourceURL.GROUP_MEMBER,
  );

  const updateApi = useUpdateApi<
    GroupMemberRequest & { id: string },
    GroupMemberResponse
  >(ResourceURL.GROUP_MEMBER, "group-members");

  const deleteApi = useDeleteApi<GroupMember>(
    ResourceURL.GROUP_MEMBER,
    "group-members",
  );

  if (!id) {
    return null;
  }

  const handleChangeRole = (userId: string, newRole: GroupRole) => {
    updateApi.mutate(
      {
        id,
        userId,
        role: newRole,
        groupId: id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["group-members", "getAll"],
          });
          queryClient.invalidateQueries({
            queryKey: ["group-detail", "getById", id],
          });
        },
        onError: (err: any) => {
          NotifyUtils.error(
            err.response?.data?.message ||
              "Cập nhật thất bại! Vui lòng thử lại",
          );
        },
      },
    );
  };

  const handleAddMember = (data: z.infer<typeof memberSchema>) => {
    createApi.mutate(
      {
        email: data.email,
        role: data.role as GroupRole,
        groupId: id,
      },
      {
        onSuccess: () => {
          form.reset();
          queryClient.invalidateQueries({
            queryKey: ["group-members", "getById", id],
          });
          queryClient.invalidateQueries({
            queryKey: ["group-detail", "getById", id],
          });
        },
        onError: (err: any) => {
          NotifyUtils.error(
            err.response?.data?.message ||
              "Đăng nhập thất bại! Vui lòng thử lại.",
          );
        },
      },
    );
  };

  const handleDelete = (userId: string) => {
    deleteApi.mutate(
      {
        id,
        requestBody: { userId },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["group-members", "getById", id],
          });

          queryClient.invalidateQueries({
            queryKey: ["group-detail", "getById", id],
          });
        },
      },
    );
  };

  useEffect(() => {
    if (!id) return;

    const handleCreated = () => {
      queryClient.invalidateQueries({
        queryKey: ["group-detail", "getById", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["group-members", "getById", id],
      });
    };

    const handleUpdated = () => {
      queryClient.invalidateQueries({
        queryKey: ["group-detail", "getById", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["group-members", "getById", id],
      });
    };

    const handleDeleted = () => {
      queryClient.invalidateQueries({
        queryKey: ["group-detail", "getById", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["group-members", "getById", id],
      });
    };

    socket.on("member:updated", handleUpdated);
    socket.on("member:added", handleCreated);
    socket.on("member:deleted", handleDeleted);

    return () => {
      socket.off("member:updated", handleUpdated);
      socket.off("member:added", handleCreated);
      socket.off("member:deleted", handleDeleted);
    };
  }, [id, queryClient]);

  return (
    <form onSubmit={form.handleSubmit(handleAddMember)}>
      <label className="block mb-1 font-medium ">
        Thêm thành viên vào nhóm
      </label>
      <div className="flex gap-2">
        <Controller
          name="email"
          control={form.control}
          render={({ field }) => (
            <Input
              {...field}
              prefix={<UserAddOutlined className="text-gray-400" />}
              placeholder="Nhập email hoặc tên người dùng..."
              size="large"
              className="rounded-lg h-10"
            />
          )}
        />
        <AppButton
          size="large"
          className="rounded-lg h-10 px-6"
          type="primary"
          htmlType="submit"
        >
          Thêm
        </AppButton>
      </div>
      <InputError error={form.formState.errors?.email?.message} />

      <label className="block mb-1 mt-2 font-medium">
        Danh sách thành viên ({members.length})
      </label>
      <div className="space-y-2">
        {members.map((item) => (
          <div
            key={item.userId}
            className="flex items-center justify-between py-3 px-4 bg-gray-50/50 hover:bg-gray-50 rounded-xl transition-all border border-gray-100"
          >
            <Space size="middle">
              <Avatar size={40}>{item.email?.charAt(0).toUpperCase()}</Avatar>

              <div>
                <Text strong className="text-sm">
                  {item.email}
                </Text>
              </div>
            </Space>
            <Space size="small">
              {/* LOGIC MỚI: Luôn hiện Role, nhưng chỉ Owner mới được chỉnh sửa */}
              {isOwner ? (
                <Select<GroupRole>
                  size="small"
                  className="w-[130px]"
                  value={item.role}
                  onChange={(value) => handleChangeRole(item.userId, value)}
                >
                  <Option value="OWNER">Chủ sở hữu</Option>
                  {item.role !== "OWNER" && (
                    <Option value="EDITOR">Biên tập viên</Option>
                  )}
                  {item.role !== "OWNER" && (
                    <Option value="VIEWER">Người xem</Option>
                  )}
                </Select>
              ) : (
                /* Nếu không phải Owner, chỉ hiển thị nhãn (Tag) hoặc Text */
                <div className="px-3 py-1 bg-gray-200/50 rounded-md text-[10px] text-gray-600 font-semibold uppercase">
                  {item.role === "OWNER"
                    ? "Chủ sở hữu"
                    : item.role === "EDITOR"
                      ? "Biên tập"
                      : "Người xem"}
                </div>
              )}

              {/* Nút Xóa: Chỉ Owner mới nhìn thấy và không được xóa chính mình */}
              {isOwner && item.role !== "OWNER" && (
                <Popconfirm
                  title="Xóa thành viên?"
                  description={`Xóa ${item.email} khỏi nhóm?`}
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
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center">
        <Popconfirm
          title="Rời khỏi nhóm?"
          description="Bạn sẽ không còn truy cập được dữ liệu chi tiêu của nhóm này."
          // onConfirm={handleLeaveGroup}
          okText="Rời nhóm"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
        >
          <AppButton danger className="font-medium">
            Rời khỏi nhóm này
          </AppButton>
        </Popconfirm>
      </div>
    </form>
  );
};

export default MemberForm;
