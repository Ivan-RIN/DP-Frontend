import api from '../baseAPI';

const PATH = 'Files';

export default {

	async getById(id) {
		const address = `${PATH}/${id}`;
		return api.get(address);
	},

	async post(data) {
		const address = `${PATH}/UploadFiles`;
		return api.post(address, data);
	},
};
