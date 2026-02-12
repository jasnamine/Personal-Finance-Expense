import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AppCard from "../../components/Card/AppCard";
import AppModal from "../../components/Modal/AppModal";
import ResourceURL from "../../constants/ResourceURL";
import useCreateApi from "../../hooks/use-create-api";
import useGetAllApi from "../../hooks/use-get-all-api";
import useUpdateApi from "../../hooks/use-update-api";
import type { CategoryRequest, CategoryResponse } from "../../models/Category";
import useDeleteByIdApi from "../../hooks/usde-delete-by-id-api";
import CategoryAdd from "./CategoryAdd";
import CategoryList from "./CategoryList";
export const categorySchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên danh mục!"),
  type: z.enum(["INCOME", "EXPENSE"], {
    message: "Phải chọn loại hợp lệ!",
  }),
  icon: z.string().optional(),
});

const Category = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState<CategoryResponse>();
  const form = useForm<CategoryRequest>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      type: "EXPENSE",
      icon: "",
    },
  });
  const queryClient = useQueryClient();

  const { data } = useGetAllApi<CategoryResponse>(
    ResourceURL.CATEGORY,
    "categories",
  );
  const categoriesList = data?.data ?? [];

  const createApi = useCreateApi<CategoryRequest, CategoryResponse>(
    ResourceURL.CATEGORY,
  );

  const updateApi = useUpdateApi<
    CategoryRequest & { id: string },
    CategoryResponse
  >(ResourceURL.CATEGORY, "categories");

  const deleteApi = useDeleteByIdApi(ResourceURL.CATEGORY, "categories");

  const handleSubmit = (data: CategoryRequest) => {
    if (category) {
      console.log(category);
      updateApi.mutate({
        id: category._id,
        ...data,
      });
    } else {
      createApi.mutate(data, {
        onSuccess: () => {
          setIsModalOpen(false);
          form.reset();
          queryClient.invalidateQueries({
            queryKey: ["categories", "getAll"],
          });
        },
      });
    }
  };

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        type: category.type,
        icon: category.icon,
      });
    }
  }, [category]);

  const handleEditCategory = (category: CategoryResponse) => {
    setIsModalOpen(true);
    setCategory(category);
  };

  const handleDeleteCategory = (id: string) => {
    deleteApi.mutate(id);
  };

  return (
    <Content>
      <AppCard
        title={"Danh mục"}
        onClick={() => {
          setCategory(undefined);
          form.reset({ name: "", type: "EXPENSE", icon: "" });
          setIsModalOpen(true);
        }}
      >
        <CategoryList
          categories={categoriesList}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      </AppCard>

      <AppModal
        title={category ? "Cập nhật danh mục" : "Thêm danh mục"}
        isOpen={isModalOpen}
        onSubmit={form.handleSubmit(handleSubmit)}
        onClose={() => setIsModalOpen(false)}
      >
        <CategoryAdd form={form} />
      </AppModal>
    </Content>
  );
};
export default Category;
