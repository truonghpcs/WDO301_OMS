import React from 'react';
import { useEffect, useState } from 'react';
import { Table, Image, Button, notification, Popconfirm } from 'antd';
import 'antd/dist/reset.css'; // Ensure this import matches your Ant Design version
import { useHistory } from 'react-router-dom';
import axios from 'axios';

function TeachingSchedule(props) {
    // get all bookings
    const [myBookings, setMyBookings] = useState([]);
    console.log(myBookings);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const fetchBookings = async () => {
            try {
                const response = await axios.get('http://localhost:3100/api/bookings');
                const bookings = response.data.data;
                const myBookings = bookings.filter(booking => booking.mentorId === user._id);
                setMyBookings(myBookings);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }

        }
        
        fetchBookings();
    }, []);

    return (
        <div>
            <h1>Teaching Schedule</h1>

        </div>
    );
}

export default TeachingSchedule;