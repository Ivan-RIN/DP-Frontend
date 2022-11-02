import api from '../baseAPI';

const PATH = 'VM_Tasks/getSectors';

export default {

    async get() {
        return api.get(PATH);
    }

};
