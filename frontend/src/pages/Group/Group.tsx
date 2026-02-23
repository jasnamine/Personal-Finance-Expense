import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Content } from "antd/es/layout/layout";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import AppCard from "../../components/Card/AppCard";
import AppModal from "../../components/Modal/AppModal";
import ResourceURL from "../../constants/ResourceURL";
import useCreateApi from "../../hooks/use-create-api";
import useGetAllApi from "../../hooks/use-get-all-api";
import type { GroupRequest, GroupResponse } from "../../models/Group";
import GroupForm from "./GroupForm";
import GroupList from "./GroupList";

export const groupSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên nhóm!"),
  description: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  baseCurrency: z.string(),
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

  const queryClient = useQueryClient();

  const { data: groupData } = useGetAllApi<GroupResponse>(
    ResourceURL.GROUP,
    "groups",
  );

  const createApi = useCreateApi<GroupRequest, GroupResponse>(
    ResourceURL.GROUP,
  );

  const groupList = groupData?.data ?? [];

  const handleSubmit = (data: GroupRequest) => {
    createApi.mutate(data, {
      onSuccess: () => {
        setIsModalOpen(false);
        form.reset();
        queryClient.invalidateQueries({
          queryKey: ["groups", "getAll"],
        });
      },
    });
  };

  return (
    <Content>
      <AppCard title={"Nhóm của bạn"} onClick={() => setIsModalOpen(true)}>
        <section>
          <GroupList groups={groupList} />
        </section>
      </AppCard>
      <AppModal
        title={"Thêm nhóm"}
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
