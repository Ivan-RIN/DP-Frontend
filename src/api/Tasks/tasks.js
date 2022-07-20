import api from '../baseAPI';
import utils from '../api-utils';
// import TaskListComponent from '../../components/tasks/task-list-component.vue';

const PATH = 'Tasks';

export default {

    // GET //

    async getTasks(filter) {
        let address = `${PATH}?`;
        address = utils.createURLForTaskFilter(filter, address);
        // TaskListComponent.cdngToFilter = '';
        // TaskListComponent.authorToFilter = '';
        // TaskListComponent.executorToFilter = '';
        return api.get(address);
    },

    async getById(id) {
        return api.get(`${PATH}/${id}`);
    },

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

    // POST //

    async post(data) {
        return api.post(PATH, data);
    },

    async postPlanTasks(data) {
        const address = `${PATH}/plantasks`;
        return api.post(address, data);
    },

    async postTaskStatus(status, data) {
        const address = `${PATH}/status/${status}`;
        return api.post(address, data);
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
};
