import { SearchOutlined } from "@ant-design/icons";
import { DatePicker, Input, Select } from "antd";
import type { CategoryResponse } from "../../models/Category";
const { RangePicker } = DatePicker;
interface FilterProps {
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFilterCategory: (categoryId: string | null) => void;
  handleRangeDate: (range: any) => void;
  categories: CategoryResponse[];
}
const Filter = ({handleSearch, handleFilterCategory, handleRangeDate, categories} : FilterProps) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
      <Input
        placeholder="Tìm kiếm..."
        prefix={<SearchOutlined />}
        onChange={handleSearch}
        style={{ width: 200 }}
        allowClear
      />
      <Select
        placeholder="Danh mục"
        style={{ width: 180 }}
        allowClear
        onChange={handleFilterCategory}
        options={categories.map((c) => ({
          value: c._id,
          label: c.name,
        }))}
      />
      <RangePicker format="DD/MM/YYYY" onChange={handleRangeDate} />
    </div>
  );
};

export default Filter;
