
import api from './api';

// const address = 'UserProfiles';

export const addresses = {
    userProfile: 'UserProfiles',
    blockEquipments: 'BlockEquipments',
    brigades: 'Brigades',
    departments: 'Departments',
    facilities: 'Facilities',
    mechanism: 'Mechanism',
    operators: 'Operators',
    posts: 'Posts',
    revolvingFonds: 'RevolvingFonds',
    SOPs: 'SOPs',
    taskCategories: 'TaskCategories',
    workCategories: 'WorkCategories',
    performanceCriterions: 'PerformanceCriterions',
    roles: 'Roles',
    userActions: 'History/ActionNames',
};

export default {

    async get(address, id) {
        const ad = (id) ? `${address}/${id}` : address;
        return api.fetchApi(ad, 'GET');
    },

    async post(address, data) {
        return api.fetchApi(address, 'POST', data);
    },

    async put(address, id, data) {
        const ad = (id) ? `${address}/${id}` : address;
        return api.fetchApi(ad, 'PUT', data);
    },

    async delete(address, id) {
        const ad = (id) ? `${address}/${id}` : address;
        return api.fetchApi(ad, 'POST');
    },

    getAddresses() {
        return addresses;
    },
};
