import { DatePicker, Select } from "antd";
import type { CategoryResponse } from "../../models/Category";
import type { TransactionType } from "../../types";
const { RangePicker } = DatePicker;
interface FilterProps {
  handleFilterCategory: (categoryId: string) => void;
  handleFilterTransactionType : (type: TransactionType) => void;
  handleRangeDate: (range: any) => void;
  categories: CategoryResponse[];
}
const Filter = ({
  handleFilterCategory,
  handleFilterTransactionType,
  handleRangeDate,
  categories,
}: FilterProps) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
      <Select
        placeholder="Loại giao dịch"
        style={{ width: 180 }}
        allowClear
        onChange={(val) =>
          handleFilterTransactionType(val === "all" ? undefined : val)
        }
        options={[
          { value: "INCOME", label: "Thu nhập" },
          { value: "EXPENSE", label: "Chi tiêu" },
          { value: "all", label: "Tất cả" },
        ]}
      />
      <Select
        placeholder="Danh mục"
        style={{ width: 180 }}
        allowClear
        onChange={(val) =>
          handleFilterCategory(val === "all" ? undefined : val)
        }
        options={[
          { value: "all", label: "Tất cả" },
          ...categories.map((c) => ({
            value: c._id,
            label: c.name,
          })),
        ]}
      />
      <RangePicker format="DD/MM/YYYY" onChange={handleRangeDate} />
    </div>
  );
};

export default Filter;
