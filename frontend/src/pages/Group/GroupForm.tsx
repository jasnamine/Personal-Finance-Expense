import { Col, DatePicker, Input, Row, Select } from "antd";
import dayjs from "dayjs";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { GroupRequest } from "../../models/Group";
import { useEffect, useState } from "react";

interface GroupFormProps {
  form: UseFormReturn<GroupRequest>;
}

interface CurrencyOption {
  value: string;
  label: string;
  searchLabel: string;
}

const GroupForm = ({ form }: GroupFormProps) => {
  const [currencies, setCurrencies] = useState<CurrencyOption[]>([]);
  const [loadingCurrencies, setLoadingCurrencies] = useState(false);
  useEffect(() => {
    const fetchCurrencies = async () => {
      setLoadingCurrencies(true);

      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=currencies,name",
        );

        const data = await response.json();

        const currencyMap: Record<string, any> = {};

        data.forEach((country: any) => {
          if (country.currencies) {
            Object.entries(country.currencies).forEach(
              ([code, details]: any) => {
                if (!currencyMap[code]) {
                  currencyMap[code] = {
                    code,
                    name: details.name,
                    country: country.name.common,
                  };
                }
              },
            );
          }
        });

        const options: CurrencyOption[] = Object.values(currencyMap)
          .sort((a: any, b: any) => a.code.localeCompare(b.code))
          .map((item: any) => ({
            value: item.code,
            label: `${item.code} - ${item.country} (${item.name})`,
            searchLabel: `${item.code} ${item.country} ${item.name}`,
          }));

        setCurrencies(options);
      } catch {
      } finally {
        setLoadingCurrencies(false);
      }
    };

    fetchCurrencies();
  }, []);
  return (
    <form>
      <label className="block mb-1 font-medium">Tên nhóm</label>
      <Controller
        name="name"
        control={form.control}
        render={({ field }) => (
          <Input {...field} placeholder="Tên nhóm" size="large" />
        )}
      />

      <label className="block mt-2 mb-1 font-medium">Tiền tệ cơ bản</label>
      <Controller
        name="baseCurrency"
        control={form.control}
        render={({ field }) => (
          <Select
            {...field}
            className="w-full" // mt-1 để tạo khoảng cách nhỏ với text phía trên
            size="large"
            loading={loadingCurrencies}
            showSearch
            options={currencies}
            placeholder="Chọn tiền tệ"
          />
        )}
      />

      <Row gutter={16}>
        <Col span={12}>
          <label className="block mt-2 mb-1 font-medium">Ngày bắt đầu</label>
          <Controller
            name="startDate"
            control={form.control}
            rules={{ required: "Ngày bắt đầu là bắt buộc" }}
            render={({ field }) => (
              <>
                <DatePicker
                  className="w-full"
                  size="large"
                  placeholder="Chọn ngày bắt đầu"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) =>
                    field.onChange(date ? date.toDate() : null)
                  }
                />
              </>
            )}
          />
        </Col>

        <Col span={12}>
          <label className="block mt-2 mb-1 font-medium">Ngày kết thúc</label>
          <Controller
            name="endDate"
            control={form.control}
            rules={{ required: "Ngày kết thúc là bắt buộc" }}
            render={({ field }) => (
              <>
                <DatePicker
                  className="w-full"
                  size="large"
                  placeholder="Chọn ngày kết thúc"
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

      <label className="block mt-2 mb-1 font-medium">
        Mô tả
      </label>
      <Controller
        name="description"
        control={form.control}
        render={({ field }) => (
          <Input.TextArea
            {...field}
            placeholder="Mô tả ngắn gọn về nhóm..."
            rows={3}
            size="large"
          />
        )}
      />
    </form>
  );
};

export default GroupForm;
