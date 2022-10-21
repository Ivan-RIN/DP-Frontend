import api from '@/api/api';

const downloadList = [
	{
		address: 'VM_Tasks/getCurrentUser',
		commit: 'getCurrentUser'
	},
	{
		address: 'VM_Tasks/getUsers',
		commit: 'getUsers'
	},
	{
		address: 'VM_Tasks/getDepartments',
		commit: 'getDepartments'
	}
];

const state = {
	currentUser: null,
	users: {},
	departments: {},
	listDepartments: []
};

const getters = {
	//sectors: state => state.sectors
};

const actions = {
	loadAllVM({ commit, state }) {
		downloadList.forEach(async (item) => {
			if (item && item.address) {
				const data = await api.fetchApi(item.address, 'GET');
				commit(item.commit, data);
			}
		});
	},
	setRoles({ commit }) {
		commit('setRoles');
	}
};

const mutations = {
	getCurrentUser(state, payload) {
		state.currentUser = payload;
	},
	getUsers(state, payload) {
		for(let user of payload) {
			state.users[user.id] = user;
		}
	},
	getDepartments(state, payload) {
		for(let department of payload) {
			state.departments[department.id] = department;
			state.listDepartments.push(department);
		}
	}
};

export default
{
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
