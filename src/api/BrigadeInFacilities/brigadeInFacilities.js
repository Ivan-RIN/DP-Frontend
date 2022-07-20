
import api from '../baseAPI';

const PATH = 'BrigadeInFacilities';

export default {

    async get(id) {
        const address = `${PATH}/${id}/facilities`;
        return api.get(address);
    },

    async getBrigadeId(facilityId) {
        const address = `${PATH}/${facilityId}/brigade`;
        return api.get(address);
    },

    async post(data) {
        return api.post(PATH, data);
    },

    async put(id, data) {
        const address = `${PATH}/${id}`;
        return api.put(address, data);
    },

    // TODO check swagger api
    async delete(brigadeId, facilityId) {
        const address = `${PATH}?FacilityId=${facilityId}&BrigadeId=${brigadeId}`;
        return api.delete(address);
    },
};
