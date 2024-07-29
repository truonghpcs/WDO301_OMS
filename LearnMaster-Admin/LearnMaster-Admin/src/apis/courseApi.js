import axiosClient from "./axiosClient";

const courseApi = {
  /* API for Courses */

  createCourse(data) {
    const url = "/course";
    return axiosClient.post(url, data);
  },
  updateCourse(id, data) {
    const url = `/course/${id}`;
    return axiosClient.put(url, data);
  },
  deleteCourse(id) {
    const url = `/course/${id}`;
    return axiosClient.delete(url);
  },
  getAllCourses(data = { page: 1, limit: 100000 }) {
    const url = "/course";
    return axiosClient.get(url, { params: data });
  },
  searchCourse(title, data = { page: 1, limit: 100000 }) {
    const url = "/course/search";
    return axiosClient.get(url, { params: { title, ...data } });
  },
  getCourseById(id) {
    const url = `/course/${id}`;
    return axiosClient.get(url);
  },
  addCertificateToCourse(id, data) {
    const url = `course/${id}/add-certificate-to-course`;
    return axiosClient.put(url, data);
  },
  enrollCourse(courseId, userId) {
    const url = `/course/enroll/${courseId}`;
    return axiosClient.post(url, { userId });
  },
  unenrollCourse(courseId, userId) {
    const url = `/course/unenroll/${courseId}`;
    return axiosClient.post(url, { userId });
  },
  getCoursesByUserId(userId) {
    const url = `/course/user/${userId}`;
    return axiosClient.get(url);
  },
};

export default courseApi;
