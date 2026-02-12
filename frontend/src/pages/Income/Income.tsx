import { zodResolver } from "@hookform/resolvers/zod";
import { Content } from "antd/es/layout/layout";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AppCard from "../../components/Card/AppCard";
import Filter from "../../components/Filter/Filter";
import AppModal from "../../components/Modal/AppModal";
import ResourceURL from "../../constants/ResourceURL";
import useGetAllApi from "../../hooks/use-get-all-api";
import type { CategoryResponse } from "../../models/Category";
import type { GroupResponse } from "../../models/Group";
import IncomeForm from "./IncomeForm";
import IncomeList from "./IncomeList";

export const expenseSchema = z.object({
  description: z.string().optional(),
  amount: z.number().int().min(1).max(10000000000),
  type: z.enum(["INCOME", "EXPENSE"], {
    message: "Phải chọn loại hợp lệ!",
  }),
  categoryId: z.string("Vui lòng chọn danh mục!"),
  groupId: z.string().optional(),
  date: z.string().min(1, "Vui lòng chọn ngày!"),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;

const Income = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [rangeDate, setRangeDate] = useState<{
    from: string;
    to: string;
  } | null>(null);

  // Chỉ nhận các field có trong schema
  const form = useForm<z.infer<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: "",
      amount: 0,
      type: "INCOME",
      categoryId: "",
      groupId: "",
      date: "",
    },
  });

  console.log(search, rangeDate, filterCategory, isModalOpen);

  const { data } = useGetAllApi<CategoryResponse>(
    ResourceURL.CATEGORY,
    "categories",
  );

  const { data: group } = useGetAllApi<GroupResponse>(
    ResourceURL.GROUP,
    "groups",
  );
  const categoriesList = data?.data ?? [];
  const groupsList = group?.data ?? [];

  const handleSubmit = (values: z.infer<typeof expenseSchema>) => {
    console.log("Submit values:", values);
  };

  return (
    <Content>
      <AppCard title={"Thu nhập"} onClick={() => setIsModalOpen(true)}>
        <section>
          <Filter
            categories={categoriesList}
            handleSearch={(e) => setSearch(e.target.value)}
            handleFilterCategory={(id) => setFilterCategory(id)}
            handleRangeDate={(range) => {
              if (!range) {
                setRangeDate(null);
                return;
              }

              setRangeDate({
                from: range[0].format("YYYY-MM-DD"),
                to: range[1].format("YYYY-MM-DD"),
              });
            }}
          />
          <IncomeList />
        </section>
      </AppCard>
      <AppModal
        title={"Thêm danh mục"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <IncomeForm
          form={form}
          categories={categoriesList}
          groups={groupsList}
        />
      </AppModal>
    </Content>
  );
};

export default Income;
