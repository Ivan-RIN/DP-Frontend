
import api from './api';

export default {

    async get(address) {
        return api.fetchApi(address, 'GET');
    },

    async getFile(address, data) {
        return api.fetchApiFile(address, 'GET', data);
    },

    async post(address, data) {
        return api.fetchApi(address, 'POST', data);
    },

    async put(address, data) {
        return api.fetchApi(address, 'PUT', data);
    },

    async delete(address, data) {
        return api.fetchApi(address, 'DELETE', data);
    },
};
