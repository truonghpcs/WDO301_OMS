import React, { useEffect, useState } from 'react';
import 'antd/dist/reset.css'; // Đảm bảo import này phù hợp với phiên bản Ant Design của bạn
import { Table, Spin, Alert, Button } from 'antd';
import axios from 'axios';
import '../TeachingsSchedule/teachingSchedule.css'; // Đảm bảo đường dẫn này chính xác

function TeachingSchedule() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        axios.get(`http://localhost:3100/api/class/mentor/${user._id}`)
            .then(res => {
                setClasses(res.data.data);
            })
            .catch(err => {
                setError('Failed to fetch data. Please try again.');
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const columns = [
        {
            title: 'Date',
            dataIndex: 'dateLearn',
            key: 'dateLearn',
        },
        {
            title: 'Time Start',
            dataIndex: 'timeStart',
            key: 'timeStart',
        },
        {
            title: 'Time End',
            dataIndex: 'timeEnd',
            key: 'timeEnd',
        },
        {
            title: 'Course',
            dataIndex: 'course',
            key: 'course',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Button
                    type="primary"
                    href={record.urlLearn}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Vào lớp học
                </Button>
            ),
        },
    ];

    if (loading) return <Spin size="large" />;
    if (error) return <Alert message="Error" description={error} type="error" />;

    return (
        <div className='Teaching-Schedule'>
            <h1>Teaching Schedule</h1>
            <Table
                dataSource={classes}
                columns={columns}
                rowKey="_id"
                pagination={false}
            />
        </div>
    );
}

export default TeachingSchedule;
