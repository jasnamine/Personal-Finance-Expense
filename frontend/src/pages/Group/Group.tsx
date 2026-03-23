import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Content } from "antd/es/layout/layout";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import AppCard from "../../components/Card/AppCard";
import AppModal from "../../components/Modal/AppModal";
import ResourceURL from "../../constants/ResourceURL";
import useDeleteByIdApi from "../../hooks/usde-delete-by-id-api";
import useCreateApi from "../../hooks/use-create-api";
import useGetAllApi from "../../hooks/use-get-all-api";
import useUpdateApi from "../../hooks/use-update-api";
import type { GroupRequest, GroupResponse } from "../../models/Group";
import GroupForm from "../../components/Form/GroupForm";
import GroupList from "../../components/List/GroupList";

export const groupSchema = z.object({
  name: z.string().min(1, "Please enter a group name!"),
  description: z.string().optional(),
  startDate: z.date("Start date is required"),
  endDate: z.date("End date is required"),
  baseCurrency: z.string().min(1, "Please select a base currency"),
});

const Group = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const form = useForm<GroupRequest>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: undefined,
      endDate: undefined,
      baseCurrency: "",
    },
  });
  const [editingGroup, setEditingGroup] = useState<GroupResponse | null>(null);

  useEffect(() => {
    if (editingGroup) {
      form.reset({
        name: editingGroup.name,
        description: editingGroup.description,
        startDate: editingGroup.startDate
          ? dayjs(editingGroup.startDate).toDate()
          : new Date(),

        endDate: editingGroup.endDate
          ? dayjs(editingGroup.endDate).toDate()
          : new Date(),
        baseCurrency: editingGroup.baseCurrency,
      });
    }
  }, [editingGroup, form]);

  const queryClient = useQueryClient();

  const { data: groupData } = useGetAllApi<GroupResponse>(
    ResourceURL.GROUP,
    "groups",
  );

  const createApi = useCreateApi<GroupRequest, GroupResponse>(
    ResourceURL.GROUP,
  );

  const updateApi = useUpdateApi<GroupRequest & { id: string }, GroupResponse>(
    ResourceURL.GROUP,
    "groups",
  );

  const deleteApi = useDeleteByIdApi(ResourceURL.GROUP, "groups");

  const groupList = groupData?.data ?? [];

  const handleSubmit = (data: GroupRequest) => {
    if (editingGroup) {
      updateApi.mutate(
        { ...data, id: editingGroup._id },
        {
          onSuccess: () => {
            setIsModalOpen(false);
          },
        },
      );
    } else {
      createApi.mutate(data, {
        onSuccess: () => {
          setIsModalOpen(false);
          form.reset();
          queryClient.invalidateQueries({
            queryKey: ["groups", "getAll"],
          });
        },
      });
    }
  };

  const handleEditGroup = (group: GroupResponse) => {
    setEditingGroup(group);
    setIsModalOpen(true);
  };

  const handleDeleteGroup = (id: string) => {
    deleteApi.mutate(id);
  };

  return (
    <Content>
      <AppCard
        title={"Your Groups"}
        onClick={() => {
          setEditingGroup(null);
          form.reset({
            name: "",
            description: "",
            startDate: undefined,
            endDate: undefined,
            baseCurrency: "",
          });
          setIsModalOpen(true);
        }}
      >
        <section>
          <GroupList
            groups={groupList}
            onEditGroup={handleEditGroup}
            onDeleteGroup={handleDeleteGroup}
          />
        </section>
      </AppCard>
      <AppModal
        title={editingGroup ? "Edit Group" : "Add New Group"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <GroupForm form={form} />
      </AppModal>
    </Content>
  );
};

export default Group;
