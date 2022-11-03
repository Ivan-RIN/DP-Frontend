import api from '@/api/api';

const downloadList = [

	{
		address: 'Loader/getOrganizations',
		commit: 'setOrganizations'
	},
	{
		address: 'Loader/getDepartments',
		commit: 'setDepartments'
	},
	{
		address: 'Loader/getUsers',
		commit: 'setUsers'
	},
	{
		address: 'Loader/getBoards',
		commit: 'setBoards'
	},
	{
		address: 'Loader/getBoardRoles',
		commit: 'setBoardRoles'
	},
];

const state = {
	currentUser: null,
	users: {},
	organizations: {},
	departments: {},
	boards: {},
	boardRoles: {},
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
	setOrganizations(state, payload) {
		for(let item of payload) {
			state.organizations[item.id] = item;
		}
	},
	setDepartments(state, payload) {

		state.listDepartments.push(...payload);

		let departments = {};

		for(let item of payload) {
			item.childs = [];
			item.relatives = [item.id];
			item.parent = null;
			departments[item.id] = item;
		}

		for(let item of payload) {
			if (item.parentId) {
				let parentId = item.parentId;
				let parent = state.departments[parentId];
				item.parent = parent;
				parent.childs.push(item);
				parent.relatives.push(item.id);
			} else {
				state.structureDepartments.push(item);
			}
		}

		state.departments = departments;
	},
	setUsers(state, payload) {
		for(let item of payload) {
			state.users[item.id] = item;
		}
	},
	setBoards(state, payload) {
		for(let item of payload) {
			state.boards[item.id] = item;
		}
	},
	setBoardRoles(state, payload) {
		for(let item of payload) {
			state.boardRoles[item.boardId] = item.roleId;
		}
	},
};

export default
{
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
