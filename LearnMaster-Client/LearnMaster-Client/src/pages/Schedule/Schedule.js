import React, { useEffect, useState } from 'react';
import { Table, Spin, Alert, Button } from 'antd';
import "../Schedule/schedule.css";
import axios from 'axios';

function Schedule() {
    const [classes, setClasses] = useState([]);
    const [courses, setCourses] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));

        const fetchClasses = (page) => {
            setLoading(true);
            axios.get(`http://localhost:3100/api/class/user/${user._id}?page=${page}`)
                .then(res => {
                    const fetchedClasses = res.data.data;
                    setClasses(fetchedClasses);
                    setTotalItems(res.data.total);

                    const courseIds = [...new Set(fetchedClasses.map(item => item.course))];
                    return courseIds;
                })
                .then(courseIds => {
                    return Promise.all(courseIds.map(id =>
                        axios.get(`http://localhost:3100/api/course/${id}`)
                    ));
                })
                .then(responses => {
                    const fetchedCourses = responses.reduce((acc, response) => {
                        const course = response.data;
                        if (course && course.data._id && course.data.title) {
                            acc[course.data._id] = course.data.title;
                        } else {
                            console.error("Unexpected course data structure:", course);
                        }
                        return acc;
                    }, {});

                    setCourses(fetchedCourses);
                })
                .catch(err => {
                    setError('Failed to fetch data. Please try again.');
                    console.error(err);
                })
                .finally(() => {
                    setLoading(false);
                });
        };

        fetchClasses(currentPage);
    }, [currentPage]);

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
            key: 'course',
            render: (text, record) => courses[record.course] || 'Loading...',
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
            <div className='title'>
                <h1>Schedule</h1>
            </div>
            <Table
                dataSource={classes}
                columns={columns}
                rowKey="_id"
                pagination={{
                    current: currentPage,
                    total: totalItems,
                    pageSize: 10,
                    onChange: (page) => setCurrentPage(page),
                }}
            />
        </div>
    );
}

export default Schedule;
