import { DatePicker, Input, Radio, Select } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { Controller, useWatch, type UseFormReturn } from "react-hook-form";
import ReceiptUpload from "../../components/Upload/ReceiptUpload";
import type { GroupExpenseRequest, GroupMember } from "../../models/Group";
import SplitMoneySection from "./SplitMoneySection";

interface Props {
  form: UseFormReturn<GroupExpenseRequest>;
  members: GroupMember[];
}

const ExpenseGroupForm = ({ form, members }: Props) => {
  console.log(members);
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
    if (splitType === "EQUAL" && amount && members.length > 0) {
      const equalAmount = amount / members.length;
      form.setValue(
        "splits",
        members.map((m) => ({
          userId: m.userId,
          value: Number(equalAmount.toFixed(2)),
        })),
      );
    }
  }, [amount, splitType, members, form]);

  useEffect(() => {
    if (splitType === "PERCENTAGE" && amount && splits) {
      const updated = splits.map((s) => ({
        ...s,
        value: Number(((s.value / 100) * amount).toFixed(2)),
      }));

      form.setValue("splits", updated);
    }
  }, [amount, splitType]);

  return (
    <form className="space-y-4">
      <label className="block mb-1 ">Mô tả</label>
      <Controller
        name="description"
        control={form.control}
        rules={{ required: "Nhập mô tả" }}
        render={({ field }) => (
          <Input {...field} placeholder="Mô tả chi tiêu" />
        )}
      />

      <label className="block mb-1 mt-2 font-medium">Tổng số tiền</label>
      <Controller
        name="amount"
        control={form.control}
        rules={{ required: "Nhập số tiền" }}
        render={({ field }) => <Input {...field} className="w-full" />}
      />

      <label className="block mb-1 mt-2 font-medium ">Người trả</label>
      <Controller
        name="paidBy"
        control={form.control}
        render={({ field }) => (
          <Select
            {...field}
            className="w-full"
            placeholder="Người trả"
            options={members.map((m) => ({
              value: m.userId,
              label: m.email,
            }))}
          />
        )}
      />

      <label className="block mb-1 mt-2 font-medium ">Ngày trả</label>
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

      <label className="block mb-1 mt-2 font-medium ">
        Phương thức chia tiền
      </label>
      <Controller
        name="splitType"
        control={form.control}
        render={({ field }) => (
          <Radio.Group {...field}>
            <Radio value="EQUAL">Chia đều</Radio>
            <Radio value="EXACT">Số tiền cụ thể</Radio>
          </Radio.Group>
        )}
      />

        <SplitMoneySection form={form} members={members} />
      <label className="block mb-1 mt-4 font-medium">Hóa đơn</label>
      <ReceiptUpload form={form} />
    </form>
  );
};

export default ExpenseGroupForm;
