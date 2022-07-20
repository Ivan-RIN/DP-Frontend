
import api from '../baseAPI';

const PATH = 'Facilities';

export default {

    async get() {
        return api.get(PATH);
    },

    async getByType(type) {
        const address = `${PATH}?type=${type}`;
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
