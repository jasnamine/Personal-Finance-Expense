import { zodResolver } from "@hookform/resolvers/zod";
import { Content } from "antd/es/layout/layout";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AppCard from "../../components/Card/AppCard";
import AppModal from "../../components/Modal/AppModal";
import type { CategoryRequest } from "../../models/Category";
import CategoryAdd from "./CategoryAdd";
import type { Category } from "../../types";
export const categorySchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên danh mục!"),
  type: z.enum(["INCOME", "EXPENSE"], {
    message: "Phải chọn loại hợp lệ!",
  }),
  icon: z.string().optional(),
});


const Category = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const form = useForm<CategoryRequest>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      type: "EXPENSE",
      icon: "",
    },
  });

  const onFinish = () => {};
  return (
    <Content>
      <AppCard title="Danh mục " onClick={() => setIsModalOpen(true)} />
      <AppModal
        title="Tạo danh mục"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <CategoryAdd form={form} onFinish={onFinish} />
      </AppModal>
    </Content>
  );
};
export default Category;
