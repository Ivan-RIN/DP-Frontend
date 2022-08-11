import api from '../../api/dictionaries-api';
import apiFacilities from '../../api/Facilities/facilities';

import brigadeDescription from './dictionaries-description/brigades';
import departmentDescription from './dictionaries-description/departments';
import blockEquipments from './dictionaries-description/blockEquipments';
import facilities from './dictionaries-description/facilities';
import mechanism from './dictionaries-description/mechanism';
import performanceCriterions from './dictionaries-description/performanceCriterions';
import performanceCriterionsTypes from './dictionaries-description/performanceCriterionsTypes';
import roles from './dictionaries-description/roles';
import SOPs from './dictionaries-description/SOPs';
import taskCategories from './dictionaries-description/taskCategories';
import userProfiles from './dictionaries-description/userProfiles';
import revolvingFonds from './dictionaries-description/revolvingFonds';
import posts from './dictionaries-description/posts';
import operators from './dictionaries-description/operators';
import userActions from './dictionaries-description/userActions';
import subdivision from './dictionaries-description/subdivisions';

const state = {
	dictionaryList: [
		{
			id: 'blockEquipments',
			name: 'Блочное оборудование',
			isVisible: true,
			isActive: true,
			componentName: 'base-dictionary-component',
			description: blockEquipments,
		}, {
			id: 'brigades',
			name: 'Бригады',
			isVisible: true,
			isActive: true,
			componentName: 'base-dictionary-component',
			description: brigadeDescription,
		}, {
			id: 'taskCategories',
			name: 'Категории',
			isVisible: true,
			isActive: true,
			componentName: 'base-dictionary-component',
			description: taskCategories,
		}, {
			id: 'performanceCriterions',
			name: 'Критерии исполнения',
			isVisible: true,
			isActive: true,
			componentName: 'base-dictionary-component',
			description: performanceCriterions,
		}, {
			id: 'performanceCriterionsTypes',
			name: 'Типы Критериев исполнения',
			isVisible: true,
			isActive: true,
			componentName: 'base-dictionary-component',
			description: performanceCriterionsTypes,
		}, {
			id: 'revolvingFonds',
			name: 'Оборотный фонд',
			isVisible: true,
			isActive: true,
			componentName: 'base-dictionary-component',
			description: revolvingFonds,
		}, {
			id: 'departments',
			name: 'Организационная структура',
			isVisible: true,
			isActive: true,
			componentName: 'base-dictionary-component',
			description: departmentDescription,
		}, {
			id: 'userProfiles',
			name: 'Пользователи',
			isVisible: true,
			isActive: true,
			componentName: 'base-dictionary-component',
			description: userProfiles,
		}, {
			id: 'unknown1',
			name: 'Приоритеты',
			isVisible: false,
			isActive: false,
			componentName: '',
		}, {
			id: 'roles',
			name: 'Роли',
			isVisible: true,
			isActive: true,
			componentName: 'base-dictionary-component',
			description: roles,
		}, {
			id: 'unknown2',
			name: 'Смены',
			isVisible: false,
			isActive: false,
			componentName: '',
		}, {
			id: 'SOPs',
			name: 'СОП',
			isVisible: true,
			isActive: true,
			componentName: 'base-dictionary-component',
			description: SOPs,
		}, {
			id: 'unknown3',
			name: 'Статусы',
			isVisible: false,
			isActive: false,
			componentName: '',
		}, {
			id: 'unknown4',
			name: 'Статусы СОП',
			isVisible: false,
			isActive: false,
			componentName: '',
		}, {
			id: 'mechanism',
			name: 'Техника',
			isVisible: true,
			isActive: true,
			componentName: 'base-dictionary-component',
			description: mechanism,
		}, {
			id: 'facilities',
			name: 'Фонд скважин',
			isVisible: true,
			isActive: true,
			componentName: 'base-dictionary-component',
			description: facilities,
		}, {
			id: 'posts',
			name: 'Должности',
			isVisible: true,
			isActive: true,
			componentName: 'base-dictionary-component',
			description: posts,
		}, {
			id: 'operators',
			name: 'Операторы',
			isVisible: true,
			isActive: true,
			componentName: 'base-dictionary-component',
			description: operators,
		}, {
			id: 'operatorInBrigades',
			name: 'Операторы в бригадах',
			isVisible: false,
			isActive: true,
			componentName: 'base-dictionary-component',
			description: {
				apiAddress: 'operatorInBrigades',
			},
		}, {
			id: 'userActions',
			name: 'Действия пользователя',
			isVisible: true,
			isActive: true,
			componentName: 'base-dictionary-component',
			description: userActions,
		},
		{
			id: 'subdivisions',
			name: 'Структурное подразделения',
			isVisible: true,
			isActive: true,
			componentName: 'base-dictionary-component',
			description: subdivision,
		}
	],
	dictionariesData: {
		blockEquipments: [],
		brigades: [],
		taskCategories: [],
		performanceCriterions: [],
		performanceCriterionsTypes: [],
		revolvingFonds: [],
		departments: [],
		userProfiles: [],
		userActions: {},
		roles: [],
		SOPs: [],
		mechanism: [],
		facilities: [],
		posts: [],
		operators: [],
		operatorInBrigades: [],
		facilityDivided: {
			// well: [],
			wellCluster: [],
			productionFacility: [],
		},
		sopStatus: [{
			id: 0,
			name: 'СОП на стадии разработки',
			color: '#1f8ae0',
			calendarColor: '#63788a',
		}, {
			id: 1,
			name: 'СОП на согласовании в УДНГ',
			color: '#ffff00',
			calendarColor: '#e8e8b5',
		}, {
			id: 2,
			name: 'СОП утвержден',
			color: '#449d48',
			calendarColor: '#449d48',
		}],
		subdivisions: {},
	},
	facilityTypes: [{
		id: 0,
		name: 'productionFacility',
		description: 'Цех',
	}, {
		id: 1,
		name: 'wellCluster',
		description: 'Куст',
	}, // {
		// 	id: 2,
		// 	name: 'well',
		// 	description: 'Скважина',
		// },
	],
	taskStatus: [{
		id: 0,
		name: 'Запланированно',
		color: '#ffffff',
		calendarColor: '#f5f5f5',
	}, {
		id: 1,
		name: 'В работе',
		color: '#1f8ae0',
		calendarColor: '#63788a',
	}, {
		id: 2,
		name: 'На утверждении',
		color: '#ffff00',
		calendarColor: '#e8e8b5',
	}, {
		id: 3,
		name: 'Исполнено',
		color: '#449d48',
		calendarColor: '#449d48',
	}, {
		id: 4,
		name: 'Отклонено',
		color: '#ff0000',
		calendarColor: '#703d3d',
	}],
};

