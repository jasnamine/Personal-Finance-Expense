import { DatePicker, Input, InputNumber, Select } from "antd";
import dayjs from "dayjs";
import { Controller, type UseFormReturn } from "react-hook-form";
import ReceiptUpload from "../../components/Upload/ReceiptUpload";
import type { CategoryResponse } from "../../models/Category";
import type { ExpenseRequest } from "../../models/Expense";

interface IncomeFormProps {
  form: UseFormReturn<ExpenseRequest>;
  categories: CategoryResponse[];
}

const ExpenseForm = ({ form, categories }: IncomeFormProps) => {
  return (
    <form>
      <label className="block mb-1 font-medium">Số tiền</label>
      <Controller
        name="amount"
        control={form.control}
        render={({ field }) => (
          <InputNumber
            {...field}
            placeholder="Số tiền"
            size="large"
            style={{ width: "100%" }}
          />
        )}
      />

      <label className="block mb-1 mt-2 font-medium">Mô tả</label>
      <Controller
        name="description"
        control={form.control}
        render={({ field }) => (
          <Input {...field} placeholder="Mô tả" size="large" type="text" />
        )}
      />

      <label className="block mb-1 mt-2 font-medium">Danh mục</label>
      <Controller
        name="categoryId"
        control={form.control}
        render={({ field }) => (
          <Select
            {...field}
            className="w-full"
            placeholder="Chọn danh mục"
            options={categories.map((category) => ({
              value: category._id,
              label: category.name,
            }))}
          />
        )}
      />

      <label className="block mb-1 mt-2 font-medium">Ngày</label>
      <Controller
        name="date"
        control={form.control}
        render={({ field }) => (
          <DatePicker
            className="w-full"
            value={field.value ? dayjs(field.value) : null}
            onChange={(d) => field.onChange(d?.toDate())}
          />
        )}
      />

      <label className="block mb-1 mt-2 font-medium">Hóa đơn</label>
      <ReceiptUpload form={form} name="receiptUrl" />
    </form>
  );
};

export default ExpenseForm;
