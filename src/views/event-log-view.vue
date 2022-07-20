<template>
    <div class="history-view" v-if="this.$can('read', 'EventLog')">
        <loading-mask-component v-if="loadMask"/>
        <div class="history-view-title">Журнал истории задач</div>
        <TasksHistoryFilterComponent @filter="filter"/>
        <TaskHistoryContentComponent :taskHistory="taskHistory"/>
    </div>
</template>

<script>

	import { mapActions, mapGetters } from 'vuex';
	import TasksHistoryFilterComponent from '../components/history/tasksHistoryFilterComponent.vue';
	import apiHistory from '../api/History/history';
	import TaskHistoryContentComponent from '../components/history/taskHistoryContentComponent.vue';
	import LoadingMaskComponent from '../components/common/loading-mask-component.vue';
	import Task from '../mixins/task-history-classes/task';
	import UserProfile from '../mixins/task-history-classes/userProfile';
	import BlockEquipment from '../mixins/task-history-classes/blockEquipment';
	import Brigades from '../mixins/task-history-classes/brigades';
	import Operators from '../mixins/task-history-classes/operator';
	import Departments from '../mixins/task-history-classes/department';
	import PerformanceCriterion from '../mixins/task-history-classes/performanceCriterion';
	import Post from '../mixins/task-history-classes/post';
	import RevolvingFond from '../mixins/task-history-classes/revolvingFond';
	import SOP from '../mixins/task-history-classes/sop';
	import TaskCategory from '../mixins/task-history-classes/taskCategory';

	export default {
		name: 'history-view',
		components: { TaskHistoryContentComponent, TasksHistoryFilterComponent, LoadingMaskComponent },
		computed: {
			...mapGetters('dict', ['dictionariesData', 'taskStatus']),
			...mapGetters('history', ['historyFilterState']),
		},
		data() {
			return {
				loadMask: false,
				taskHistory: [],
			};
		},
		methods: {
			...mapActions('dict', ['loadAllDict']),
			async filter() {
				this.loadMask = true;
				const history = await apiHistory.get(this.historyFilterState);

				history.sort((a, b) => {
					const date1 = new Date(a.date);
					const date2 = new Date(b.date);
					return date2 - date1;
				});

				this.taskHistory = this.createChangesForView(history);
				this.loadMask = false;
			},
			createChangesForView(allChanges) {
				const history = [];

                allChanges.forEach((item) => {
                    if (item.objectType) {
		                if (item.objectType === 'Task') {
			                const task = new Task(item, this.dictionariesData, this.taskStatus);
			                const result = task.getResult();
			                history.push(result);
		                }
		                if (item.objectType === 'UserProfile') {
			                const task = new UserProfile(item, this.dictionariesData, this.taskStatus);
			                const result = task.getResult();
			                history.push(result);
		                }
	                    if (item.objectType === 'BlockEquipment') {
		                    const task = new BlockEquipment(item, this.dictionariesData, this.taskStatus);
		                    const result = task.getResult();
		                    history.push(result);
	                    }
	                    if (item.objectType === 'Brigade') {
		                    const task = new Brigades(item, this.dictionariesData, this.taskStatus);
		                    const result = task.getResult();
		                    history.push(result);
	                    }
	                    if (item.objectType === 'Operator') {
		                    const task = new Operators(item, this.dictionariesData, this.taskStatus);
		                    const result = task.getResult();
		                    history.push(result);
	                    }
	                    if (item.objectType === 'Department') {
		                    const task = new Departments(item, this.dictionariesData, this.taskStatus);
		                    const result = task.getResult();
		                    history.push(result);
	                    }
	                    if (item.objectType === 'PerformanceCriterion') {
		                    const task = new PerformanceCriterion(item, this.dictionariesData, this.taskStatus);
		                    const result = task.getResult();
		                    history.push(result);
	                    }
	                    if (item.objectType === 'Post') {
		                    const task = new Post(item, this.dictionariesData, this.taskStatus);
		                    const result = task.getResult();
		                    history.push(result);
	                    }
                        if (item.objectType === 'RevolvingFond') {
		                    const task = new RevolvingFond(item, this.dictionariesData, this.taskStatus);
		                    const result = task.getResult();
		                    history.push(result);
	                    }
	                    if (item.objectType === 'SOP') {
		                    const task = new SOP(item, this.dictionariesData, this.taskStatus);
		                    const result = task.getResult();
		                    history.push(result);
	                    }
	                    if (item.objectType === 'TaskCategory') {
		                    const task = new TaskCategory(item, this.dictionariesData, this.taskStatus);
		                    const result = task.getResult();
		                    history.push(result);
	                    }
	                }
                });
                return history;
			},
		},
		created() {
			this.loadAllDict();
		},
		mounted() {
			this.filter();
		},
	};
</script>


<style scoped lang="scss">
    @import "../assets/styles/main";

    .history-view {
        &-title {
            text-transform: uppercase;
            padding: 10px 0 0 20px;
        }
    }


</style>
