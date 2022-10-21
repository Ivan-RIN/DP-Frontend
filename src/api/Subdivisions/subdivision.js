import api from '../baseAPI';

const PATH = 'vmTasks/getSubdivisions';

export default {

    async get() {
        return api.get(PATH);
    }

};
