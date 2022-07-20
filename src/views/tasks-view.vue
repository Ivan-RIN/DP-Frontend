<template>
	<div class="tasks-view">
		<loading-mask-component v-if="loaderState"/>
		<div class="tasks-view-header">
			<div v-if="$can('read', 'Tasks')" class="tasks-view-header-name">ЗАДАЧИ</div>
			<div v-else class="tasks-view-header-name">ЗАДАЧИ&nbsp;(Рапорт)</div>
			<task-download-xls v-if="(!calendarView && $can('read', 'Tasks'))" class="task-download-xls"/>
			<div v-if="$can('read', 'Tasks')" class="tasks-view-header-radioButtons">
				<span>Список</span>
				<label class="toggle-button">
					<input type="checkbox" @click="changeView($event.target.checked)" :checked="calendarView"/>
					<div></div>
				</label>
				<span>Календарь</span>
			</div>
		</div>
		<template v-if="(calendarView && $can('read', 'Tasks'))">
			<calendar-component
				:events="calendarEvents"
				@showListFromCalendar="showListFromCalendar"
			/>
		</template>
		<template v-else>
			<task-filter-component
					v-if="$can('read', 'Tasks')"
					@filter="filterTask"
					@clearFilter="clearAllFilters"
			/>
			<TaskOperatorFilterComponent
					v-if="$can('read', 'Tasks/Report')"
					@filter="filterTask"
					@clearFilter="clearAllFilters"
			/>
			<task-action-component
					@add="openAddTaskForm()"
          @mytaskcoos="openMyTaskCoos()"
					@actionGroupApply="actionGroupApply($event)"
					@actionFilterByDateApply="actionFilterByDateApply($event)"
					v-model="filterValue"
			/>

			<div class="line"></div>
			<task-list-component
					:taskList="filtered.list"
					:taskListGroup="filtered.group"
					@openEditTask="openEditTask"
					@reloadlist="loadData(filterState)"
					:tasksHistory="isHistoryAvailable"
          v-model="filterValue"
          :clear = "clearTLCFilters"
			>
			</task-list-component>
		</template>
	</div>
</template>

