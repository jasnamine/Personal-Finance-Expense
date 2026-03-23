import { DatePicker, InputNumber, Segmented, Select } from "antd";
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
          { label: "Suggested", value: "suggest" },
          { label: "Manual Entry", value: "manual" },
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
          <label className="block mb-1 font-medium">Paid by</label>
          <Controller
            name="fromUserId"
            control={form.control}
            render={({ field }) => (
              <Select
                {...field}
                className="w-full"
                placeholder="Who is paying?"
                options={members.map((m) => ({
                  value: m.userId,
                  label: m.email,
                }))}
              />
            )}
          />
          <InputError error={form.formState.errors.fromUserId?.message} />

          {/* To User */}
          <label className="block mb-1 font-medium">Receiver</label>
          <Controller
            name="toUserId"
            control={form.control}
            render={({ field }) => (
              <Select
                {...field}
                className="w-full"
                placeholder="Who receives?"
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
      <label className="block mb-1 mt-2 font-medium">Amount</label>
      <Controller
        name="amount"
        control={form.control}
        render={({ field }) => (
          <InputNumber
            {...field}
            className="w-full"
            style={{ width: "100%" }}
            placeholder="Enter amount"
          />
        )}
      />
      <InputError error={form.formState.errors.amount?.message} />

      {/* Method */}
      <label className="block mb-1 mt-2 font-medium">Method</label>
      <Controller
        name="method"
        control={form.control}
        render={({ field }) => (
          <Select
            {...field}
            className="w-full"
            options={[
              { value: "cash", label: "Cash" },
              { value: "bank", label: "Bank Transfer" },
              { value: "momo", label: "MoMo" },
              { value: "zalopay", label: "ZaloPay" },
              { value: "other", label: "Other" },
            ]}
          />
        )}
      />

      {/* Date */}
      <label className="block mb-1 mt-2 font-medium">Payment Date</label>
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
    </form>
  );
};

export default SettleForm;
