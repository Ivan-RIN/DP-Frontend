import api from '../baseAPI';

const PATH = 'PerformanceCriterions';

export default {

    // //    GET    //////

    async get() {
        return api.get(PATH);
    },

    async getById(id) {
        const address = `${PATH}/${id}`;
        return api.get(address);
    },

    async getTypes() {
        const address = `${PATH}/types`;
        return api.get(address);
    },

    // //    POST    //////

    async post(data) {
        return api.post(PATH, data);
    },

    // //    PUT    //////

    async put(id, data) {
        const address = `${PATH}/${id}`;
        return api.put(address, data);
    },

    // //    DELETE    //////

    async delete(id) {
        const address = `${PATH}/${id}`;
        return api.delete(address);
    },
};
