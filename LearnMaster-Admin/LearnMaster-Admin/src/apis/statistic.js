import axiosClient from './axiosClient';

const statisticApi = {
    /*Danh sách api sự kiện */
    getTotal() {
        const url = '/stats/counts';
        return axiosClient.get(url);
    },
}

export default statisticApi;