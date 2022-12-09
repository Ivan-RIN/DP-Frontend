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
		address: 'Loader/GetBoardBlocks',
		commit: 'setBoardBlocks'
	},
	// {
	// 	address: 'Loader/getBoardSections',
	// 	commit: 'setBoardSections'
	// },
	{
		address: 'Loader/getBoardUsers',
		commit: 'setBoardUsers'
	},
];

const state = {
	blockId: 0,
	boardId: 0,
	blocks: [],
	currentUser: null,
	listUsers: [],
	users: {},
	organizations: {},
	departments: {},
	boards: {},
	boardBlocks: {},
	boardUsers: {},
	rootDepartments: [],
	listDepartments: []
};

const getters = {
	currentUser: state => state.currentUser,
	blockId: state => state.blockId,
	boardId: state => state.boardId,
};

let count = 0;

const actions = {

	loadAllVM({ commit, state }, downloadEvent) {
		downloadList.forEach(async (item) => {
			if (item && item.address) {
				count ++;
				const data = await api.fetchApi(item.address, 'GET');
				commit(item.commit, data);
				count --;
				if (!count) {
					commit('downloadCompleted');
					downloadEvent();
				}
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
	setBoards(state, payload) {
		state.boards = payload;
	},
	setBlockId(state, payload) {
		state.blockId = payload;
	},
	setBoardId(state, payload) {
		state.boardId = payload;
	},
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
			item.users = [];
			item.childs = [];
			item.relatives = [item.id];
			item.parent = null;
			departments[item.id] = item;
		}

		for(let item of payload) {
			if (item.parentId) {
				let parentId = item.parentId;
				let parent = departments[parentId];
				//item.parent = parent;
				parent.childs.push(item);
				parent.relatives.push(item.id);
			} else {
				state.rootDepartments.push(item);
			}
		}

		state.departments = departments;
	},
	setUsers(state, payload) {
		state.listUsers.push(...payload);
		for(let item of payload) {
			state.users[item.id] = item;
		}
	},
	setBoardBlocks(state, payload) {
		for(let item of payload) {
			state.boardBlocks[item.id] = item;
		}
	},
	setBoardUsers(state, payload) {
		for(let item of payload) {
			state.boardUsers[item.boardId] = item.roleId;
		}
	},
	downloadCompleted(state) {
		console.log('- Download Completed -');
		for (let id in state.users) {
			let user = state.users[id];
			if (user.departmentId) {
				let dep = state.departments[user.departmentId];
				if (!dep) continue;
				dep.users.push(user);
				while (dep.parentId) {
					dep = state.departments[dep.parentId];
					dep.users.push(user);
				}
				//user.department = dep;
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
