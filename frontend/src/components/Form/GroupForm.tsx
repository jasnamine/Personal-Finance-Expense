import { Col, DatePicker, Input, message, Row, Select } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { GroupRequest } from "../../models/Group";
import {
  fetchCurrencyOptions,
  type CurrencyOption,
} from "../../utils/currency";
import InputError from "../Input/InputError";

interface GroupFormProps {
  form: UseFormReturn<GroupRequest>;
}

const GroupForm = ({ form }: GroupFormProps) => {
  const [currencies, setCurrencies] = useState<CurrencyOption[]>([]);
  const [loadingCurrencies, setLoadingCurrencies] = useState(false);
  useEffect(() => {
    const loadData = async () => {
      setLoadingCurrencies(true);
      try {
        const options = await fetchCurrencyOptions();
        setCurrencies(options);
      } catch {
        message.error("Failed to load currency list");
      } finally {
        setLoadingCurrencies(false);
      }
    };
    loadData();
  }, []);
  return (
    <form>
      <label className="block mb-1 font-medium">Group Name</label>
      <Controller
        name="name"
        control={form.control}
        rules={{ required: "Group name is required" }}
        render={({ field }) => (
          <Input
            {...field}
            placeholder="e.g. Thailand Trip 2026, Roommates..."
            size="large"
          />
        )}
      />
      <InputError error={form?.formState?.errors?.name?.message} />

      <label className="block mt-2 mb-1 font-medium">Base Currency</label>
      <Controller
        name="baseCurrency"
        control={form.control}
        rules={{ required: "Please select a currency" }}
        render={({ field }) => (
          <Select
            {...field}
            className="w-full"
            size="large"
            loading={loadingCurrencies}
            showSearch
            options={currencies}
            placeholder="Select primary currency"
          />
        )}
      />
      <InputError error={form?.formState?.errors?.baseCurrency?.message} />
      <Row gutter={16}>
        <Col span={12}>
          <label className="block mt-2 mb-1 font-medium">Start Date</label>
          <Controller
            name="startDate"
            control={form.control}
            rules={{ required: "Start date is required" }}
            render={({ field }) => (
              <>
                <DatePicker
                  className="w-full"
                  size="large"
                  placeholder="Pick date"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) =>
                    field.onChange(date ? date.toDate() : null)
                  }
                />
              </>
            )}
          />
        </Col>
      </Row>
      <InputError error={form?.formState?.errors?.startDate?.message} />

      <Row gutter={16}>
        <Col span={12}>
          <label className="block mt-2 mb-1 font-medium">End Date</label>
          <Controller
            name="endDate"
            control={form.control}
            rules={{ required: "End date is required" }}
            render={({ field }) => (
              <>
                <DatePicker
                  className="w-full"
                  size="large"
                  placeholder="Pick date"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) =>
                    field.onChange(date ? date.toDate() : null)
                  }
                />
              </>
            )}
          />
        </Col>
      </Row>
      <InputError error={form?.formState?.errors?.endDate?.message} />

      <label className="block mt-2 mb-1 font-medium">Description</label>
      <Controller
        name="description"
        control={form.control}
        render={({ field }) => (
          <Input.TextArea
            {...field}
            placeholder="Brief description about the group..."
            rows={3}
            size="large"
          />
        )}
      />
    </form>
  );
};

export default GroupForm;
