import {
  CheckCircleOutlined,
  CopyOutlined,
  HomeOutlined,
  PlusOutlined,
  StopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { PageHeader } from "@ant-design/pro-layout";
import {
  BackTop,
  Breadcrumb,
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  notification,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tag,
} from "antd";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import userApi from "../../apis/userApi";
import certificateApi from "../../apis/certificateApi";
import "./accountManagement.css";

const AccountManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const history = useHistory();
  const [openModal, setOpenModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
    fetchCertificates();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userApi.listUserByAdmin({ page: 1, limit: 1000 });
      setUsers(response.data.docs);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCertificates = async () => {
    try {
      const response = await certificateApi.getAllCertificate();
      setCertificates(response.data);
    } catch (error) {
      console.error("Failed to fetch certificates:", error);
    }
  };

  const titleCase = (str) => {
    return str
      ?.toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
      .join(" ");
  };

  const handleBanAccount = async (user, status) => {
    const params = { status };
    try {
      const apiCall = status === "actived" ? userApi.unBanAccount : userApi.banAccount;
      await apiCall(params, user._id);
      notification["success"]({
        message: "Thông báo",
        description: status === "actived" ? "Mở khóa thành công" : "Chặn thành công",
      });
      fetchUsers();
    } catch (error) {
      notification["error"]({
        message: "Thông báo",
        description: status === "actived" ? "Mở khóa thất bại" : "Chặn thất bại",
      });
    }
  };

  const handleAddCertificateToMentor = async (values) => {
    setLoading(true);
    try {
      await userApi.addCertificateToMentor(selectedUserId, values.certificates);
      notification["success"]({
        message: "Thông báo",
        description: "Tạo chứng chỉ vào mentor thành công",
      });
      setOpenModal(false);
      fetchUsers();
    } catch (error) {
      notification["error"]({
        message: "Thông báo",
        description: "Tạo chứng chỉ vào mentor thất bại",
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "index",
      render: (_, __, index) => (page - 1) * 10 + (index + 1),
    },
    {
      title: "Tên",
      dataIndex: "username",
      key: "username",
      render: (text) => <p style={{ margin: 0 }}>{titleCase(text)}</p>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: "12%",
      render: (text) => (
        <Tag
          color={text === "isAdmin" ? "blue" : text === "isMentor" ? "green" : text === "isCourseOwner" ? "purple" : "magenta"}
          icon={<CopyOutlined />}
          style={{ width: 120, textAlign: "center" }}
        >
          {text === "isAdmin" ? "Quản lý" : text === "isMentor" ? "Mentor" : text === "isCourseOwner" ? "Chủ khóa học" : "Khách hàng"}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <Tag
          color={text === "actived" ? "green" : text === "newer" ? "blue" : "default"}
          style={{ width: 80, textAlign: "center" }}
        >
          {text === "actived" ? "Hoạt động" : text === "newer" ? "Newer" : "Chặn"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {record.role !== "isAdmin" && record.role === "isMentor" && (
            <Button size="small" style={{ borderRadius: 15 }} onClick={() => handleConnectCertificate(record._id)}>
              Chứng chỉ
            </Button>
          )}
          {record.role !== "isAdmin" && (
            <Popconfirm
              title={`Bạn muốn ${record.status === "actived" ? "chặn" : "mở chặn"} tài khoản này?`}
              onConfirm={() => handleBanAccount(record, record.status === "actived" ? "noactive" : "actived")}
              okText="Yes"
              cancelText="No"
            >
              <Button
                size="small"
                icon={record.status === "actived" ? <StopOutlined /> : <CheckCircleOutlined />}
                style={{ borderRadius: 15 }}
              >
                {record.status === "actived" ? "Chặn tài khoản" : "Mở chặn tài khoản"}
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const handleSearchChange = async (e) => {
    setSearchInput(e.target.value);
    if (e.target.value.trim() === "") {
      fetchUsers();
    } else {
      try {
        const response = await userApi.searchUser(e.target.value);
        setUsers(response.data.docs);
      } catch (error) {
        console.error("Failed to search users:", error);
      }
    }
  };

  const handleConnectCertificate = async (id) => {
    setSelectedUserId(id);
    setOpenModal(true);
    try {
      const response = await userApi.getProfileById(id);
      form.setFieldsValue({
        username: response.data.username,
        email: response.data.email,
      });
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  const handleCreateAccount = () => {
    history.push("/account-create");
  };

  return (
    <div>
      <Spin spinning={loading}>
        <Breadcrumb style={{ margin: "20px 0 0 24px" }}>
          <Breadcrumb.Item href="">
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item href="">
            <UserOutlined />
            <span>Quản lý tài khoản</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div id="account">
          <PageHeader subTitle="" style={{ paddingTop: 20, paddingBottom: 20 }}>
            <Row gutter={16} align="middle">
              <Col span={12}>
                <Input
                  placeholder="Tìm kiếm"
                  allowClear
                  style={{ width: 300 }}
                  onChange={handleSearchChange}
                  value={searchInput}
                />
              </Col>
              <Col span={12} style={{ textAlign: "right" }}>
                <Button icon={<PlusOutlined />} onClick={handleCreateAccount}>
                  Tạo tài khoản
                </Button>
              </Col>
            </Row>
          </PageHeader>
        </div>
        <Card title="Quản lý tài khoản" bordered={false} style={{ marginTop: 20, marginRight: 5 }}>
          <Table columns={columns} dataSource={users} pagination={{ position: ["bottomCenter"] }} />
        </Card>
        <BackTop />
      </Spin>
      <Modal
        title="Thêm chứng chỉ cho mentor"
        visible={openModal}
        onOk={() => {
          form
            .validateFields()
            .then(handleAddCertificateToMentor)
            .catch((info) => console.log("Validate Failed:", info));
        }}
        onCancel={() => setOpenModal(false)}
        okText="Tạo"
        cancelText="Đóng"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="Tên mentor">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email mentor">
            <Input />
          </Form.Item>
          <Form.Item
            name="certificates"
            label="Danh mục chứng chỉ"
            rules={[{ required: true, message: "Vui lòng chọn chứng chỉ!" }]}
          >
            <Select mode="multiple" placeholder="Danh mục">
              {certificates.map((item) => (
                <Select.Option key={item._id} value={item._id}>
                  {item.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AccountManagement;
