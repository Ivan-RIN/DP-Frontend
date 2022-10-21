import api from './api';

export default
{
	async login() {
		return api.fetchApi('UserProfiles/current/', 'GET');
	},
};
