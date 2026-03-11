import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import ResourceURL from "../../constants/ResourceURL";
import useDeleteByIdApi from "../../hooks/usde-delete-by-id-api";
import useCreateApi from "../../hooks/use-create-api";
import useUpdateApi from "../../hooks/use-update-api";
import { socket } from "../../lib/socket";
import type {
  GroupExpenseRequest,
  GroupExpenseResponse,
  GroupMember,
} from "../../models/Group";
import ExpenseGroupForm from "../../pages/Group/ExpenseGroupForm";
import AppCard from "../Card/AppCard";
import ExpenseList from "../Lists/ExpenseGroupList";
import AppModal from "../Modal/AppModal";

interface Props {
  expenses: GroupExpenseResponse[];
  currency: string;
  members: GroupMember[];
}

export const splitSchema = z.object({
  userId: z.string(),
  value: z.number().min(0, "Số tiền phải lớn hơn hoặc bằng 0"),
  splitType: z.enum(["EQUAL", "EXACT"], {
    message: "Chọn phương thức chia tiền",
  }),
});

export const groupExpenseSchema = z
  .object({
    description: z.string().optional(),
    amount: z.number().min(1, "Số tiền phải lớn hơn 0"),
    paidBy: z.string().min(1, "Chọn người trả tiền"),
    date: z.date(),
    splitType: z.enum(["EQUAL", "EXACT"], {
      message: "Chọn phương thức chia tiền",
    }),
    splits: z.array(splitSchema),
  })
  .superRefine((data, ctx) => {
    if (data.splitType === "EXACT") {
      const sum = data.splits.reduce((a, b) => a + (b.value || 0), 0);

      if (Math.abs(sum - data.amount) > 0.01) {
        ctx.addIssue({
          code: "custom",
          path: ["splits"],
          message: "Tổng tiền chia phải bằng tổng tiền",
        });
      }
    }
  });

const GroupExpensesTab = ({ expenses, currency, members }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] =
    useState<GroupExpenseResponse | null>(null);
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const form = useForm<z.infer<typeof groupExpenseSchema>>({
    resolver: zodResolver(groupExpenseSchema),
    defaultValues: {
      description: "",
      amount: 0,
      splitType: "EQUAL",
      paidBy: "",
      date: new Date(),
      splits: [],
    },
  });

  const createApi = useCreateApi<GroupExpenseRequest, GroupExpenseResponse>(
    ResourceURL.EXPENSE_GROUP,
  );

  const updateApi = useUpdateApi<
    GroupExpenseRequest & { id: string },
    GroupExpenseResponse
  >(ResourceURL.EXPENSE_GROUP_UPDATE(id as string), "group-detail");

  const deleteApi = useDeleteByIdApi(
    ResourceURL.EXPENSE_GROUP_DELETE(id as string),
    "group-detail",
  );

  const handleSubmit = (data: GroupExpenseRequest) => {
    const payload = {
      ...data,
      groupId: id,
      splits: data.splits?.map((s) => ({
        ...s,
        splitType: data.splitType,
      })),
    };
    if (editingExpense) {
      updateApi.mutate(
        {
          id: editingExpense._id,
          ...data,
          splits: data.splits?.map((s) => ({
            userId: s.userId,
            value: s.value,
            splitType: data.splitType,
          })),
        },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingExpense(null);
            form.reset();
          },
        },
      );
    } else {
      createApi.mutate(payload, {
        onSuccess: () => {
          setIsModalOpen(false);
          form.reset();
          queryClient.invalidateQueries({
            queryKey: ["group-detail", "get-by-id"],
          });
        },
      });
    }
  };

  useEffect(() => {
    if (editingExpense) {
      form.reset({
        description: editingExpense.description,
        amount: editingExpense.amount,
        paidBy: editingExpense.paidById,
        date: new Date(editingExpense.date),
        splitType: editingExpense.splits[0].splitType,
        splits: editingExpense.splits,
      });
    }
  }, [editingExpense]);

  useEffect(() => {
    if (!id) return;
    socket.emit("join:group", id);

    return () => {
      socket.emit("leave:group", id);
    };
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const handleAdd = () => {
      queryClient.invalidateQueries({
        queryKey: ["group-detail", "getById", id],
      });
    };

    const handleUpdate = () => {
      queryClient.invalidateQueries({
        queryKey: ["group-detail", "getById", id],
      });
    };

    const handleDelete = () => {
      queryClient.invalidateQueries({
        queryKey: ["group-detail", "getById", id],
      });
    };

    socket.on("expense-group:update", (data) => {
      console.log("received update", data);

      queryClient.invalidateQueries({
        queryKey: ["group-detail", "getById"],
      });
    });

    socket.on("expense-group:add", handleAdd);
    socket.on("expense-group:update", handleUpdate);
    socket.on("expense-group:delete", handleDelete);

    socket.on("expense-group:update", (data) => {
      console.log("expense-group:update received", data);
    });

    return () => {
      socket.off("expense-group:add", handleAdd);
      socket.off("expense-group:update", handleUpdate);
      socket.off("expense-group:delete", handleDelete);
    };
  }, [id]);

  const handleUpdateGroupExpense = (expense: GroupExpenseResponse) => {
    setEditingExpense(expense);

    setIsModalOpen(true);
  };

  const handleDeleteGroupExpense = (id: string) => {
    deleteApi.mutate(id);
  };
  return (
    <AppCard
      title="Danh sách chi tiêu"
      onClick={() => {
        setEditingExpense(null);
        form.reset({
          description: "",
          amount: 0,
          paidBy: "",
          date: new Date(),
          splitType: "EQUAL",
          splits: [],
        });
        setIsModalOpen(true);
      }}
    >
      <div className="flex justify-between mb-6">
        <AppModal
          title={
            editingExpense ? "Cập nhật chi tiêu nhóm" : "Thêm chi tiêu nhóm"
          }
          isOpen={isModalOpen}
          onSubmit={form.handleSubmit(handleSubmit)}
          onClose={() => setIsModalOpen(false)}
        >
          <ExpenseGroupForm form={form} members={members} />
        </AppModal>

        <div className="w-full">
          <ExpenseList
            expenses={expenses}
            currency={currency}
            onEditGroupExpense={handleUpdateGroupExpense}
            onDeleteGroupExpense={handleDeleteGroupExpense}
          />
        </div>
      </div>
    </AppCard>
  );
};

export default GroupExpensesTab;
