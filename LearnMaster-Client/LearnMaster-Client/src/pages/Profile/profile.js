import { PhoneOutlined, SafetyOutlined, UserOutlined } from '@ant-design/icons';
import {
    Button,
    Card,
    Col,
    Divider,
    Form,
    Input,
    Modal,
    Row,
    Spin,
    notification
} from 'antd';
import React, { useEffect, useState } from 'react';
import ReactWeather, { useOpenWeather } from 'react-open-weather';
import { useHistory } from 'react-router-dom';
import userApi from "../../apis/userApi";
import bookingApi from "../../apis/bookingApi"; // Thêm import bookingApi
import "./profile.css";


const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [userData, setUserData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editedUserData, setEditedUserData] = useState({});
    const [paymentAmount, setPaymentAmount] = useState(0); // State để lưu số tiền cần nạp

    const history = useHistory();

    const { data, isLoading, errorMessage } = useOpenWeather({
        key: '03b81b9c18944e6495d890b189357388',
        lat: '21.028511',
        lon: '105.804817',
        lang: 'vi',
        unit: 'metric', // values are (metric, standard, imperial)
    });

    const handleEditProfile = () => {
        setEditedUserData(userData);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSave = async () => {
        console.log(editedUserData);
        const local = localStorage.getItem("user");
        const user = JSON.parse(local);
        editedUserData._id = user?._id;
        try {
            const response = await userApi.updateProfile(editedUserData, user?._id);
            notification.success({ message: 'Cập nhật thông tin thành công' });
            setIsModalVisible(false);
            handleListUser();

        } catch (error) {
            console.log('Failed to update profile:', error);
            notification.error({ message: 'Có lỗi xảy ra khi cập nhật thông tin' });
        }
    };

    const handlePayment = async () => {
        try {
            const paymentData = {
                items: [{ price: paymentAmount, qty: 1 }],
                userId: userData._id
            };
            const response = await bookingApi.createPayment(paymentData);
            window.location.href = response.data;
        } catch (error) {
            console.log('Failed to make payment:', error);
            notification.error({ message: 'Có lỗi xảy ra khi nạp tiền' });
        }
    };

    const handlePaymentAmountChange = (e) => {
        setPaymentAmount(e.target.value); 
    };

    const handleListUser = () => {
        (async () => {
            try {
                const local = localStorage.getItem("user");
                const user = JSON.parse(local);
                const response = await userApi.getProfileById(user._id);
                console.log(response)
                localStorage.setItem("user", JSON.stringify(response.data));
                setUserData(response.data);
                setLoading(false);
            } catch (error) {
                console.log('Failed to fetch profile user:' + error);
            }
        })();
        window.scrollTo(0, 0);
    };
    useEffect(() => {
        handleListUser();
    }, []);

    return (
        <div>
            <Spin spinning={loading}>
                <div style={{ marginBottom: 25, marginTop: 25 }}>
                    <div className='container'>
                        <Row justify="center">
                            <Col span="9" style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                                <Card hoverable={true} className="profile-card" style={{ padding: 0, margin: 0 }}>
                                    <Row justify="center" style={{ padding: 20 }}>
                                        <img src={userData.image} style={{ width: 150, height: 150 }}></img>
                                    </Row>
                                    <Row justify="center">
                                        <Col span="24">
                                            <Row justify="center">
                                                <strong style={{ fontSize: 18 }}>{userData.username}</strong>
                                            </Row>
                                            <Row justify="center">
                                                <p style={{ padding: 0, margin: 0, marginBottom: 5 }}>{userData.email}</p>
                                            </Row>
                                            <Row justify="center">
                                                <p>{userData.birthday}</p>
                                            </Row>
                                            <Divider style={{ padding: 0, margin: 0 }} ></Divider>
                                            <Row justify="center" style={{ marginTop: 10 }}>
                                                <Col span="8">
                                                    <Row justify="center">
                                                        <p>{<UserOutlined />}</p>
                                                        <p style={{ marginLeft: 5 }}>Ví tiền: {Number(userData.balance).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                                                    </Row>
                                                </Col>
                                                <Col span="8">
                                                    <Row justify="center">
                                                        <p>{<PhoneOutlined />}</p>
                                                        <p style={{ marginLeft: 5 }}>{userData.phone}</p>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row justify="center" style={{ marginTop: 20, marginBottom: 15 }}>
                                                <Button type="primary" onClick={handleEditProfile}>
                                                    Chỉnh sửa profile
                                                </Button>
                                            </Row>
                                            <Row justify="center" style={{ marginTop: 20, marginBottom: 15 }}>
                                                <Form.Item label="Số tiền cần nạp">
                                                    <Input
                                                        type="number"
                                                        value={paymentAmount}
                                                        onChange={handlePaymentAmountChange}
                                                        placeholder="Nhập số tiền"
                                                    />
                                                </Form.Item>
                                                <Button type="primary" onClick={handlePayment}>
                                                    Nạp tiền vào tài khoản
                                                </Button>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>

                            <Col span="6" style={{ marginTop: 20 }}>
                                <ReactWeather
                                    isLoading={isLoading}
                                    errorMessage={errorMessage}
                                    data={data}
                                    lang="en"
                                    locationLabel="Hà Nội"
                                    unitsLabels={{ temperature: 'C', windSpeed: 'Km/h' }}
                                    showForecast
                                />
                            </Col>
                        </Row>
                    </div>
                </div>
            </Spin>

            <Modal
                title="Chỉnh sửa profile"
                visible={isModalVisible}
                onCancel={handleCancel}
                onOk={handleSave}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={editedUserData}
                    onValuesChange={(changedValues, allValues) => {
                        setEditedUserData(allValues);
                    }}
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please enter your username' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please enter your email' }]}

                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[{ required: true, message: 'Please enter your birthday' }]}
                    >
                        <Input />
                    </Form.Item>

                </Form>
            </Modal>
        </div>
    );
};

export default Profile;