<script>
	import { mapActions, mapState } from 'vuex';
	import apiGroupTaskWork from '../api/GroupTaskWork/groupTaskWork';
	import apiTasks from '../api/Tasks/tasks';
	import TaskFilterComponent from '../components/tasks/task-filter-component.vue';
	import TaskOperatorFilterComponent from '../components/tasks/taskOperatorFilterComponent.vue';
	import TaskActionComponent from '../components/tasks/task-action-component.vue';
	import TaskListComponent from '../components/tasks/task-list-component.vue';
  import addTaskForm from '../components/tasks/add-task-form.vue';
  import openMyTaskCoos from '../components/tasks/add-task-form.vue';                            // и это
  import TaskDownloadXls from '../components/tasks/task-download-xls.vue';
	import CalendarComponent from '../components/calendar/calendar-component.vue';
	import globalMethods from '../mixins/global-methods';
	import LoadingMaskComponent from '../components/common/loading-mask-component.vue';

	export default {
		name: 'tasks-view',
		components: {
		  TaskActionComponent,
			TaskFilterComponent,
			TaskListComponent,
			CalendarComponent,
			TaskDownloadXls,
			LoadingMaskComponent,
			TaskOperatorFilterComponent,
		},
		props: {
		    calendarView: { default: false },
		},
		mixins: [globalMethods],
		data() {
			return {
				isHistoryAvailable: [],
				taskList: [],
				taskListGroup: undefined,
				filtered: {
					list: [],
					group: [],
				},
				calendarEvents: [],
        calendarDate: undefined,
        filterValue: undefined,
        clearTLCFilters: 1,
      };
    },
    watch: {
      filterValue(n) {
        this.filterCurrentTaskList(n);
      },
    },
		computed: {
			...mapState('task', ['filterState', 'loaderState']),
		},
		methods: {
      ...mapActions('dict', ['loadAllDict']),
      ...mapActions('task', ['setDefaultFilterState',
                             'setDefaultOperatorFilter',
                             'setLoaderState']),
      async getTasksHistory() {
        const history = await apiTasks.getHistory({
          dateFrom: this.filterState.dateFrom,
          dateTo: this.filterState.dateTo,
        });
        history.forEach((item) => {
          // if (!this.isEmpty(item) && !this.isEmpty(item.objectId)) {
          //   this.isHistoryAvailable[`task${ item.objectId }`] = true;
          // }
          if (!this.isEmpty(item)) {
            this.isHistoryAvailable[`task${ item }`] = true;
          }
        });
      },
      modalButtonAction(buttonName) {
        if (buttonName === 'save') {
          if (this.$router.currentRoute.name === 'calendar') {
            this.getTasksForCalendar();
          } else {
            this.loadData(this.filterState);
          }
        }
      },
      openAddTaskForm(options) {
        let optionsNew = {};
        if (options) {
          optionsNew = options;
        }

        optionsNew.buttonAction = this.modalButtonAction;

        this.$modal.show(addTaskForm, optionsNew, {
          height: 'auto',
          width: '800px',
          clickToClose: false,
        });
      },
      openEditTask(editTask) {
        this.$modal.show(addTaskForm, {
          editTask,
          buttonAction: this.modalButtonAction,
        }, {
          height: 'auto',
          width: '800px',
          clickToClose: false,
        });
      },
      clearAllFilters() {
        this.calendarDate = undefined;
        this.loadData(this.filterState);
      },
      changeView() {
        const me = this;

        if (!me.calendarView) {
          me.$router.push('calendar');
          me.getTasksForCalendar();
        } else {
          me.$router.push({
            path: '/',
            name: 'tasks',
            params: {
              calendarView: false,
            },
          });
          me.loadData(me.filterState);
        }
      },
      getTasksForCalendar() {
        this.setLoaderState(true);
        const date = this.filterState.dateFrom.split('-');
        const year = date[0];
        const month = parseInt(date[1], 10);

        const filter = {
          brigades: this.filterState.brigades,
          dateFrom: new Date(year, month - 1, 2).toISOString().substring(0, 10),
          dateTo: new Date(year, month, 1).toISOString().substring(0, 10),
          status: this.filterState.status,
          executorStatus: this.filterState.executorStatus,
        };
        this.calendarEvents = [];
        this.createEventsForCalendar(filter);
      },
      async createEventsForCalendar(filter) {
        const taskList = await apiTasks.getTasks(filter);
        if (taskList.length > 0) {
          this.calendarEvents = taskList.map((item) => {
            let date;
            if (item.toDoDate) {
              date = item.toDoDate.substring(0, 10);
            } else {
              date = item.createDate.substring(0, 10);
            }
            return {
              name: item.name,
              details: item.comment,
              task: item,
              start: date,
              end: date,
              state: item.state,
            };
          });
        } else {
          this.calendarEvents = [];
        }
        this.setLoaderState(false);
      },
      async filterTask() {
        this.calendarDate = undefined;
        this.loadData(this.filterState);
      },
      async loadData(filter) {
        this.setLoaderState(true);
        this.clearTLCFilters++;
        await this.getTasksHistory();
        const taskList = await apiTasks.getTasks(filter);
        this.collectTasksInGroups(taskList);
        this.taskList = taskList;
        this.filtered.list = taskList;

        // ///////////////////////////////
        // TODO pagination with backend //
        // ///////////////////////////////
        this.filterCurrentTaskList(this.filterValue);
        this.actionFilterByDateApply('2');
      },
      collectTasksInGroups(list) {
        const taskListGroup = [];

        list.forEach((e) => {
          if (e.createDate) {
            let date;
            if (e.toDoDate) {
              date = e.toDoDate;
            } else {
              date = e.createDate;
            }
            const d = this.truncDateString(date);

            let dg = taskListGroup.find(item => item.id === d);
            if (!dg) {
              dg = { id: d, brigades: [] };
              taskListGroup.push(dg);
            }
            const brigId = e.brigadeId ? e.brigadeId : -999;
            let bg = dg.brigades.find(item => item.id === brigId);
            if (!bg) {
              const brig = (e.brigade) ? e.brigade : { name: 'Нет Бригады' };
              bg = {
                id: brigId,
                brigade: brig,
                values: [],
              };
              dg.brigades.push(bg);
            }
            let tcg = bg.values.find(item => item.id === e.taskCategoryId);
            if (!tcg) {
              tcg = {
                id: e.taskCategoryId,
                taskCategory: e.taskCategory,
                values: [],
              };
              bg.values.push(tcg);
            }
            tcg.values.push(e);
            e.isCheck = false;
          }
        });

        this.taskListGroup = taskListGroup;
        this.setLoaderState(false);
        this.filtered.group = taskListGroup;
      },
      truncDateString(date) {
        const ds = date.substring(0, 10).split('-');

        return `${ds[2]}.${ds[1]}.${ds[0]}`;
      },
      showListFromCalendar() {
        const me = this;

        const filter = {
          brigades: [],
          dateFrom: me.filterState.dateFrom,
          dateTo: me.filterState.dateTo,
          status: undefined,
          executorStatus: false,
        };

        me.$router.push({ path: '/' });

        me.loadData(filter);
      },
      monthFirstDay(d) {
        d.setDate(1);
        return d;
      },
      async actionGroupApply(action) {
        const taskId = this.taskList.filter(t => t.isCheck).map(t => t.id);
        // eslint-disable-next-line no-unused-vars
        const result = await apiGroupTaskWork.setGroupStatus(action, taskId);
        await this.loadData(this.filterState);
      },
      actionFilterByDateApply(action) {
        if (action === '1') {
          this.filtered.group = this.filtered.group.sort((a, b) => {
            const first = a.id.toString().split('.').reverse().join('.');
            const second = b.id.toString().split('.').reverse().join('.');

            return new Date(first) - new Date(second);
          });
        } else {
          this.filtered.group = this.filtered.group.sort((a, b) => {
            const first = a.id.toString().split('.').reverse().join('.');
            const second = b.id.toString().split('.').reverse().join('.');

            return new Date(second) - new Date(first);
          });
        }
      },
      filterCurrentTaskList(searchItem) {
        if (searchItem && searchItem.length >= 2) {
          const input = this.taskList.map(item => item);
          let collectionId = '';
            // Check is input Object or Array, if not stop the function and show in console warn message.
            // eslint-disable-next-line no-nested-ternary
          const array = this.isObject(input) ? this.isArray(input) ? input : [] : Object.values(input);
          const newInputCollection = [];

          if (array.length <= 0) {
            console.warn('Wrong data type');
            return;
            }
          for (let i = 0, len = array.length; i < len; i++) {
            const arrayItem = array[i];

            if (this.isObject(arrayItem)) {
              // eslint-disable-next-line no-prototype-builtins
              if (arrayItem.hasOwnProperty('id')) {
                const itemContent = Object.values(arrayItem);

                while (itemContent.length !== 0) {
                  const currItem = itemContent.shift();

                  if (this.isObject(currItem) || this.isArray(currItem)) {
                    const itemsToAdd = this.isArray(currItem) ? currItem : Object.values(currItem);
                    itemContent.push(...itemsToAdd);
                  }

                  if (currItem
                      && currItem.toString().toLowerCase().indexOf(searchItem.toLowerCase()) > -1
                      && collectionId.indexOf(arrayItem.id) < 0) {
                    collectionId += `${arrayItem.id},`;
                    newInputCollection.push(arrayItem);
                    break;
                  }
                }
              }
            } else {
              console.log('Wrong item data type');
              console.log(array[i]);
            }
          }
          this.collectTasksInGroups(newInputCollection);
          this.actionFilterByDateApply(2);
        } else {
          this.collectTasksInGroups(this.taskList);
          this.actionFilterByDateApply(2);
        }
      },
    },
		mounted() {
		    this.loadData(this.filterState);
		},
		created() {
			if (this.$can('read', 'Tasks')) {
				this.setDefaultFilterState();
			} else {
				this.setDefaultOperatorFilter();
			}
			this.loadAllDict();
		},

	};
</script>

<style scoped lang="scss">
	@import "../assets/styles/main";

	.tasks-view
	{
		padding-top: $default-margin;

		&-header {
			display: flex;
			justify-content: space-between;

			&-name {
				padding-left: 20px;
			}

			&-radioButtons{
				display: flex;
				align-items: center;
				justify-content: space-around;
				position: relative;
				min-width: 185px;
				.toggle-button input {
				  position: absolute;
				  opacity: 0;
				}

				.toggle-button {
				  display: inline-block;
				  font-size: 20px; /* 1 */
				  width: 2em;
				  background: #0d304b;
				  border-radius: 1em;
				  border: 1px solid #10548a;
				}

				.toggle-button div {
					height: 19px;
					width: 19px;
					border-radius: 1em;
					background-color: #2296f3;
					box-shadow: 0 0.1em 0.3em rgba(0,0,0,0.3);
					-webkit-transition: all 300ms;
					-moz-transition: all 300ms;
					transition: all 300ms;
				}

				.toggle-button input:checked + div {
					background-color: #2296f3;
				  -webkit-transform: translate3d(100%, 0, 0);
				     -moz-transform: translate3d(100%, 0, 0);
				          transform: translate3d(100%, 0, 0);
				}
			}
		}
	}

</style>
