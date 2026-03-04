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
            queryKey: ["group-members", "get-by-id", id],
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
    deleteApi.mutate({
      id,
      requestBody: {
        userId,
      },
    });
  };

  useEffect(() => {
    if (!id) return;

    // UPDATE
    const handleUpdated = (updatedMember: GroupMember) => {
      queryClient.setQueryData<GroupMemberResponse>(
        ["group-members", "getById", id],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: {
              ...oldData.data,
              members: oldData.data.members.map((m) =>
                m.userId === updatedMember.userId
                  ? { ...m, ...updatedMember } // MERGE !!!
                  : m,
              ),
            },
          };
        },
      );
    };

    // CREATE
    const handleCreated = (newMember: GroupMember) => {
      queryClient.setQueryData<GroupMemberResponse>(
        ["group-members", "getById", id],
        (oldData) => {
          if (!oldData) return oldData;

          // tránh duplicate
          const exists = oldData.data.members.some(
            (m) => m.userId === newMember.userId,
          );

          if (exists) return oldData;

          return {
            ...oldData,
            data: {
              ...oldData.data,
              members: [...oldData.data.members, newMember],
            },
          };
        },
      );
    };

    // DELETE
    const handleDeleted = (payload: { userId: string }) => {
      queryClient.setQueryData<GroupMemberResponse>(
        ["group-members", "getById", id],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: {
              ...oldData.data,
              members: oldData.data.members.filter(
                (m) => m.userId !== payload.userId,
              ),
            },
          };
        },
      );
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
      <InputError error={form.formState.errors?.email} />

      {/* Tiền tệ cơ bản */}

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
              <Select<GroupRole>
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
        ))}
      </div>
    </form>
  );
};

export default MemberForm;
