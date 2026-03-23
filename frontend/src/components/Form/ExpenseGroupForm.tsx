import { DatePicker, Input, InputNumber, Radio, Select } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Controller, useWatch, type UseFormReturn } from "react-hook-form";
import InputError from "../../components/Input/InputError";
import ReceiptUpload from "../../components/Upload/ReceiptUpload";
import type { GroupExpenseRequest, GroupMember } from "../../models/Group";
import SplitMoneySection from "../../pages/Group/SplitMoneySection";

interface Props {
  form: UseFormReturn<GroupExpenseRequest>;
  members: GroupMember[];
}

const ExpenseGroupForm = ({ form, members }: Props) => {
  const [exactSplits, setExactSplits] = useState<any[]>();
  const amount = useWatch({
    control: form.control,
    name: "amount",
  });

  const splitType = useWatch({
    control: form.control,
    name: "splitType",
  });

  const splits = useWatch({
    control: form.control,
    name: "splits",
  });

  useEffect(() => {
    if (splitType === "EXACT") {
      setExactSplits(splits);
    }
  }, [splits, splitType]);

  useEffect(() => {
    if (splitType === "EQUAL" && amount && members.length > 0) {
      const equalAmount = amount / members.length;
      form.setValue(
        "splits",
        members.map((m) => ({
          userId: m.userId,
          value: Number(equalAmount.toFixed(2)),
          splitType: splitType === "EQUAL" ? "EQUAL" : "EXACT",
        })),
      );
    }
    if (splitType === "EXACT" && exactSplits) {
      form.setValue("splits", exactSplits);
    }
  }, [amount, splitType, members, form]);

  return (
    <form className="space-y-4">
      <label className="block mb-1 font-medium">Description</label>
      <Controller
        name="description"
        control={form.control}
        render={({ field }) => (
          <Input {...field} placeholder="e.g. Group dinner, Taxi fare..." />
        )}
      />
      <InputError error={form.formState.errors.description?.message} />

      <label className="block mb-1 mt-2 font-medium">Total Amount</label>
      <Controller
        name="amount"
        control={form.control}
        rules={{ required: "Amount is required" }}
        render={({ field }) => (
          <InputNumber
            {...field}
            style={{ width: "100%" }}
            className="w-full"
            placeholder="0.00"
          />
        )}
      />
      <InputError error={form.formState.errors.amount?.message} />

      <label className="block mb-1 mt-2 font-medium ">Paid By</label>
      <Controller
        name="paidBy"
        control={form.control}
        render={({ field }) => (
          <Select
            {...field}
            className="w-full"
            placeholder="Who paid?"
            options={members.map((m) => ({
              value: m.userId,
              label: m.email,
            }))}
          />
        )}
      />
      <InputError error={form.formState.errors.paidBy?.message} />

      <label className="block mb-1 mt-2 font-medium ">Date</label>
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

      <label className="block mb-1 mt-2 font-medium ">Split Method</label>
      <Controller
        name="splitType"
        control={form.control}
        render={({ field }) => (
          <Radio.Group {...field}>
            <Radio value="EQUAL">Equally</Radio>
            <Radio value="EXACT">Exact Amounts</Radio>
          </Radio.Group>
        )}
      />
      <InputError error={form.formState.errors.splitType?.message} />
      <SplitMoneySection form={form} members={members} />
      <InputError error={form.formState.errors.splits?.message} />

      <label className="block mb-1 mt-4 font-medium">Receipt Image</label>
      <ReceiptUpload form={form} name="receiptUrl" />
    </form>
  );
};

export default ExpenseGroupForm;
