import api from '@/api/api';

const downloadList = [
	// {
	// 	address: 'Tasks/getCurrentUser',
	// 	commit: 'setCurrentUser'
	// },
	{
		address: 'Tasks/getUsers',
		commit: 'setUsers'
	},
	{
		address: 'Tasks/getDepartments',
		commit: 'setDepartments'
	}
];

const state = {
	currentUser: null,
	users: {},
	departments: {},
	structureDepartments: [],
	listDepartments: []
};

const getters = {
	currentUser: state => state.currentUser
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
	setCurrentUser({ commit }, currentUser) {
		commit('setCurrentUser', currentUser);
	},
	setRoles({ commit }) {
		commit('setRoles');
	}
};

const mutations = {

	setCurrentUser(state, payload) {
		state.currentUser = payload;
	},

	setUsers(state, payload) {
		for(let user of payload) {
			state.users[user.id] = user;
		}
	},

	setDepartments(state, payload) {

		state.listDepartments.push(...payload);

		for(let department of payload) {
			department.childs = [];
			department.parent = null;
			state.departments[department.id] = department;
		}

		for(let department of payload) {
			if (department.parentId) {
				let parentId = department.parentId;
				let parent = state.departments[parentId];
				parent.childs.push(department);
			} else {
				state.structureDepartments.push(department);
			}
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
