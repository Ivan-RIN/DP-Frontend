
import api from '../baseAPI';

const PATH = 'GroupTaskWork';

export default {
    async setGroupStatus(statusId, taskList) {
        const data = { status: statusId, tasks: taskList };
        const address = `${PATH}/SetState`;
        return api.post(address, data);
    },
};
