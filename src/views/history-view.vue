<template>
    <div class="history-view" v-if="$can('read', 'ChangeHistory')">
        <loading-mask-component v-if="loadMask"/>
        <div class="history-view-title">Журнал истории задач</div>
        <TasksHistoryFilterComponent @filter="filter"/>
        <TaskHistoryContentComponent :taskHistory="taskHistory"/>
    </div>
</template>

<script>

	import { mapActions, mapGetters } from 'vuex';
	import TasksHistoryFilterComponent from '../components/history/tasksHistoryFilterComponent.vue';
	import TaskHistoryContentComponent from '../components/history/taskHistoryContentComponent.vue';
	import LoadingMaskComponent from '../components/common/loading-mask-component.vue';
	import Task from '../mixins/task-history-classes/task';
	import apiHistory from '../api/History/history';

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
					if (item.objectType && item.objectType === 'Task') {
						const task = new Task(item, this.dictionariesData, this.taskStatus);
						const result = task.getResult();
						history.push(result);
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
