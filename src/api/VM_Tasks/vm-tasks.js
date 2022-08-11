import api from '../baseAPI';
import utils from '../api-utils';

const PATH = 'VM_Tasks';

export default {

    async getHistory(filter) {

        let address = `${PATH}/history?`;
        const addressTask = `${PATH}/historyTask?`;

        if (filter.dateFrom) {
            address = `${address}&from=${filter.dateFrom}`;
        }
        if (filter.dateTo) {
            address = `${address}&to=${filter.dateTo}`;
        }
        if (filter.taskId) {
            address = `${addressTask}&taskId=${filter.taskId}`;
        }

        return api.get(address);
    },

    // GET //
    async getTasks(filter) {
        let address = `${PATH}?`;
        address = utils.createURLForTaskFilter(filter, address);
        return api.get(address);
    },

    // POST //
    async post(data) {
        return api.post(`${PATH}/createTask`, data);
    },

    // PUT //
    async put(id, data) {
        const address = `${PATH}/${id}`;
        return api.put(address, data);
    },

    // DELETE //
    async delete(id) {
        const address = `${PATH}/${id}`;
        return api.delete(address);
    },

    // ----------------------------------------------

    async __getById(id) {
        return api.get(`${PATH}/getTask/${id}`);
    },

    async getProgress(id) {
        const address = `${PATH}/TaskProgress/${id}`;
        return api.get(address);
    },

    // POST //
    async setProgress(data) {
        const address = `${PATH}/TaskProgress`;
        return api.post(address, data);
    },


};
