import axiosClient from "./axiosClient";

const userApi = {
  login(email, password) {
    const url = "/auth/login";
    return axiosClient.post(url, { email, password }).then((response) => {
      console.log(response);
      if (response.status) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
      }
      return response;
    });
  },
  logout() {
    const url = "/user/logout";
    return axiosClient.get(url);
  },
  listUserByAdmin(data) {
    const url = "/user/search";
    const defaultLimit = 10;
    const defaultPage = 1;
    const { limit = defaultLimit, page = defaultPage } = data;
    return axiosClient.post(url, { limit, page });
  },
  banAccount(data, id) {
    const url = `/user/${id}`;
    return axiosClient.put(url, data);
  },
  unBanAccount(data, id) {
    const url = `/user/${id}`;
    return axiosClient.put(url, data);
  },
  getProfile() {
    const url = "/user/profile";
    return axiosClient.get(url);
  },
  getProfileById(id) {
    const url = `/user/profile/${id}`;
    return axiosClient.get(url);
  },
  searchUser(email) {
    console.log(email);
    const params = { email: email.target.value };
    const url = "/user/searchByEmail";
    return axiosClient.get(url, { params });
  },
  addCertificateToMentor(id, data) {
    const url = `/user/${id}/add-certificate-to-mentor`;
    return axiosClient.put(url, data);
  },
  createClass(data) {
    const url = `/user/create-class`;
    return axiosClient.post(url, data);
  },
};

export default userApi;
