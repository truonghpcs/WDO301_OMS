import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Card, notification } from 'antd';
import axiosClient from '../../apis/axiosClient';
import "./activateAccount.css";

const ActivateAccount = () => {
    const { token } = useParams();
    const history = useHistory();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const activateAccount = async () => {
            try {
                const response = await axiosClient.get(`http://localhost:3100/api/auth/activate/${token}`);
                if (response.status) {
                    notification['success']({
                        message: 'Thông báo',
                        description: 'Kích hoạt tài khoản thành công!',
                    });
                    setTimeout(() => {
                        history.push('/login');
                    }, 2000);
                } else {
                    notification['error']({
                        message: 'Thông báo',
                        description: 'Kích hoạt tài khoản thất bại hoặc token không hợp lệ!',
                    });
                }
            } catch (error) {
                notification['error']({
                    message: 'Thông báo',
                    description: 'Kích hoạt tài khoản thất bại!',
                });
            } finally {
                setLoading(false);
            }
        };

        activateAccount();
    }, [token, history]);

    return (
        <div className="activation-wrapper">
            <Card className="activation-card">
                {loading ? <p>Đang xử lý...</p> : <p>Vui lòng kiểm tra thông báo để biết kết quả.</p>}
            </Card>
        </div>
    );
};

export default ActivateAccount;
