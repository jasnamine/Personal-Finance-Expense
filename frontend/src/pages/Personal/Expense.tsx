import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AppCard from "../../components/Card/AppCard";
import Filter from "../../components/Filter/Filter";
import AppModal from "../../components/Modal/AppModal";
import ResourceURL from "../../constants/ResourceURL";
import useDeleteByIdApi from "../../hooks/usde-delete-by-id-api";
import useCreateApi from "../../hooks/use-create-api";
import useGetAllApi from "../../hooks/use-get-all-api";
import useUpdateApi from "../../hooks/use-update-api";
import type { CategoryResponse } from "../../models/Category";
import type { ExpenseRequest, ExpenseResponse } from "../../models/Expense";
import { useSearchStore } from "../../stores/searchStore";
import type { TransactionType } from "../../types";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";

export const expenseSchema = z.object({
  description: z.string().optional(),
  amount: z.number().min(1).max(10000000000, "Không hợp lệ"),
  categoryId: z.string("Vui lòng chọn danh mục!"),
  date: z.date().min(1, "Vui lòng chọn ngày!"),
  receiptUrl: z.string().optional(),
});

const Expense = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<TransactionType | null>(null);
  const [rangeDate, setRangeDate] = useState<{
    startDate: string;
    endDate: string;
  } | null>(null);
  const [page, setPage] = useState(1);

  const [editingExpense, setEditingExpense] = useState<ExpenseResponse | null>(
    null,
  );

  const { keyword } = useSearchStore();

  const queryClient = useQueryClient();

  const form = useForm<ExpenseRequest>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: "",
      amount: 0,
      categoryId: "Chọn danh mục",
      date: new Date(),
    },
  });

  const { data } = useGetAllApi<CategoryResponse>(
    ResourceURL.CATEGORY,
    "categories",
  );

  const { data: expenses } = useGetAllApi<ExpenseResponse>(
    ResourceURL.EXPENSE,
    "expenses",
    {
      page,
      size: 10,
      search: keyword || undefined,
      categoryId: filterCategory || undefined,
      type: filterType || undefined,
      startDate: rangeDate?.startDate,
      endDate: rangeDate?.endDate,
    },
  );

  const createApi = useCreateApi<ExpenseRequest, ExpenseResponse>(
    ResourceURL.EXPENSE,
  );

  const updateApi = useUpdateApi<
    ExpenseRequest & { id: string },
    ExpenseResponse
  >(ResourceURL.EXPENSE, "expenses");

  const deleteApi = useDeleteByIdApi(ResourceURL.EXPENSES, "expenses");

  const categoriesList = data?.data ?? [];
  const expenseList = expenses?.data ?? [];
  const total = expenses?.totalElements ?? 0;

  useEffect(() => {
    setPage(1);
  }, [keyword]);

  useEffect(() => {
    if (editingExpense) {
      form.reset({
        description: editingExpense.description,
        amount: editingExpense.amount,
        categoryId:
          (editingExpense.categoryId as any)?._id || editingExpense.categoryId,
        date: new Date(editingExpense.date),
      });
    }
  }, [editingExpense]);

  const handleSubmit = (data: ExpenseRequest) => {
    if (editingExpense) {
      updateApi.mutate(
        { ...data, id: editingExpense._id },
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
            queryKey: ["expenses", "getAll"],
          });
        },
      });
    }
  };

  const handleDeleteExpense = (id: string) => {
    deleteApi.mutate(id);
  };

  const handleEditExpense = (expense: ExpenseResponse) => {
    setIsModalOpen(true);
    setEditingExpense(expense);
  };

  return (
    <Content>
      <AppCard
        title={"Danh sách giao dịch"}
        onClick={() => {
          setEditingExpense(null);
          form.reset({
            description: "",
            amount: 0,
            categoryId: undefined,
            date: new Date(),
          });
          setIsModalOpen(true);
        }}
      >
        <section>
          <Filter
            categories={categoriesList}
            handleFilterCategory={(id) => setFilterCategory(id)}
            handleFilterTransactionType={(type) => setFilterType(type)}
            handleRangeDate={(range) => {
              if (!range) {
                setRangeDate(null);
                return;
              }

              setRangeDate({
                startDate: range[0].format("YYYY-MM-DD"),
                endDate: range[1].format("YYYY-MM-DD"),
              });
            }}
          />
          <ExpenseList
            expenses={expenseList}
            page={page}
            total={total}
            onChangePage={(p) => setPage(p)}
            onEditExpense={handleEditExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        </section>
      </AppCard>
      <AppModal
        title={editingExpense ? "Chỉnh sửa giao dịch" : "Thêm giao dịch"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <ExpenseForm form={form} categories={categoriesList} />
      </AppModal>
    </Content>
  );
};

export default Expense;
