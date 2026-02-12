import { Col, Input, Radio, Row } from "antd";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { CategoryResponse } from "../../models/Category";
import type { GroupResponse } from "../../models/Group";
import type { ExpenseFormData } from "./Income";

interface IncomeFormProps {
  form: UseFormReturn<ExpenseFormData>;
  categories: CategoryResponse[];
  groups: GroupResponse[];
}

const IncomeForm = ({ form, categories, groups }: IncomeFormProps) => {
  return (
    <form>
      <label className="block mb-1 mt-2">Số tiền</label>
      <Controller
        name="amount"
        control={form.control}
        render={({ field }) => (
          <Input {...field} placeholder="Số tiền" size="large" type="number" />
        )}
      />

      <label className="block mb-1 ">Mô tả</label>
      <Controller
        name="description"
        control={form.control}
        render={({ field }) => (
          <Input
            {...field}
            placeholder="Mô tả"
            size="large"
            type="text"
          />
        )}
      />

      <label className="block mb-1 mt-2">Tên loại</label>
      <Controller
        name="categoryId"
        control={form.control}
        render={({ field }) => (
          <Radio.Group {...field} className="w-full">
            <Row gutter={16}>
              {categories.map((category) => (
                <Col span={12}>
                  <Radio.Button value={category._id} className="w-full">
                    {category.name}
                  </Radio.Button>
                </Col>
              ))}
            </Row>
          </Radio.Group>
        )}
      />

      <label className="block mb-1 mt-2">Tên nhóm</label>
      <Controller
        name="groupId"
        control={form.control}
        render={({ field }) => (
          <Radio.Group {...field} className="w-full">
            <Row gutter={16}>
              {groups.map((group) => (
                <Col span={12}>
                  <Radio.Button value={group._id} className="w-full">
                    {group.name}
                  </Radio.Button>
                </Col>
              ))}
            </Row>
          </Radio.Group>
        )}
      />
    </form>
  );
};

export default IncomeForm;
