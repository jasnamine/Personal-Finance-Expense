import { Col, Input, Radio, Row } from "antd";
import { Controller, type UseFormReturn } from "react-hook-form";
import InputError from "../../components/Input/InputError";
import EmojiPickerPopup from "../../components/Picker/EmojiPickerPopup";
import type { CategoryRequest } from "../../models/Category";

interface CategoryAddProps {
  form: UseFormReturn<CategoryRequest>;
}

const CategoryForm = ({ form }: CategoryAddProps) => {
  return (
    <form>
      <EmojiPickerPopup
        icon={form.watch("icon") || ""}
        onSelected={(selectedIcon) => form.setValue("icon", selectedIcon)}
      />
      <InputError error={form.formState.errors.icon?.message} />

      <label className="block mb-1 ">Category Name</label>
      <Controller
        name="name"
        control={form.control}
        render={({ field }) => (
          <Input
            {...field}
            placeholder="e.g. Shopping, Salary..."
            size="large"
          />
        )}
      />
      <InputError error={form.formState.errors.name?.message} />

      <label className="block mb-1 mt-2">Transaction Type</label>
      <Controller
        name="type"
        control={form.control}
        render={({ field }) => (
          <Radio.Group {...field} className="w-full">
            <Row gutter={16}>
              <Col span={12}>
                <Radio.Button value="INCOME" className="w-full">
                  Income
                </Radio.Button>
              </Col>
              <Col span={12}>
                <Radio.Button value="EXPENSE" className="w-full">
                  Expense
                </Radio.Button>
              </Col>
            </Row>
          </Radio.Group>
        )}
      />
      <InputError error={form.formState.errors.type?.message} />
    </form>
  );
};

export default CategoryForm;
