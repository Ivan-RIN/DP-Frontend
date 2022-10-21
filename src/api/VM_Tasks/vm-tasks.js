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

    // FORM - POST //
    async appendComment(data) {
        const address = `${PATH}/appendComment/`;
        return api.form(address, data);
    },

    async appendFiles(data) {
        const address = `${PATH}/appendFiles/`;
        return api.form(address, data);
    },

    async downloadFile(fileId, data) {
        const address = `${PATH}/downloadFile/${fileId}`;
        return api.getFile(address, data)
    },

    async deleteFile(fileId) {
        const address = `${PATH}/deleteFile/${fileId}`;
        return api.get(address)
    }

};
