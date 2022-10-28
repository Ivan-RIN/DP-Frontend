import api from './api';

export default
{
	async login() {
		return api.fetchApi('UserProfiles/current/', 'GET');
	},
	async loginDtm() {
		return api.fetchApi('Tasks/getCurrentUser', 'GET');
	},
};
