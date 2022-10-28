import api from '@/api/api';
//import loginApi from '@/api/login-api';

const downloadList = [
	// {
	// 	address: 'Tasks/getCurrentUser',
	// 	commit: 'getCurrentUser'
	// },
	{
		address: 'Tasks/getUsers',
		commit: 'getUsers'
	},
	{
		address: 'Tasks/getDepartments',
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
	// async loginDtm({ commit }) {
	// 	const user = await loginApi.loginDtm();
	// 	if (Object.keys(user).length) {
	// 		commit('setLogin', user);
	// 	}
	// 	commit('setIsLogin', true);
	// },
	loadAllVM({ commit, state }) {
		downloadList.forEach(async (item) => {
			if (item && item.address) {
				const data = await api.fetchApi(item.address, 'GET');
				commit(item.commit, data);
			}
		});
	},
	setCurrentUser({ commit }, currentUser) {
		//commit('getCurrentUser', currentUser);
		console.log(commit);
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
