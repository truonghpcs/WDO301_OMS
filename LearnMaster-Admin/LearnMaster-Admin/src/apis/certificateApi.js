import axiosClient from "./axiosClient";

const certificateApi = {
  /* API for Courses */

  getAllCertificate() {
    const url = '/certificate/list';
    return axiosClient.get(url);
  },
  createCertificate(data) {
    const url = "/certificate/new";
    return axiosClient.post(url, data);
  },
};

export default certificateApi;
