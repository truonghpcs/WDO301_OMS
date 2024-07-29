import axiosClient from "./axiosClient";

const certificateApi = {
  getCertificateById(id) {
    const url = `/certificate/detail/${id}`;
    return axiosClient.get(url);
  },
  getCertificateByListId(listId) {
    const url = `/certificate/list-id`;
    console.log(listId)
    return axiosClient.post(url, listId);
  },
};

export default certificateApi;
