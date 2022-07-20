import api from '../baseAPI';

const PATH = 'History';

export default {

	// GET //

	async getHistoryActions() {
		return api.get(`${PATH}/ActionNames`);
	},

	async get(filter) {
		let address = `${PATH}?`;

		if (filter.dateFrom) {
			address = `${address}&from=${filter.dateFrom}`;
		}
		if (filter.dateTo) {
			address = `${address}&to=${filter.dateTo}`;
		}
		if (filter.taskId) {
			address = `${address}&taskId=${filter.taskId}`;
		}

		return api.get(address);
	},
};
