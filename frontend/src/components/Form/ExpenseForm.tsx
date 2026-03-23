import { DatePicker, Input, InputNumber, Select } from "antd";
import dayjs from "dayjs";
import { Controller, type UseFormReturn } from "react-hook-form";
import ReceiptUpload from "../../components/Upload/ReceiptUpload";
import type { CategoryResponse } from "../../models/Category";
import type { ExpenseRequest } from "../../models/Expense";
import InputError from "../Input/InputError";

interface IncomeFormProps {
  form: UseFormReturn<ExpenseRequest>;
  categories: CategoryResponse[];
}

const ExpenseForm = ({ form, categories }: IncomeFormProps) => {
  return (
    <form>
      <label className="block mb-1 font-medium">Amount</label>
      <Controller
        name="amount"
        control={form.control}
        render={({ field }) => (
          <InputNumber
            {...field}
            placeholder="Enter amount"
            size="large"
            style={{ width: "100%" }}
          />
        )}
      />
      <InputError error={form.formState.errors.amount?.message} />

      <label className="block mb-1 font-medium">Description</label>
      <Controller
        name="description"
        control={form.control}
        render={({ field }) => (
          <Input
            {...field}
            placeholder="What is this for?"
            size="large"
            type="text"
          />
        )}
      />

      <label className="block mb-1 font-medium">Category</label>
      <Controller
        name="categoryId"
        control={form.control}
        render={({ field }) => (
          <Select
            {...field}
            className="w-full"
            placeholder="Select a category"
            options={categories.map((category) => ({
              value: category._id,
              label: category.name,
            }))}
          />
        )}
      />
      <InputError error={form.formState.errors.categoryId?.message} />

      <label className="block mb-1 mt-2 font-medium">Date</label>
      <Controller
        name="date"
        control={form.control}
        render={({ field }) => (
          <DatePicker
            className="w-full"
            placeholder="Select date"
            value={field.value ? dayjs(field.value) : null}
            onChange={(d) => field.onChange(d?.toDate())}
          />
        )}
      />
      <InputError error={form.formState.errors.date?.message} />

      <label className="block mb-1 mt-2 font-medium">Receipt Image</label>
      <ReceiptUpload form={form} name="receiptUrl" />
    </form>
  );
};

export default ExpenseForm;
