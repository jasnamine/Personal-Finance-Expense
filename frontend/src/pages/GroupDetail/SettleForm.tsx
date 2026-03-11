import { DatePicker, Input, InputNumber, Segmented, Select } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import InputError from "../../components/Input/InputError";
import type { GroupMember } from "../../models/Group";
import type { Debt, SettleRequest } from "../../models/Settlement";

interface Props {
  form: UseFormReturn<SettleRequest>;
  members: GroupMember[];
  debts: Debt[];
}

const SettleForm = ({ form, members, debts }: Props) => {
  const getUserById = (id: string) => {
    return members.find((m) => m.userId === id);
  };
  const [selectedDebt, setSelectedDebt] = useState<number | null>(null);
  const [mode, setMode] = useState<"suggest" | "manual">("suggest");
  const handleSelectDebt = (debt: Debt, index: number) => {
    setSelectedDebt(index);
    form.setValue("fromUserId", debt.fromUserId);
    form.setValue("toUserId", debt.toUserId);
    form.setValue("amount", debt.amount);
  };
  return (
    <form className="space-y-4">
      <Segmented
        className="mb-4"
        value={mode}
        onChange={(v) => setMode(v as "suggest" | "manual")}
        options={[
          { label: "Theo gợi ý", value: "suggest" },
          { label: "Tự nhập", value: "manual" },
        ]}
      />
      <div className="space-y-2">
        {mode === "suggest" && (
          <div className="space-y-2">
            {debts.map((debt, index) => {
              const fromUser = getUserById(debt.fromUserId);
              const toUser = getUserById(debt.toUserId);

              return (
                <div
                  key={index}
                  className={`p-3 border rounded-lg cursor-pointer ${
                    selectedDebt === index
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => handleSelectDebt(debt, index)}
                >
                  <div className="flex justify-between">
                    <span>
                      {fromUser?.email} → {toUser?.email}
                    </span>

                    <b>{debt.amount}</b>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {mode === "manual" && (
        <>
          <label className="block mb-1 font-medium">Người trả</label>
          <Controller
            name="fromUserId"
            control={form.control}
            render={({ field }) => (
              <Select
                {...field}
                className="w-full"
                placeholder="Chọn người trả"
                options={members.map((m) => ({
                  value: m.userId,
                  label: m.email,
                }))}
              />
            )}
          />
          <InputError error={form.formState.errors.fromUserId?.message} />

          {/* To User */}
          <label className="block mb-1 font-medium">Người nhận</label>
          <Controller
            name="toUserId"
            control={form.control}
            render={({ field }) => (
              <Select
                {...field}
                className="w-full"
                placeholder="Chọn người nhận"
                options={members.map((m) => ({
                  value: m.userId,
                  label: m.email,
                }))}
              />
            )}
          />
          <InputError error={form.formState.errors.toUserId?.message} />
        </>
      )}

      {/* Amount */}
      <label className="block mb-1 mt-2 font-medium">Số tiền</label>
      <Controller
        name="amount"
        control={form.control}
        render={({ field }) => (
          <InputNumber
            {...field}
            className="w-full"
            placeholder="Nhập số tiền"
          />
        )}
      />
      <InputError error={form.formState.errors.amount?.message} />

      {/* Method */}
      <label className="block mb-1 mt-2 font-medium">Phương thức</label>
      <Controller
        name="method"
        control={form.control}
        render={({ field }) => (
          <Select
            {...field}
            className="w-full"
            options={[
              { value: "cash", label: "Tiền mặt" },
              { value: "bank", label: "Chuyển khoản" },
              { value: "momo", label: "MoMo" },
              { value: "zalopay", label: "ZaloPay" },
              { value: "other", label: "Khác" },
            ]}
          />
        )}
      />

      {/* Date */}
      <label className="block mb-1 mt-2 font-medium">Ngày thanh toán</label>
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
      <InputError error={form.formState.errors.date?.message} />
    </form>
  );
};

export default SettleForm;
