import React, { useEffect, useState } from 'react';
import { Table, Image } from 'antd';
import 'antd/dist/reset.css'; 


function Certificate() {
    const [certificates, setCertificates] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3100/api/certificate/list')
            .then(response => response.json())
            .then(data => setCertificates(data.data))
            .catch(error => console.error('Error fetching certificates:', error));
    }, []);

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
    ];

    return (
        <Table dataSource={certificates} columns={columns} rowKey="_id" />
    );
}

export default Certificate;
