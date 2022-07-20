
import api from '../baseAPI';

const PATH = 'OperatorInBrigades';

export default {

    async getOperator(id) {
        const address = `${PATH}/${id}`;
        return api.get(address);
    },

    async post(data) {
        return api.post(PATH, data);
    },
};
