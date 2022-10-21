const state = {
	tasks: [],
	selectedCDNG: undefined,
	selectedField: undefined,
	selectedBrigade: undefined
};

const getters = {
	tasks: state => state.tasks
};

const actions = {
	appendTasks({ commit }, payload) {
		commit('appendTasks', payload);
	},
	setFieldValue({ commit }, payload) {
		commit('setFieldValue', payload);
	},
};

const mutations = {
	setFieldValue(state, payload) {
		let name = payload[0];
		let value = payload[1];
		state[name] = value;
	},
	appendTasks(state, payload) {
		state.tasks = payload;
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
