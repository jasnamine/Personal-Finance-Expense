import { useQueryClient } from "@tanstack/react-query";
import { Breadcrumb } from "antd";
import { Link, useLocation, useParams } from "react-router-dom";
import { breadcrumbNameMap } from "../../constants/Constant";
import type { GroupDetailResponse } from "../../models/Group";

const AppBreadcrumb = () => {
  const location = useLocation();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const detailData = queryClient.getQueryData<GroupDetailResponse>([
    "group-detail",
    "getById",
    id,
  ]);

  const allGroupsData = queryClient.getQueryData<any>([
    "groups",
    "getAll",
    null,
  ]);
  const groupsList = allGroupsData?.data || allGroupsData;

  const groupName =
    detailData?.group?.name ||
    (Array.isArray(groupsList)
      ? groupsList.find((g: any) => g._id === id)?.name
      : null);

  const pathSnippets = location.pathname.split("/").filter((i) => i);

  const extraBreadcrumbItems = pathSnippets
    .map((snippet, index) => {
      if (snippet === "group-detail") return null;

      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
      let name = breadcrumbNameMap[url] || snippet;

      if (id && snippet === id) {
        name = groupName || "Chi tiết nhóm";
      }

      const isLast = index === pathSnippets.length - 1;

      return {
        key: url,
        title: isLast ? (
          <span className="font-semibold text-blue-600">{name}</span>
        ) : (
          <Link to={url}>{name}</Link>
        ),
      };
    })
    .filter(Boolean);

  const breadcrumbItems = [
    {
      title: <Link to="/dashboard">Trang chủ</Link>,
      key: "home",
    },
    ...(extraBreadcrumbItems as any[]),
  ];

  return (
    <Breadcrumb
      items={breadcrumbItems}
      style={{
        margin: "16px 0",
        padding: "8px 16px",
        background: "#f9fafb",
        borderRadius: "8px",
      }}
    />
  );
};

export default AppBreadcrumb;
