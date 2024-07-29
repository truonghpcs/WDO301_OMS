import axiosClient from './axiosClient';

const bookingApi = {
    /* API for Bookings */

    bookCourse(data) {
        const url = '/bookings';
        return axiosClient.post(url, data);
    },
    getBookingsByUser(userId) {
        const url = `/bookings/user/${userId}`;
        return axiosClient.get(url);
    },
    getBookingsByMentor(mentorId) {
        const url = `/bookings/mentor/${mentorId}`;
        return axiosClient.get(url);
    },
    cancelBooking(id) {
        const url = `/bookings/cancel/${id}`;
        return axiosClient.put(url);
    },
    getAllBookings(data = { page: 1, limit: 10 }) {
        const url = '/bookings';
        return axiosClient.get(url, { params: data });
    },
    createCheckoutSession(data) {
        const url = '/bookings/create-checkout-session';
        return axiosClient.post(url, data);
    },
    createPayment(data) {
        const url = '/bookings/create-payment';
        return axiosClient.post(url, data);
    }
}

export default bookingApi;
