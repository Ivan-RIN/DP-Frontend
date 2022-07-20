const state = {
	periodicType:
	[
		{ id: 0, name: 'Периодическая' },
		{ id: 1, name: 'Еженедельно' },
		{ id: 2, name: 'Ежемесячно' },
	],
	yearMonth: [
		{ id: 1, name: 'Янв', classSuffix: 'jan' },
		{ id: 2, name: 'Фев', classSuffix: 'feb' },
		{ id: 3, name: 'Мар', classSuffix: 'mar' },
		{ id: 4, name: 'Апр', classSuffix: 'apr' },
		{ id: 5, name: 'Май', classSuffix: 'may' },
		{ id: 6, name: 'Июн', classSuffix: 'jun' },
		{ id: 7, name: 'Июл', classSuffix: 'jul' },
		{ id: 8, name: 'Авг', classSuffix: 'aug' },
		{ id: 9, name: 'Сен', classSuffix: 'sep' },
		{ id: 10, name: 'Окт', classSuffix: 'okt' },
		{ id: 11, name: 'Ноя', classSuffix: 'nov' },
		{ id: 12, name: 'Дек', classSuffix: 'dec' },
	],
	weekDay: [
		{ id: 1, name: 'Пн', classSuffix: 'monday' },
		{ id: 2, name: 'Вт', classSuffix: 'tuesday' },
		{ id: 3, name: 'Ср', classSuffix: 'wednesday' },
		{ id: 4, name: 'Чт', classSuffix: 'thursday' },
		{ id: 5, name: 'Пт', classSuffix: 'friday' },
		{ id: 6, name: 'Сб', classSuffix: 'saturday' },
		{ id: 0, name: 'Вс', classSuffix: 'sunday' },
	],
	filterState: {
		brigades: [],
		dateFrom: undefined,
		dateTo: undefined,
		status: undefined,
		executorStatus: undefined,
		taskCategoryId: undefined,
		onlyExecutorTasks: undefined,
	},
	loaderState: false,
};

const getters = {
	periodicType: state => state.periodicType,
	yearMonth: state => state.yearMonth,
	weekDay: state => state.weekDay,
	filterState: state => state.filterState,
};

const actions = {
	setDefaultOperatorFilter({ commit }) {
		const day = new Date();
		const now = day.toISOString().substring(0, 10);
		const yesterday = new Date(day.setDate(day.getDate() - 1)).toISOString().substring(0, 10);

		commit('setDateFrom', yesterday);
		commit('setDateTo', now);
		commit('setBrigades', []);
		commit('setStatus', undefined);
		commit('setExecutorStatus', false);
		commit('setTaskCategoryId', undefined);
		commit('setOnlyExecutorTasks', true);
	},
	setDefaultFilterState({ commit }) {
		const date = new Date().toISOString().substring(0, 10).split('-');
		const year = parseInt(date[0], 10);
		const month = parseInt(date[1], 10) - 1;
		const dateFrom = new Date(year, month, 2).toISOString().substring(0, 10);
		const now = new Date().toISOString().substring(0, 10);
		// const dateFrom = now;
		//commit('setDateFrom', dateFrom);
		commit('setDateFrom', now);
		commit('setDateTo', now);
		commit('setBrigades', []);
		commit('setStatus', undefined);
		commit('setExecutorStatus', false);
		commit('setTaskCategoryId', undefined);
		commit('setOnlyExecutorTasks', false);
	},
	setLoaderState({ commit }, loaderState) {
		commit('setLoaderState', loaderState);
	},
};

const mutations = {
	setDateFrom(state, payload) {
		state.filterState.dateFrom = payload;
	},
	setDateTo(state, payload) {
		state.filterState.dateTo = payload;
	},
	setBrigades(state, payload) {
		state.filterState.brigades.splice(0);
		state.filterState.brigades.push(...payload);
	},
	setStatus(state, payload) {
		state.filterState.status = payload;
	},
	setExecutorStatus(state, payload) {
		state.filterState.executorStatus = payload;
	},
	setTaskCategoryId(state, payload) {
		state.filterState.taskCategoryId = payload;
	},
	setOnlyExecutorTasks(state, payload) {
		state.filterState.onlyExecutorTasks = payload;
	},
	setLoaderState(state, payload) {
		state.loaderState = payload;
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
