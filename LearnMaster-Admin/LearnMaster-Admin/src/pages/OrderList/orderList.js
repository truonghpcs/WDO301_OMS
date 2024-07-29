import {
    DownloadOutlined,
    HomeOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import {
    BackTop,
    Breadcrumb,
    Button,
    Col,
    Form,
    Input,
    Modal,
    Row,
    Select,
    Space,
    Spin,
    Table,
    notification,
    Tooltip
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as XLSX from 'xlsx';
import axiosClient from '../../apis/axiosClient';
import orderApi from "../../apis/orderApi";
import moment from "moment";

import "./orderList.css";
import bookingApi from '../../apis/bookingApi';

const { Option } = Select;


const OrderList = () => {

    const [order, setOrder] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [total, setTotalList] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [id, setId] = useState();

    const history = useHistory();

    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            const categoryList = {
                "name": values.name,
                "description": values.description,
                "slug": values.slug
            }
            await axiosClient.post("/category", categoryList).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tạo danh mục thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Tạo danh mục thành công',
                    });
                    setOpenModalCreate(false);
                    handleCategoryList();
                }
            })
            setLoading(false);

        } catch (error) {
            throw error;
        }
    }

    const handleUpdateOrder = async (values) => {
        console.log(values);
        setLoading(true);
        try {
            const categoryList = {
                "description": values.description,
                "status": values.status
            }
            await axiosClient.put("/order/" + id, categoryList).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Cập nhật thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Cập nhật thành công',
                    });
                    setOpenModalUpdate(false);
                    handleCategoryList();
                }
            })
            setLoading(false);

        } catch (error) {
            throw error;
        }
    }

    const handleCancel = (type) => {
        if (type === "create") {
            setOpenModalCreate(false);
        } else {
            setOpenModalUpdate(false)
        }
        console.log('Clicked cancel button');
    };

    const handleCategoryList = async () => {
        try {
            await orderApi.getListOrder({ page: 1, limit: 10000 }).then((res) => {
                setTotalList(res.totalDocs)
                setOrder(res.data.docs);
                setLoading(false);
            });
            ;
        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        };
    }

    const handleFilter = async (name) => {
        try {
            const res = await orderApi.searchOrder(name);
            setTotalList(res.totalDocs)
            setOrder(res.data.docs);
        } catch (error) {
            console.log('search to fetch category list:' + error);
        }
    }

    const columns = [
        {
            title: "ID",
            dataIndex: "_id",
            key: "_id",
        },
        {
            title: "Tên người đặt",
            dataIndex: "user",
            key: "user",
            render: (user) => (
                <Tooltip title={user?.username}>
                    <span>{user?.username || "N/A"}</span>
                </Tooltip>
            ),
        },
        {
            title: "Liên hệ",
            dataIndex: "user",
            key: "user",
            render: (user) => (
                <Tooltip title={user?.phone}>
                    <span>{user?.phone || "N/A"}</span>
                </Tooltip>
            ),
        },
        {
            title: "Khóa học",
            dataIndex: "course",
            key: "course",
            render: (course) => (
                <Tooltip title={course?.title}>
                    <span>{course?.title}</span>
                </Tooltip>
            ),
        },
        {
            title: "Giá",
            dataIndex: "course",
            key: "course",
            render: (course) => (
                <Tooltip title={course?.price}>
                    <span>{course?.price}</span>
                </Tooltip>
            ),
        },
        {
            title: "Mentor",
            dataIndex: "mentor",
            key: "mentor",
            render: (mentor) => (
                <Tooltip title={mentor?.username}>
                    <span>{mentor?.username || "Không chọn mentor"}</span>
                </Tooltip>
            ),
        },
        {
            title: "Ngày đặt",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (createdAt) => (
                <span>{moment(createdAt).format("DD/MM/YYYY HH:mm")}</span>
            ),
        },
    ];

    const exportToExcel = () => {
        const exportData = order.map(item => ({
            "ID Đơn hàng": item._id,
            "Email người dùng": item.user.email,
            "Số điện thoại người dùng": item.user.phone,
            "Tên người dùng": item.user.username,
            "Tổng số sản phẩm": item.products.length,
            "Tổng giá trị đơn hàng": item.orderTotal,
            "Địa chỉ giao hàng": item.address,
            "Hình thức thanh toán": item.billing,
            "Trạng thái đơn hàng": item.status,
            "Mô tả": item.description,
            "Ngày tạo": item.createdAt,
            "Ngày cập nhật": item.updatedAt
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sản phẩm');

        XLSX.writeFile(wb, 'danh_sach_san_pham.xlsx');
    };

    useEffect(() => {
        (async () => {
            try {
                const user = localStorage.getItem('user');
                const parsedUser = user ? JSON.parse(user) : null;

                if (parsedUser.role == "isAdmin") {
                    await bookingApi.getAllBookings({ page: 1, limit: 10000 }).then((res) => {
                        console.log(res);
                        setOrder(res.data);
                    });
                }
                else {
                    const response = await bookingApi.getBookingsByMentor(parsedUser._id);
                    console.log(response.data);
                    setOrder(response.data);
                }
                setLoading(false);


            } catch (error) {
                console.log('Failed to fetch event list:' + error);
            }
        })();
    }, [])
    return (
        <div>
            <Spin spinning={loading}>
                <div className='container'>
                    <div style={{ marginTop: 20 }}>
                        <Breadcrumb>
                            <Breadcrumb.Item href="">
                                <HomeOutlined />
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="">
                                <ShoppingCartOutlined />
                                <span>Quản lý đơn hàng</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <div id="my__event_container__list">
                            <PageHeader
                                subTitle=""
                                style={{ fontSize: 14 }}
                            >
                                <Row>
                                    <Col span="18">
                                        <Input
                                            placeholder="Tìm kiếm"
                                            allowClear
                                            onChange={handleFilter}
                                            style={{ width: 300 }}
                                        />
                                    </Col>
                                    <Col span="6">
                                        <Row justify="end">
                                            <Space>
                                                <Button onClick={exportToExcel} icon={<DownloadOutlined />} style={{ marginLeft: 10 }}>Xuất Excel</Button>
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>

                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table columns={columns} pagination={{ position: ['bottomCenter'] }} dataSource={order} scroll={{ x: 1500 }} />
                    </div>
                </div>

                <Modal
                    title="Tạo danh mục mới"
                    visible={openModalCreate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form
                            .validateFields()
                            .then((values) => {
                                form.resetFields();
                                handleOkUser(values);
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={() => handleCancel("create")}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={600}
                >
                    <Form
                        form={form}
                        name="eventCreate"
                        layout="vertical"
                        initialValues={{
                            residence: ['zhejiang', 'hangzhou', 'xihu'],
                            prefix: '86',
                        }}
                        scrollToFirstError
                    >
                        <Form.Item
                            name="name"
                            label="Tên"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your sender name!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tên" />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Mô tả"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your subject!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Mô tả" />
                        </Form.Item>

                        <Form.Item
                            name="slug"
                            label="Slug"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your content!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Slug" />
                        </Form.Item>

                    </Form>
                </Modal>

                <Modal
                    title="Cập nhật đơn hàng"
                    visible={openModalUpdate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form2
                            .validateFields()
                            .then((values) => {
                                form2.resetFields();
                                handleUpdateOrder(values);
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={handleCancel}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={600}
                >
                    <Form
                        form={form2}
                        name="eventCreate"
                        layout="vertical"
                        initialValues={{
                            residence: ['zhejiang', 'hangzhou', 'xihu'],
                            prefix: '86',
                        }}
                        scrollToFirstError
                    >
                        <Form.Item
                            name="status"
                            label="Trạng thái"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your sender name!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select >
                                <Option value="final">Đã giao</Option>
                                <Option value="approved">Đang vận chuyển</Option>
                                <Option value="pending">Đợi xác nhận</Option>
                                <Option value="rejected">Đã hủy</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Mô tả"
                            style={{ marginBottom: 10 }}
                        >
                            <Input.TextArea rows={4} placeholder="Lưu ý" />
                        </Form.Item>

                    </Form>
                </Modal>


                {/* <Pagination style={{ textAlign: "center", marginBottom: 20 }} current={currentPage} defaultCurrent={1} total={total} onChange={handlePage}></Pagination> */}
                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default OrderList;