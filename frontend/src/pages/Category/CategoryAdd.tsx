import { Col, Input, Radio, Row } from "antd";
import { Controller, type UseFormReturn } from "react-hook-form";
import EmojiPickerPopup from "../../components/Picker/EmojiPickerPopup";
import type { CategoryRequest } from "../../models/Category";
import InputError from "../../components/Input/InputError";

interface CategoryAddProps {
  form: UseFormReturn<CategoryRequest>;

}

const CategoryAdd = ({ form }: CategoryAddProps) => {
  return (
    <form >
      <EmojiPickerPopup
        icon={form.watch("icon") || ""}
        onSelected={(selectedIcon) => form.setValue("icon", selectedIcon)}
      />

      <label className="block mb-1 ">Tên danh mục</label>
      <Controller
        name="name"
        control={form.control}
        render={({ field }) => (
          <Input {...field} placeholder="Tên danh mục" size="large" />
        )}
      />
      <InputError error={form.formState.errors.name} />

      <label className="block mb-1 mt-2">Tên loại</label>
      <Controller
        name="type"
        control={form.control}
        render={({ field }) => (
          <Radio.Group {...field} className="w-full">
            <Row gutter={16}>
              <Col span={12}>
                <Radio.Button value="INCOME" className="w-full">
                  Thu nhập
                </Radio.Button>
              </Col>
              <Col span={12}>
                <Radio.Button value="EXPENSE" className="w-full">
                  Chi tiêu
                </Radio.Button>
              </Col>
            </Row>
          </Radio.Group>
        )}
      />
      <InputError error={form.formState.errors.type} />
    </form>
  );
};

export default CategoryAdd;
