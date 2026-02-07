import { List, Space, Tag } from "antd";
import type { Category } from "../../types";

interface CategoryListProps{
    categories: Category[];
}

const CategoryList = ({categories} : CategoryListProps) => {
    return (
      <section className="max-h-[600px] overflow-y-auto">
        <List>
          {categories.map((category) => (
            <List.Item className="px-0">
              <Space>
                <div className="w-8 h-8 bg-gray-50 rounded flex items-center justify-center">
                  {category.icon}
                </div>
                <div>
                  <div className="font-medium text-sm">{category.name}</div>
                  <div className="text-sm text-gray-500 capitalize">
                    {category.type}
                  </div>
                </div>
              </Space>
              <Tag
                color={category.type === "INCOME" ? "green" : "orange"}
                className="mr-0"
              >
                {category.type === "INCOME" ? "Thu" : "Chi"}
              </Tag>
            </List.Item>
          ))}
        </List>
      </section>
    );

}

export default CategoryList;