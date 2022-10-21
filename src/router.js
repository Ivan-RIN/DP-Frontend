import Vue from 'vue';
import Router from 'vue-router';
import Tasks from './views/tasks-view.vue';
import History from './views/history-view.vue';
import Report from './views/report-view.vue';
import EventLog from './views/event-log-view.vue';
import VmTasks from './components/vm/home.vue';

Vue.use(Router);

export default new Router({
	mode: 'history',
	// base: process.env.BASE_URL,
	// base: 'http://localhost:5000/',
	routes: [
		{
			path: '/',
			name: 'tasks',
			component: Tasks,
		},
		{
			path: '/calendar',
			name: 'calendar',
			component: Tasks,
			props: { calendarView: true },
		},
		{
			path: '/report',
			name: 'report',
			component: Report,
		},
		{
			path: '/dictionary/:dictId',
			name: 'dictionary',
			component: () => import(/* webpackChunkName: "about" */ './views/dictionary-view.vue'),
		},
		{
			path: '/history',
			name: 'history',
			component: History,
		},
		{
			path: '/event-log',
			name: 'event-log',
			component: EventLog,
		},
		{
			path: '/vm',
			name: 'vm-tasks',
			component: VmTasks
		},
		{
			path: '/vm/:taskId',
			name: 'vm-tasks',
			component: VmTasks
		}
	],
});
