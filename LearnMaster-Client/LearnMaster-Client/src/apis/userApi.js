import axiosClient from "./axiosClient";

const userApi = {
  login(email, password) {
    const url = "/auth/login";
    return axiosClient
      .post(url, {
        email,
        password,
      })
      .then((response) => {
        console.log(response);
        if (response.user.status === "actived") {
          localStorage.setItem("client", response.token);
          localStorage.setItem("user", JSON.stringify(response.user));
        }
        return response;
      });
  },
  listUserByAdmin(data) {
    const url = "/user/search";
    if (!data.page || !data.limit) {
      data.limit = 10;
      data.page = 1;
    }
    return axiosClient.post(url, data);
  },
  logout(data) {
    const url = "/user/logout";
    return axiosClient.get(url);
  },
  pingRole() {
    const url = "/user/ping_role";
    return axiosClient.get(url);
  },
  getProfile() {
    const url = "/user/profile";
    return axiosClient.get(url);
  },
  getProfileById(id) {
    const url = `/user/profile/${id}`;
    return axiosClient.get(url);
  },
  updateProfile(editedUserData, id) {
    const url = "/user/update/" + id;
    return axiosClient.put(url, editedUserData);
  },
  forgotPassword(data) {
    const url = "/auth/forgot-password";
    return axiosClient.post(url, data);
  },
  registerClass(data, id) {
    const url = `/user/${id}/register-class`;
    return axiosClient.put(url, data);
  },
};

export default userApi;
