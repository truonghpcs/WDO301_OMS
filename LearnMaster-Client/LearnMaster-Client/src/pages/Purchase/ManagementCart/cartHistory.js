import {
  Breadcrumb,
  Card,
  Form,
  Spin,
  Table,
  Tooltip,
  notification
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import bookingApi from "../../../apis/bookingApi"; 

const CartHistory = () => {
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  let { id } = useParams();
  const history = useHistory();

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "_id",
      key: "_id",
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
      title: "Mentor",
      dataIndex: "mentor",
      key: "mentor",
      render: (mentor) => (
        <Tooltip title={mentor?.username}>
          <span>{mentor?.username}</span>
        </Tooltip>
      ),
    },
    {
      title: "Địa chỉ",
      dataIndex: "user.address",
      key: "address",
      render: (address) => address || "Chưa có địa chỉ",
    },
    {
      title: "Hình thức thanh toán",
      dataIndex: "billing",
      key: "billing",
      render: (billing) => billing || "Chưa có thông tin thanh toán",
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

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const user = localStorage.getItem('user');
        const parsedUser = user ? JSON.parse(user) : null;
        const response = await bookingApi.getBookingsByUser(parsedUser._id); 
        console.log(response.data); 
        setOrderList(response.data); 
        setLoading(false); 
      } catch (error) {
        console.log("Failed to fetch bookings:", error);
      }
    };

    fetchBookings(); 
  }, [id]);

  return (
    <div>
      <Spin spinning={loading}>
        <Card className="container_details">
          <div className="product_detail">
            <div
              style={{ marginLeft: 5, marginBottom: 10, marginTop: 10 }}
            >
              <Breadcrumb>
                <Breadcrumb.Item href="http://localhost:3500/home">
                  <span>Trang chủ</span>
                </Breadcrumb.Item>
                <Breadcrumb.Item href="">
                  <span>Quản lý khóa học</span>
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <hr></hr>
            <div className="container" style={{ marginBottom: 30 }}>
              <Card>
                <Table
                  columns={columns}
                  dataSource={orderList}
                  rowKey="_id"
                  pagination={{ position: ["bottomCenter"] }}
                />
              </Card>
            </div>
          </div>
        </Card>
      </Spin>
    </div>
  );
};

export default CartHistory;
