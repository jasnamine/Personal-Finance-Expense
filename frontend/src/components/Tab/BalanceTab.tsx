import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import z from "zod";
import type { ListResponse } from "../../api/ApiService";
import ResourceURL from "../../constants/ResourceURL";
import useCreateApi from "../../hooks/use-create-api";
import useGetById from "../../hooks/use-get-by-id";
import { socket } from "../../lib/socket";
import type { GroupMember } from "../../models/Group";
import type { Balance, Debt, SettleRequest } from "../../models/Settlement";
import AppCard from "../Card/AppCard";
import MemberBalanceCard from "../Card/MemberBalanceCard";
import SettleForm from "../Form/SettleForm";
import AppModal from "../Modal/AppModal";
import { useAuthStore } from "../../stores/authStore";
import type { GroupRole } from "../../types";

interface Props {
  members: GroupMember[];
  currency: string;
}

export const SettleSchema = z.object({
  fromUserId: z.string().min(1, "Please select the payer"),
  toUserId: z.string().min(1, "Please select the receiver"),
  amount: z.number().positive("Amount must be greater than 0"),
  method: z.string().optional(),
  date: z.date(),
});

const BalanceTab = ({ members, currency }: Props) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams() as { id: string };
  const form = useForm<SettleRequest>({
    resolver: zodResolver(SettleSchema),
    defaultValues: {
      fromUserId: undefined,
      toUserId: undefined,
      amount: 0,
      method: "cash",
      date: undefined,
    },
  });
  const { user } = useAuthStore();
  const currentUserRole = members.find((m) => m.userId === user?.id)
    ?.role as GroupRole;

  const { data: balances } = useGetById<ListResponse<Balance>>(
    ResourceURL.BALANCE,
    "balances",
    id,
  );

  const { data: debts } = useGetById<ListResponse<Debt>>(
    ResourceURL.SETTLEMENT,
    "settlements",
    id,
  );

  const createApi = useCreateApi<SettleRequest, Debt>(
    ResourceURL.SETTLEMENT_CREATE(id),
  );

  const balanceList = balances?.data ?? [];
  const debtList = debts?.data ?? [];

  const handleSubmit = (data: SettleRequest) => {
    createApi.mutate(data, {
      onSuccess: () => {
        setIsModalOpen(false);
        form.reset();
        queryClient.invalidateQueries({
          queryKey: ["settlements", "getById", id],
        });
        queryClient.invalidateQueries({
          queryKey: ["balances", "getById", id],
        });
      },
    });
  };

  useEffect(() => {
    if (!id) return;
    socket.emit("join:group", id);

    return () => {
      socket.emit("leave:group", id);
    };
  }, [id]);

  useEffect(() => {
    socket.on("settlement:created", () => {
      queryClient.invalidateQueries({
        queryKey: ["settlements", "getById", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["balances", "getById", id],
      });
    });

    return () => {
      socket.off("settlement:created");
    };
  }, [id]);

  return (
    <AppCard
      title="Member Balances"
      role={currentUserRole}
      onClick={() => {
        setIsModalOpen(true);
      }}
    >
      <div className="flex justify-between mb-6">
        <AppModal
          title="Record Member Payment"
          isOpen={isModalOpen}
          onSubmit={form.handleSubmit(handleSubmit)}
          onClose={() => setIsModalOpen(false)}
        >
          <SettleForm form={form} members={members} debts={debtList} />
        </AppModal>

        <div className="w-full">
          <MemberBalanceCard
            members={members}
            balances={balanceList}
            currency={currency}
          />
        </div>
      </div>
    </AppCard>
  );
};

export default BalanceTab;
