
import Vue from 'vue';
import Vuex from 'vuex';

import dict from './modules/dictionary-store';
import dataTypes from './modules/datatypes-store';
import task from './modules/task-store';
import login from './modules/login-store';
import reports from './modules/reports/reports';
import history from './modules/history-store';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		dict,
		dataTypes,
		task,
		login,
		reports,
		history,
	},
	state: {
		version: '0.3',
		applicationName: 'Цифровая планёрка',
	},
	getters:
		{
			version: state => state.version,
		},
	mutations: {},
	actions: {},
});
