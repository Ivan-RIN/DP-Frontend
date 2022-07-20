
import api from '../baseAPI';

const PATH = 'Brigades';

export default {

    async get() {
        return api.get(PATH);
    },

    async getActive() {
        const address = `${PATH}/active`;
        return api.get(address);
    },

    async getById(id) {
        const address = `${PATH}/${id}`;
        return api.get(address);
    },

    async post(data) {
        return api.post(PATH, data);
    },

    async put(id, data) {
        const address = `${PATH}/${id}`;
        return api.put(address, data);
    },

    async delete(id) {
        const address = `${PATH}/${id}`;
        return api.delete(address);
    },
};
