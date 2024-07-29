import React, { useEffect, useState } from 'react';
import { Table, Image, Button, notification, Popconfirm } from 'antd';
import 'antd/dist/reset.css'; // Ensure this import matches your Ant Design version

function Certificate() {
    const [certificates, setCertificates] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3100/api/certificate/list')
            .then(response => response.json())
            .then(data => setCertificates(data.data))
            .catch(error => console.error('Error fetching certificates:', error));
    }, []);

    const handleDelete = (id) => {
        fetch(`http://localhost:3100/api/certificate/delete/${id}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(() => {
                setCertificates(prevCertificates =>
                    prevCertificates.filter(cert => cert._id !== id)
                );
                notification.success({
                    message: 'Success',
                    description: 'Certificate deleted successfully.',
                });
            })
            .catch(error => {
                console.error('Error deleting certificate:', error);
                notification.error({
                    message: 'Error',
                    description: 'Failed to delete certificate.',
                });
            });
    };

    const columns = [
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (text) => <Image width={50} src={text} />,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            key: 'slug',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Popconfirm
                    title="Are you sure you want to delete this certificate?"
                    onConfirm={() => handleDelete(record._id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="danger">
                        Delete
                    </Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <div>
            <Table dataSource={certificates} columns={columns} rowKey="_id" />
        </div>
    );
}

export default Certificate;
