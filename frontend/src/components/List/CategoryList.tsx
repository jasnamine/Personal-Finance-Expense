import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { List, Popconfirm, Space, Typography, Tooltip } from "antd";
import type { CategoryResponse } from "../../models/Category";
import AppButton from "../Button/AppButton";
const { Text } = Typography;

interface CategoryListProps {
  categories: CategoryResponse[];
  onEditCategory: (data: CategoryResponse) => void;
  onDeleteCategory: (id: string) => void;
}

const CategoryList = ({
  categories,
  onEditCategory,
  onDeleteCategory,
}: CategoryListProps) => {
  return (
    <section className="max-h-[600px] overflow-y-auto flex flex-col ">
      <List
        dataSource={categories}
        renderItem={(category) => (
          <List.Item key={category._id} className="px-0">
            <Space>
              <section className="w-8 h-8 bg-gray-50 rounded flex items-center justify-center">
                <img
                  src={category.icon}
                  alt={category.name}
                  className="w-6 h-6"
                />
              </section>
              <section>
                <div className="font-medium text-sm">{category.name}</div>
                <div className="text-[10px] text-gray-500 capitalize font-semibold">
                  {category.type}
                </div>
              </section>
            </Space>
            <section className="flex justify-center items-center gap-2 m-1">
              <AppButton
                shape="circle"
                onClick={() => onEditCategory(category)}
                icon={<EditOutlined />}
                className="w-2 h-2 flex items-center justify-center bg-blue-50 rounded"
              />
              <Popconfirm
                title="Delete Category?"
                description={
                  <div className="max-w-[220px]">
                    Are you sure you want to delete{" "}
                    <strong>{category.name}</strong>?
                    <br />
                    <Text type="danger" className="text-[12px] mt-1 block">
                      Warning: All associated transactions will also be deleted!
                    </Text>
                  </div>
                }
                onConfirm={() => onDeleteCategory(category._id)}
                okText="Yes, Delete"
                cancelText="No, Keep it"
                okButtonProps={{ danger: true, size: "middle" }}
                cancelButtonProps={{ size: "middle" }}
              >
                <Tooltip title="Delete Category">
                  <AppButton
                    shape="circle"
                    icon={<DeleteOutlined className="text-red-500" />}
                    className="w-8 h-8 flex items-center justify-center bg-red-50 hover:bg-red-100 border-none transition-colors"
                  />
                </Tooltip>
              </Popconfirm>
            </section>
          </List.Item>
        )}
      ></List>
    </section>
  );
};

export default CategoryList;
