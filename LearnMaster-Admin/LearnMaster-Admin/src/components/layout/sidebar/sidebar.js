import React, { useEffect, useState } from "react";
import "./sidebar.css";
import { Layout, Menu } from "antd";
import { useHistory, useLocation } from "react-router-dom";
import {
  UserOutlined,
  ContainerOutlined,
  DashboardOutlined,
  SolutionOutlined,
  BarsOutlined,
  BgColorsOutlined,
  ShoppingOutlined,
  AuditOutlined,
  ShoppingCartOutlined,
  FormOutlined,
  NotificationOutlined,
} from "@ant-design/icons";

const { SubMenu } = Menu;
const { Sider } = Layout;

function Sidebar() {
  const history = useHistory();
  const location = useLocation();
  const [user, setUser] = useState([]);

  const menuSidebarAdmin = [
    {
      key: "dash-board",
      title: "Dashboards",
      link: "/dash-board",
      icon: <DashboardOutlined />,
    },
    {
      key: "account-management",
      title: "Quản Lý Tài Khoản",
      link: "/account-management",
      icon: <UserOutlined />,
    },
    {
      key: "course-list",
      title: "Danh sách khóa học",
      link: "/course-list",
      icon: <FormOutlined />,
    },
    {
      key: "category-list",
      title: "Quản lý danh mục",
      link: "/category-list",
      icon: <ShoppingOutlined />,
    },
    {
      key: "order-list",
      title: "Quản lý đơn hàng",
      link: "/order-list",
      icon: <ShoppingCartOutlined />,
    },
    {
      key: "news-list",
      title: "Tin tức",
      link: "/news-list",
      icon: <BarsOutlined />,
    },
  ];

  const menuSidebarStaff = [
    {
      key: "dash-board",
      title: "Dashboards",
      link: "/dash-board",
      icon: <DashboardOutlined />,
    },
    {
      key: "course-list",
      title: "Danh sách khóa học",
      link: "/course-list",
      icon: <FormOutlined />,
    },
    {
      key: "order-list",
      title: "Đơn hàng",
      link: "/order-list",
      icon: <ShoppingCartOutlined />,
    },
    {
      key: "create-schedule",
      title: "Tạo lịch dạy",
      link: "/create-schedule",
      icon: <FormOutlined />,
    },
  ];

  const navigate = (link, key) => {
    history.push(link);
  };

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  }, []);

  return (
    <Sider
      className={"ant-layout-sider-trigger"}
      width={215}
      style={{
        position: "fixed",
        top: 65,
        height: "100%",
        left: 0,
        padding: 0,
        zIndex: 1,
        marginTop: 0,
        boxShadow: " 0 1px 4px -1px rgb(0 0 0 / 15%)",
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={location.pathname.split("/")}
        defaultOpenKeys={["account"]}
        style={{ height: "100%", borderRight: 0, backgroundColor: "#FFFFFF" }}
        theme="light"
      >
        {user.role === "isAdmin"
          ? menuSidebarAdmin.map((map) => (
              <Menu.Item
                onClick={() => navigate(map.link, map.key)}
                key={map.key}
                icon={map.icon}
                className="customeClass"
              >
                {map.title}
              </Menu.Item>
            ))
          : user.role === "isMentor"
          ? menuSidebarStaff.map((map) => (
              <Menu.Item
                onClick={() => navigate(map.link, map.key)}
                key={map.key}
                icon={map.icon}
                className="customeClass"
              >
                {map.title}
              </Menu.Item>
            ))
          : null}
      </Menu>
    </Sider>
  );
}

export default Sidebar;
