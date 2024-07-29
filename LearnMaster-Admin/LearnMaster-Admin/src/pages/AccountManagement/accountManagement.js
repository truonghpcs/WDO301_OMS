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
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [userResponse, certificateResponse] = await Promise.all([
        userApi.listUserByAdmin({ page: 1, limit: 1000 }),
        certificateApi.getAllCertificate(),
      ]);

      const certificateMap = certificateResponse.data.reduce((acc, cert) => {
        acc[cert._id] = cert.title;
        return acc;
      }, {});

      const usersWithCertificates = userResponse.data.docs.map((user) => ({
        ...user,
        certificate: user.certificates.map(id => certificateMap[id]).join(', '),
      }));

      setUsers(usersWithCertificates);
      setCertificates(certificateResponse.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
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
      loadData();
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
        description: "Thêm chứng chỉ vào mentor thành công",
      });
      setOpenModal(false);
      loadData();
    } catch (error) {
      notification["error"]({
        message: "Thông báo",
        description: "Thêm chứng chỉ vào mentor thất bại",
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
      title: "Chứng chỉ",
      dataIndex: "certificate",
      key: "certificate",
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
      loadData();
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
        <Table
          style={{ margin: 20 }}
          columns={columns}
          rowKey={(record) => record._id}
          pagination={{ pageSize: 10 }}
          dataSource={users}
          onChange={(pagination) => setPage(pagination.current)}
        />
        <BackTop />
      </Spin>
      <Modal
        title="Thêm chứng chỉ"
        visible={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
      >
        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleAddCertificateToMentor}
          >
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: "Please input the username!" }]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Please input the email!" }]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="certificates"
              label="Chứng chỉ"
              rules={[{ required: true, message: "Please select certificates!" }]}
            >
              <Select
                mode="multiple"
                placeholder="Select certificates"
                allowClear
              >
                {certificates.map((certificate) => (
                  <Select.Option key={certificate._id} value={certificate._id}>
                    {certificate.title} {/* Hiển thị tiêu đề chứng chỉ */}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Thêm chứng chỉ
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
};

export default AccountManagement;
