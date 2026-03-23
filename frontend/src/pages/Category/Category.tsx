import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AppCard from "../../components/Card/AppCard";
import CategoryForm from "../../components/Form/CategoryForm";
import CategoryList from "../../components/List/CategoryList";
import AppModal from "../../components/Modal/AppModal";
import ResourceURL from "../../constants/ResourceURL";
import useDeleteByIdApi from "../../hooks/usde-delete-by-id-api";
import useCreateApi from "../../hooks/use-create-api";
import useGetAllApi from "../../hooks/use-get-all-api";
import useUpdateApi from "../../hooks/use-update-api";
import type { CategoryRequest, CategoryResponse } from "../../models/Category";
export const categorySchema = z.object({
  name: z.string().min(1, "Please enter a category name!"),
  type: z.enum(["INCOME", "EXPENSE"], {
    message: "Please select a valid type!",
  }),
  icon: z.string().min(1, "Please select icon!"),
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
        title={"Categories"}
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
        title={category ? "Update Category" : "Add Category"}
        isOpen={isModalOpen}
        onSubmit={form.handleSubmit(handleSubmit)}
        onClose={() => setIsModalOpen(false)}
      >
        <CategoryForm form={form} />
      </AppModal>
    </Content>
  );
};
export default Category;
