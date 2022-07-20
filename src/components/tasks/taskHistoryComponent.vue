<template>
    <div class="task-history">
        <template v-if="isOpened && history.length > 0">
            <div class="task-history-header">
                <div class="task-history-header-date">Дата изменения</div>
                <div class="task-history-header-editor">Автор изменений</div>
                <div class="task-history-header-properties">Измененные данные</div>
            </div>
            <div class="task-history-content" v-for="(change, changeIndex) in history" v-bind:key="changeIndex">
                <div class="task-history-content-date">{{ change.date }}</div>
                <div class="task-history-content-editor">{{ change.editor }}</div>
                <div class="task-history-content-properties">
                    <div class="task-history-content-properties-container"
                         v-for="(item, itemIndex) in change.changes"
                         v-bind:key="itemIndex">
                        <div class="task-history-content-properties-container-title">{{item.title}}
                        </div>
                        <div class="task-history-content-properties-container-value"
                             v-html="item.value"></div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>

	import { mapGetters } from 'vuex';
    import apiTasks from '../../api/Tasks/tasks';
	import Task from '../../mixins/task-history-classes/task';

	export default {
		name: 'task-history-component',
        props: {
	        taskId: { type: Number },
        },
		computed: {
			...mapGetters('dict', ['dictionariesData', 'taskStatus']),

		},
    watch: {
			isOpened(n) {
				if (n) {
					this.getHistory();
        }
      },
    },
		data() {
			return {
				history: [],
				isOpened: false,
        performanceCriterions: [],
			};
		},
		methods: {
			async getHistory() {
				const history = await apiTasks.getHistory({
          taskId: this.taskId,
        });
				const historyEdited = [];
				history.sort((a, b) => {
					const date1 = new Date(a.date);
					const date2 = new Date(b.date);
					return date2 - date1;
        });
				history.forEach((item) => {
					const task = new Task(item, this.dictionariesData, this.taskStatus);
					const result = task.getResult();
					historyEdited.push(result);
        });

				this.history = historyEdited;
				return this.history;
      },
      async toggleHistory() {
        // eslint-disable-next-line no-unused-vars
				let history;
        if (!this.isOpened) {
          history = await this.getHistory();
        }
				if (this.history.length > 0) {
					this.isOpened = !this.isOpened;

          if (this.history.length > 0) {
						this.$emit('isHistoryExist', this.taskId);
					}
        }
      },
		},
		async created() {
			this.performanceCriterions = this.dictionariesData.performanceCriterions;
		},
	};
</script>


<style lang="scss">
    @import "../../assets/styles/main";

    .task-history {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        background-color: #0E3E64;
        font-family: DIN-Pro-regular,serif;
        font-size: 12px;
        &-header {
            display: flex;
            flex-direction: row;
            align-items: center;
            height: 25px;
            margin: 10px 0 0 0;
            background-color: #255985;
            font-size: 11px;

            &-taskId {
                margin: 0 0 0 14px;
                min-width: 75px;
            }

            &-date {
                min-width: 177px;
                margin: 0 0 0 14px;
            }
            &-editor {
                min-width: 330px;
            }
            &-properties {
                display: flex;
                flex-direction: column;
            }
        }
        &-content {
            display: flex;
            flex-direction: row;
            border-bottom: 1px solid #255985;
            color: #A8BDCE;
            padding: 8px 0 9px 0;

            &-taskId {
                margin: 0 0 0 14px;
                min-width: 75px;
            }
            &-date {
                min-width: 177px;
                margin: 0 0 0 14px;
            }
            &-editor {
                min-width: 150px;
            }
            &-properties {
                display: flex;
                flex-direction: column;
                &-container {
                    display: flex;
                    flex-direction: row;

                    &-title {
                        text-align: right;
                        min-width: 170px;
                        margin-right: 10px;
                        font-weight: bold;
                    }

                    &-value {
                        position: relative;
                        display: flex;
                        flex-direction: row;
                        width: 750px;
                    }
                }
            }
            &-nochanges {
                margin: 0 0 0 160px;
            }
            .status {
                position: relative;
                top: 2px;
                margin-right: 5px;
                border-radius: 50%;
                width: 12px;
                height: 12px;
                background-color: white;
            }
        }
    }
</style>
