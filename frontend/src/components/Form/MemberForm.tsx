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
import { useNavigate, useParams } from "react-router-dom";
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
  email: z.string().email("Invalid email address"),
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
  const hasOtherOwner = members.some(
    (m) => m.role === "OWNER" && m.userId !== user?.id,
  );
  const navigate = useNavigate();

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

  const leaveGroupApi = useDeleteApi<GroupMember>(
    ResourceURL.GROUP_MEMBER_LEAVE,
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
            err.response?.data?.message || "Update failed! Please try again.",
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
            err.response?.data?.message || "Failed to add member.",
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

  const handleLeaveGroup = () => {
    if (!user?.id) return;

    leaveGroupApi.mutate(
      {
        id: id!,
        requestBody: { userId: user.id },
      },
      {
        onSuccess: () => {
          NotifyUtils.success("You have left the group.");
          navigate("/group");
          queryClient.invalidateQueries({
            queryKey: ["groups", "getAll"],
          });
        },
        onError: (err: any) => {
          NotifyUtils.error(
            err.response?.data?.message || "Error leaving group.",
          );
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
      <label className="block mb-1 font-medium ">Add Member to Group</label>
      <div className="flex gap-2">
        <Controller
          name="email"
          control={form.control}
          render={({ field }) => (
            <Input
              {...field}
              prefix={<UserAddOutlined className="text-gray-400" />}
              placeholder="Enter email"
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
          Add
        </AppButton>
      </div>
      <InputError error={form.formState.errors?.email?.message} />

      <label className="block mb-1 mt-2 font-medium">
        Member List ({members.length})
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
              {isOwner ? (
                <Select<GroupRole>
                  size="small"
                  className="w-[120px]"
                  value={item.role}
                  onChange={(value) => handleChangeRole(item.userId, value)}
                >
                  <Option value="OWNER">Owner</Option>
                  {item.role !== "OWNER" && (
                    <Option value="EDITOR">Editor</Option>
                  )}
                  {item.role !== "OWNER" && (
                    <Option value="VIEWER">Viewer</Option>
                  )}
                </Select>
              ) : (
                <div className="px-3 py-1 bg-gray-200/50 rounded-md text-[10px] text-gray-600 font-semibold uppercase">
                  {item.role}
                </div>
              )}

              {isOwner && item.role !== "OWNER" && (
                <Popconfirm
                  title="Remove member?"
                  description={`Are you sure you want to remove ${item.email}?`}
                  onConfirm={() => handleDelete(item.userId)}
                  okText="Remove"
                  cancelText="Cancel"
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
          title={
            isOwner && !hasOtherOwner ? "Cannot leave group" : "Leave Group?"
          }
          description={
            isOwner && !hasOtherOwner
              ? "You are the only owner. Please transfer ownership before leaving."
              : "You will no longer have access to this group's expense data."
          }
          onConfirm={() => {
            if (isOwner && !hasOtherOwner) {
              NotifyUtils.info("Please transfer OWNER role first!");
              return;
            }
            handleLeaveGroup();
          }}
          okText={isOwner && !hasOtherOwner ? "Understood" : "Leave Group"}
          cancelText="Cancel"
          okButtonProps={{ danger: true, disabled: isOwner && !hasOtherOwner }}
        >
          <Button
            danger
            ghost
            className="font-medium text-xs rounded-lg hover:opacity-80"
          >
            Leave this group
          </Button>
        </Popconfirm>
      </div>
    </form>
  );
};

export default MemberForm;