const getters = {
	dictionaryList: state => state.dictionaryList,
	dictionariesData: state => state.dictionariesData,
	taskStatus: state => state.taskStatus,
	brigadesAll: state => state.dictionariesData.brigades,
	brigadesActive: state => state.dictionariesData.brigades.filter(b => b.isactive == true),
};

const actions = {
	loadAllDict({ commit, state }) {
		if (state.dictionariesData.facilities.length > 0) return;
		state.dictionaryList.filter(e => e.isActive)
			.forEach(async (item) => {
				if (item && item.description && item.description.apiAddress) {
					const dictData = await api.get(item.description.apiAddress);
					commit(item.id, dictData);
				}
			});

		state.facilityTypes.forEach(async (item) => {
			const dividedFacilities = await apiFacilities.getByType(item.id);
			commit(item.name, dividedFacilities);
		});
	},
	async loadUserProfile({ commit, state }) {
		const dict = state.dictionaryList.find(e => e.id === 'userProfiles');
		const dictData = await api.get(dict.description.apiAddress);
		commit(dict.id, dictData);
	},
	async loadOperators({ commit, state }) {
		const dict = state.dictionaryList.find(e => e.id === 'operators');
		const dictData = await api.get(dict.description.apiAddress);
		commit(dict.id, dictData);
	},
};

const mutations = {
	blockEquipments(state, payload) {
		state.dictionariesData.blockEquipments.splice(0);
		state.dictionariesData.blockEquipments.push(...payload);
	},
	brigades(state, payload) {
		state.dictionariesData.brigades.splice(0);
		state.dictionariesData.brigades.push(...payload);
	},
	taskCategories(state, payload) {
		state.dictionariesData.taskCategories.splice(0);
		state.dictionariesData.taskCategories.push(...payload);
	},
	performanceCriterions(state, payload) {
		state.dictionariesData.performanceCriterions.splice(0);
		state.dictionariesData.performanceCriterions.push(...payload);
	},
	performanceCriterionsTypes(state, payload) {
		state.dictionariesData.performanceCriterionsTypes.splice(0);

		const keys = Object.keys(payload);
		const types = keys.map(item => ({
			id: item,
			name: payload[item],
		}));
		state.dictionariesData.performanceCriterionsTypes.push(...types);
	},
	revolvingFonds(state, payload) {
		state.dictionariesData.revolvingFonds.splice(0);
		state.dictionariesData.revolvingFonds.push(...payload);
	},
	departments(state, payload) {
		state.dictionariesData.departments.splice(0);
		state.dictionariesData.departments.push(...payload);
	},
	userProfiles(state, payload) {
		state.dictionariesData.userProfiles.splice(0);
		state.dictionariesData.userProfiles.push(...payload);
	},
	roles(state, payload) {
		state.dictionariesData.roles.splice(0);
		state.dictionariesData.roles.push(...payload);
	},
	SOPs(state, payload) {
		state.dictionariesData.SOPs.splice(0);
		const sorted = payload.sort((a, b) => {
			return a.number.localeCompare(b.number, 'ru');
		});
		state.dictionariesData.SOPs.push(...sorted);
	},
	mechanism(state, payload) {
		state.dictionariesData.mechanism.splice(0);
		state.dictionariesData.mechanism.push(...payload);
	},
	facilities(state, payload) {
		state.dictionariesData.facilities.splice(0);
		state.dictionariesData.facilities.push(...payload);
	},
	posts(state, payload) {
		state.dictionariesData.posts.splice(0);
		state.dictionariesData.posts.push(...payload);
	},
	userActions(state, payload) {
		state.dictionariesData.userActions = payload;
	},
	operators(state, payload) {
		state.dictionariesData.operators.splice(0);
		const sortedOperators = [...payload];
		sortedOperators.sort((a, b) => {
			return a.name.localeCompare(b.name);
		});
		state.dictionariesData.operators.push(...sortedOperators);
	},
	operatorInBrigades(state, payload) {
		state.dictionariesData.operatorInBrigades.splice(0);
		state.dictionariesData.operatorInBrigades.push(...payload);
	},
	productionFacility(state, payload) {
		state.dictionariesData.facilityDivided.productionFacility.splice(0);
		state.dictionariesData.facilityDivided.productionFacility.push(...payload);
	},
	wellCluster(state, payload) {
		state.dictionariesData.facilityDivided.wellCluster.splice(0);
		state.dictionariesData.facilityDivided.wellCluster.push(...payload);
	},
	well(state, payload) {
		state.dictionariesData.facilityDivided.well.splice(0);
		state.dictionariesData.facilityDivided.well.push(...payload);
	},
	subdivisions(state, payload) {
		for(let item of payload) {
			state.dictionariesData.subdivisions[item.id] = item;
		}
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
