import React, { useEffect, useState } from "react";
import {
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
} from "antd";
import {
  BarsOutlined,
  DeleteOutlined,
  EditOutlined,
  HomeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { PageHeader } from "@ant-design/pro-layout";

import axiosClient from "../../apis/axiosClient";
import courseApi from "../../apis/courseApi";
import CourseApi from "../../apis/courseApi";
import productApi from "../../apis/productsApi";
import userApi from "../../apis/userApi";
import certificateApi from "../../apis/certificateApi";

const { Option } = Select;

const CourseList = () => {
  const [courseList, setCourseList] = useState([]);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [openModalAddCertificate, setOpenModalAddCertificate] = useState(false);
  const [openModalAddCertificateToCourse, setOpenModalAddCertificateToCourse] =
    useState(false);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();
  const [total, setTotalList] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [id, setId] = useState();
  const [image, setImage] = useState();
  const [description, setDescription] = useState();
  const [lessons, setLessons] = useState([]);
  const [certificate, setCertificate] = useState();
  const [certificateOfCourse, setCertificateOfCourse] = useState();
  const [mentor, setMentor] = useState();
  const [category, setCategory] = useState();
  const [user, setUser] = useState([]);

  const history = useHistory();
  const showModal = () => {
    setOpenModalCreate(true);
  };
  const showModalAddCertification = () => {
    setOpenModalAddCertificate(true);
  };

  const handleChangeImage = (event) => {
    setImage(event.target.files[0]);
  };

  const handleChangeLessons = (index, field, value) => {
    const newLessons = [...lessons];
    newLessons[index][field] = value;
    setLessons(newLessons);
  };

  const handleAddLesson = () => {
    setLessons([...lessons, { title: "", videoUrl: "" }]);
  };

  const handleRemoveLesson = (index) => {
    const newLessons = [...lessons];
    newLessons.splice(index, 1);
    setLessons(newLessons);
  };

  const handleAddCertificate = async (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);
    const response = await axiosClient.post("/uploadFile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const certificateData = {
      title: values.title,
      slug: values.slug,
      image: response.image_url,
    };
    await certificateApi
      .createCertificate(certificateData)
      .then((response) => {
        if (!response) {
          notification["error"]({
            message: `Thông báo`,
            description: "Tạo chứng chỉ thất bại",
          });
        } else {
          notification["success"]({
            message: `Thông báo`,
            description: "Tạo chứng chỉ thành công",
          });
          setOpenModalAddCertificate(false);
        }
        setLoading(false);
      })
      .catch((e) => {
        throw e;
      });
  };
  const handleAddCertificateToCourse = async (values) => {
    setLoading(true);
    await CourseApi.addCertificateToCourse(id, values.certificates)
      .then((response) => {
        if (!response) {
          notification["error"]({
            message: `Thông báo`,
            description: "Tạo chứng chỉ vào khóa học thất bại",
          });
        } else {
          notification["success"]({
            message: `Thông báo`,
            description: "Tạo chứng chỉ vào khóa học thành công",
          });
          setOpenModalAddCertificateToCourse(false);
        }
        setLoading(false);
      })
      .catch((e) => {
        throw e;
      });
  };
  const handleOkCourse = async (values) => {
    setLoading(true);
    const local = localStorage.getItem("user");
    const user = JSON.parse(local);
    try {
      const formData = new FormData();
      formData.append("image", image);
      const response = await axiosClient.post("/uploadFile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const courseData = {
        title: values.title,
        description: description,
        slug: values.slug,
        image: response.image_url,
        price: values.price,
        category: values.category,
        lessons: lessons,
        mentor: user._id,
      };
      await courseApi.createCourse(courseData).then((response) => {
        if (!response) {
          notification["error"]({
            message: `Thông báo`,
            description: "Tạo khóa học thất bại",
          });
        } else {
          notification["success"]({
            message: `Thông báo`,
            description: "Tạo khóa học thành công",
          });
          setOpenModalCreate(false);
          handleCourseList();
        }
      });
      setLoading(false);
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateCourse = async (values) => {
    setLoading(true);
    const local = localStorage.getItem("user");
    const user = JSON.parse(local);
    try {
      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        const response = await axiosClient.post("/uploadFile", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const courseData = {
          title: values.title,
          description: description,
          slug: values.slug,
          image: response.image_url,
          price: values.price,
          category: values.category,
          lessons: lessons,
          mentor: user._id,
        };
        await courseApi.updateCourse(id, courseData).then((response) => {
          if (!response) {
            notification["error"]({
              message: `Thông báo`,
              description: "Chỉnh sửa khóa học thất bại",
            });
          } else {
            notification["success"]({
              message: `Thông báo`,
              description: "Chỉnh sửa khóa học thành công",
            });
            handleCourseList();
            setOpenModalUpdate(false);
            setLoading(false);
          }
        });
      } else {
        const courseData = {
          title: values.title,
          description: description,
          slug: values.slug,
          price: values.price,
          category: values.category,
          lessons: lessons,
          mentor: mentor,
        };
        await courseApi.updateCourse(id, courseData).then((response) => {
          if (!response) {
            notification["error"]({
              message: `Thông báo`,
              description: "Chỉnh sửa khóa học thất bại",
            });
          } else {
            notification["success"]({
              message: `Thông báo`,
              description: "Chỉnh sửa khóa học thành công",
            });
            handleCourseList();
            setOpenModalUpdate(false);
            setLoading(false);
          }
        });
      }
    } catch (error) {
      throw error;
    }
  };

  const handleCancel = (type) => {
    switch (type) {
      case "addCertificate":
        setOpenModalAddCertificate(false);
        break;
      case "addCertificateToCourse":
        setOpenModalAddCertificateToCourse(false);
        break;
      case "create":
        setOpenModalCreate(false);
        break;
      default:
        setOpenModalUpdate(false);
        break;
    }
  };

  const handleDeleteCourse = async (id) => {
    setLoading(true);
    try {
      await courseApi.deleteCourse(id).then((response) => {
        if (!response) {
          notification["error"]({
            message: `Thông báo`,
            description: "Xóa khóa học thất bại",
          });
        } else {
          notification["success"]({
            message: `Thông báo`,
            description: "Xóa khóa học thành công",
          });
          setCurrentPage(1);
          handleCourseList();
          setLoading(false);
        }
      });
    } catch (error) {
      console.log("Failed to delete course:", error);
    }
  };

  const handleChange = (content) => {
    setDescription(content);
  };

  const handleEditCourse = (id) => {
    setOpenModalUpdate(true);
    (async () => {
      try {
        const response = await courseApi.getCourseById(id);
        setId(id);
        form2.setFieldsValue({
          title: response.data.title,
          description: response.data.description,
          slug: response.data.slug,
          price: response.data.price,
          category: response.data.category,
          mentor: response.data.mentor,
        });
        setDescription(response.data.description);
        setLessons(response.data.lessons);
        setMentor(response.data.mentor);
        setLoading(false);
      } catch (error) {
        throw error;
      }
    })();
  };

  const handleConnectCertificate = (id) => {
    setOpenModalAddCertificateToCourse(true);
    (async () => {
      try {
        const response = await courseApi.getCourseById(id);
        setId(id);
        form3.setFieldsValue({
          title: response.data.title,
          slug: response.data.slug,
        });
        setCertificateOfCourse(response.data.certificates);
        setLoading(false);
      } catch (error) {
        throw error;
      }
    })();
  };

  const handleFilter = async (title) => {
    try {
      const res = await courseApi.searchCourse(title);
      setTotalList(res.totalDocs);
      setCourseList(res.data.docs);
    } catch (error) {
      console.log("Failed to search courses:", error);
    }
  };

  const columns = [
    { title: "ID", key: "index", render: (text, record, index) => index + 1 },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) => <img src={image} style={{ height: 80 }} />,
      width: "10%",
    },
    {
      title: "Tên",
      dataIndex: "title",
      key: "title",
      render: (text) => <a>{text}</a>,
      width: "15%",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: "20%",
    },
    { title: "Slug", dataIndex: "slug", key: "slug", width: "10%" },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (text) => <div>{text?.name}</div>,
      width: "15%",
    },

    {
      title: "Bài học",
      dataIndex: "lessons",
      key: "lessons",
      render: (lessons) => (
        <ul>
          {lessons.map((lesson, index) => (
            <li key={index}>
              <strong>Tiêu đề:</strong> {lesson?.title} <br />
              <strong>Video URL:</strong>{" "}
              <a
                href={lesson?.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {lesson?.videoUrl}
              </a>
            </li>
          ))}
        </ul>
      ),
      width: "20%",
    },
    { title: "Giá", dataIndex: "price", key: "price", width: "10%" },
    {
      title: "Người hướng dẫn",
      dataIndex: "mentor",
      key: "mentor",
      width: "10%",
      render: (text) => <div>{text?.username}</div>,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div>
          <Row>
            <Button
              size="small"
              style={{ width: 150, borderRadius: 15, height: 30 }}
              onClick={() => handleConnectCertificate(record._id)}
            >
              {"Chứng chỉ"}
            </Button>
            <Button
              size="small"
              icon={<EditOutlined />}
              style={{
                width: 150,
                marginTop: 10,
                borderRadius: 15,
                height: 30,
              }}
              onClick={() => handleEditCourse(record._id)}
            >
              {"Chỉnh sửa"}
            </Button>
            <div style={{ marginTop: 10 }}>
              <Popconfirm
                title="Bạn có chắc chắn xóa khóa học này?"
                onConfirm={() => handleDeleteCourse(record._id)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  size="small"
                  icon={<DeleteOutlined />}
                  style={{ width: 150, borderRadius: 15, height: 30 }}
                >
                  {"Xóa"}
                </Button>
              </Popconfirm>
            </div>
          </Row>
        </div>
      ),
      width: "15%",
    },
  ];

  const handleCourseList = async () => {
    try {
      const res = await courseApi.getAllCourses({
        page: currentPage,
        limit: 10,
      });
      setTotalList(res.totalDocs);
      setCourseList(res.data.docs);
      setLoading(false);
    } catch (error) {
      console.log("Failed to fetch course list:", error);
    }
  };

  const handleCourseListByUser = async () => {
    try {
      const local = localStorage.getItem("user");
      const user = JSON.parse(local);
      if (user.role == "isAdmin") {
        handleCourseList();
      } else {
        handleCourseListByUser();
      }
    } catch (error) {
      console.log("Failed to fetch course list:", error);
    }
  };

  const handleCategory = async () => {
    try {
      await productApi
        .getListCategory({ page: 1, limit: 10000 })
        .then((res) => {
          setCategory(res.data.docs);
          setLoading(false);
        });
    } catch (error) {
      console.log("Failed to fetch course list:", error);
    }
  };

  const handleListUser = async () => {
    try {
      const response = await userApi.listUserByAdmin({ page: 1, limit: 1000 });
      setUser(response.data.docs);
      setLoading(false);
    } catch (error) {
      console.log("Failed to fetch event list:" + error);
    }
  };
  useEffect(() => {
    const getCertificates = async () => {
      await certificateApi
        .getAllCertificate()
        .then((res) => {
          setCertificate(res.data);
        })
        .catch((e) => {
          throw e;
        });
    };
    getCertificates();
  }, []);
  useEffect(() => {
    const local = localStorage.getItem("user");
    const user = JSON.parse(local);
    if (user.role == "isAdmin") {
      handleCourseList();
    } else {
      handleCourseListByUser();
    }
    handleCategory();
    handleListUser();
  }, []);

  return (
    <div>
      <Spin spinning={loading}>
        <div className="container">
          <div style={{ marginTop: 20 }}>
            <Breadcrumb>
              <Breadcrumb.Item href="">
                <HomeOutlined />
              </Breadcrumb.Item>
              <Breadcrumb.Item href="">
                <BarsOutlined />
                <span>Khóa học</span>
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <div style={{ marginTop: 20 }}>
          <div id="my__event_container__list">
            <PageHeader subTitle="" style={{ fontSize: 14 }}>
              <Row>
                <Col span="18">
                  <Input.Search
                    style={{ width: 300 }}
                    placeholder="Tìm kiếm khóa học"
                    onSearch={(value) => handleFilter(value)}
                    enterButton
                  />
                </Col>
                <Col span="6">
                  <Row justify="end">
                    <Space>
                      <Button
                        icon={<PlusOutlined />}
                        onClick={showModalAddCertification}
                      >
                        {"Tạo chứng chỉ"}
                      </Button>
                      <Button icon={<PlusOutlined />} onClick={showModal}>
                        {"Tạo khóa học"}
                      </Button>
                    </Space>
                  </Row>
                </Col>
              </Row>
            </PageHeader>
          </div>
        </div>

        <div style={{ marginTop: 30 }}>
          <div>
            <Table
              rowKey="id"
              columns={columns}
              dataSource={courseList}
              pagination={{
                current: currentPage,
                pageSize: 10,
                total: total,
                onChange: (page) => setCurrentPage(page),
              }}
            />
          </div>
        </div>
        <Modal
          title="Thêm chứng chỉ vào khóa học"
          visible={openModalAddCertificateToCourse}
          style={{ top: 100 }}
          onOk={() => {
            form3
              .validateFields()
              .then((values) => {
                handleAddCertificateToCourse(values);
              })
              .catch((info) => {
                console.log("Validate Failed:", info);
              });
          }}
          onCancel={() => handleCancel("addCertificateToCourse")}
          okText="Tạo"
          cancelText="Đóng"
        >
          <p>
            Tên khóa học <b name={"title"}></b>
          </p>
          <Form
            layout="vertical"
            form={form3}
            initialValues={{
              title: "",
              slug: "",
            }}
          >
            <Form.Item
              style={{ marginBottom: 10 }}
              name="title"
              label="Tên khóa học"
            >
              <Input />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: 10 }}
              name="slug"
              label="Slug khóa học"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="certificates"
              label="Danh mục chứng chỉ"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn chứng chỉ!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                tokenSeparators={[","]}
                placeholder="Danh mục"
                name={"certificates"}
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {certificate?.map((item, index) => {
                  return (
                    <Option value={item?._id} key={index}>
                      {item?.title}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="Tạo chứng chỉ"
          visible={openModalAddCertificate}
          style={{ top: 100 }}
          onOk={() => {
            form
              .validateFields()
              .then((values) => {
                form.resetFields();
                handleAddCertificate(values);
              })
              .catch((info) => {
                console.log("Validate Failed:", info);
              });
          }}
          onCancel={() => handleCancel("addCertificate")}
          okText="Tạo"
          cancelText="Đóng"
        >
          <Form
            layout="vertical"
            form={form}
            initialValues={{
              title: "",
              description: "",
              slug: "",
              image: "",
              price: "",
              category: "",
              lessons: [],
              mentor: "",
            }}
          >
            <Form.Item
              style={{ marginBottom: 10 }}
              name="title"
              label="Tên"
              rules={[{ required: true, message: "Tên không được để trống" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: 10 }}
              name="slug"
              label="Slug"
              rules={[{ required: true, message: "Slug không được để trống" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item style={{ marginBottom: 10 }} label="Ảnh" name="image">
              <Input type="file" onChange={handleChangeImage} />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="Tạo khóa học"
          visible={openModalCreate}
          style={{ top: 100 }}
          onOk={() => {
            form
              .validateFields()
              .then((values) => {
                form.resetFields();
                handleOkCourse(values);
              })
              .catch((info) => {
                console.log("Validate Failed:", info);
              });
          }}
          onCancel={() => handleCancel("create")}
          okText="Tạo"
          cancelText="Đóng"
        >
          <Form
            layout="vertical"
            form={form}
            initialValues={{
              title: "",
              description: "",
              slug: "",
              image: "",
              price: "",
              category: "",
              lessons: [],
              mentor: "",
            }}
          >
            <Form.Item
              style={{ marginBottom: 10 }}
              name="title"
              label="Tên"
              rules={[{ required: true, message: "Tên không được để trống" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: 10 }}
              name="slug"
              label="Slug"
              rules={[{ required: true, message: "Slug không được để trống" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item style={{ marginBottom: 10 }} label="Ảnh" name="image">
              <Input type="file" onChange={handleChangeImage} />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: 10 }}
              name="description"
              label="Mô tả"
              rules={[{ required: true, message: "Mô tả không được để trống" }]}
            >
              <Input.TextArea
                value={description}
                onChange={(e) => handleChange(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: 10 }}
              name="price"
              label="Giá"
              rules={[{ required: true, message: "Giá không được để trống" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="category"
              label="Danh mục"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn danh mục!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Select
                style={{ width: "100%" }}
                tokenSeparators={[","]}
                placeholder="Danh mục"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {category?.map((item, index) => {
                  return (
                    <Option value={item?._id} key={index}>
                      {item?.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>

            <Form.Item style={{ marginBottom: 10 }} label="Bài học">
              <Button type="dashed" onClick={handleAddLesson}>
                Thêm bài học
              </Button>
              {lessons.map((lesson, index) => (
                <div key={index} style={{ marginBottom: 10 }}>
                  <Input
                    placeholder="Tiêu đề bài học"
                    value={lesson.title}
                    onChange={(e) =>
                      handleChangeLessons(index, "title", e.target.value)
                    }
                    style={{ marginBottom: 5 }}
                  />
                  <Input
                    placeholder="URL video"
                    value={lesson.videoUrl}
                    onChange={(e) =>
                      handleChangeLessons(index, "videoUrl", e.target.value)
                    }
                  />
                  <Button
                    type="dashed"
                    onClick={() => handleRemoveLesson(index)}
                    style={{ marginTop: 5 }}
                  >
                    Xóa bài học
                  </Button>
                </div>
              ))}
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="Chỉnh sửa khóa học"
          visible={openModalUpdate}
          style={{ top: 100 }}
          onOk={() => {
            form2
              .validateFields()
              .then((values) => {
                form2.resetFields();
                handleUpdateCourse(values);
              })
              .catch((info) => {
                console.log("Validate Failed:", info);
              });
          }}
          onCancel={() => handleCancel("update")}
          okText="Chỉnh sửa"
          cancelText="Đóng"
        >
          <Form
            layout="vertical"
            form={form2}
            initialValues={{
              title: "",
              description: "",
              slug: "",
              image: "",
              price: "",
              category: "",
              lessons: [],
              mentor: "",
            }}
          >
            <Form.Item
              style={{ marginBottom: 10 }}
              name="title"
              label="Tên"
              rules={[{ required: true, message: "Tên không được để trống" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: 10 }}
              name="slug"
              label="Slug"
              rules={[{ required: true, message: "Slug không được để trống" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item style={{ marginBottom: 10 }} label="Ảnh" name="image">
              <Input type="file" onChange={handleChangeImage} />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: 10 }}
              name="description"
              label="Mô tả"
              rules={[{ required: true, message: "Mô tả không được để trống" }]}
            >
              <Input.TextArea
                value={description}
                onChange={(e) => handleChange(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: 10 }}
              name="price"
              label="Giá"
              rules={[{ required: true, message: "Giá không được để trống" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="category"
              label="Danh mục"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn danh mục!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Select
                style={{ width: "100%" }}
                tokenSeparators={[","]}
                placeholder="Danh mục"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {category?.map((item, index) => {
                  return (
                    <Option value={item?._id} key={index}>
                      {item?.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>

            <Form.Item style={{ marginBottom: 10 }} label="Bài học">
              <Button type="dashed" onClick={handleAddLesson}>
                Thêm bài học
              </Button>
              {lessons.map((lesson, index) => (
                <div key={index} style={{ marginBottom: 10 }}>
                  <Input
                    placeholder="Tiêu đề bài học"
                    value={lesson.title}
                    onChange={(e) =>
                      handleChangeLessons(index, "title", e.target.value)
                    }
                    style={{ marginBottom: 5 }}
                  />
                  <Input
                    placeholder="URL video"
                    value={lesson.videoUrl}
                    onChange={(e) =>
                      handleChangeLessons(index, "videoUrl", e.target.value)
                    }
                  />
                  <Button
                    type="dashed"
                    onClick={() => handleRemoveLesson(index)}
                    style={{ marginTop: 5 }}
                  >
                    Xóa bài học
                  </Button>
                </div>
              ))}
            </Form.Item>
          </Form>
        </Modal>
      </Spin>
    </div>
  );
};

export default CourseList;
