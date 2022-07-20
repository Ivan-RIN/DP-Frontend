
import api from '../baseAPI';

const PATH = 'Departments';

export default {

    async get() {
        return api.get(PATH);
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
