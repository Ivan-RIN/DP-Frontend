<template>
    <div class="tasks-view">
        <loading-mask-component v-if="loaderState"/>
        <div class="tasks-view-header">
            <div class="tasks-view-header-name">ЗАДАЧИ ВУЭ</div>
        </div>
        <vm-task-action-component
                @add="openAddTaskForm()"
                @mytaskcoos="openMyTaskCoos()"
        />
        <template>
            <div class="line"></div>
            <vm-task-list-component
                :taskList="taskList"
                :subdivisions="dictionariesData.subdivisions"
                :userProfiles="dictionariesData.userProfiles"
            />
        </template>
    </div>
</template>

<script>

    import { mapActions, mapState } from 'vuex';
    import apiGroupTaskWork from '../api/GroupTaskWork/groupTaskWork';
    import TaskOperatorFilterComponent from '../components/tasks/taskOperatorFilterComponent.vue';
    import TaskActionComponent from '../components/tasks/task-action-component.vue';
    import TaskDownloadXls from '../components/tasks/task-download-xls.vue';
    import CalendarComponent from '../components/calendar/calendar-component.vue';
    import globalMethods from '../mixins/global-methods';
    import LoadingMaskComponent from '../components/common/loading-mask-component.vue';
    import apiTasks from '../api/VMTasks/vm-tasks';
    import VMTaskActionComponent from '../components/tasks/vm-task-action-component.vue';
    import VMTaskFilterComponent from '../components/tasks/vm-task-filter-component.vue';
    import VMTaskListComponent from '../components/tasks/vm-task-list-component.vue';
    import VMAddTaskForm from '../components/tasks/vm-add-task-form.vue';

    export default {
        name: 'vm-tasks-view',
        components: {
            TaskActionComponent,
            VMTaskFilterComponent,
            'vm-task-list-component': VMTaskListComponent,
            CalendarComponent,
            TaskDownloadXls,
            LoadingMaskComponent,
            TaskOperatorFilterComponent,
            'vm-task-action-component': VMTaskActionComponent,
            'vm-add-task-form': VMAddTaskForm
        },
        props: {},
        data() {
            return {
                isHistoryAvailable: [],
                taskList: {}
            };
        },
        watch: {},
        computed: {
            ...mapState('task', ['filterState', 'loaderState']),
            ...mapState('dict', ['dictionariesData'])
        },
        methods: {
            ...mapActions('dict', ['loadAllDict']),
            ...mapActions('task', ['setDefaultFilterState', 'setDefaultOperatorFilter', 'setLoaderState']),

            async getTasksHistory() {
                const history = await apiTasks.getHistory({
                    dateFrom: this.filterState.dateFrom,
                    dateTo: this.filterState.dateTo,
                });
                // history.forEach((item) => {
                //     if (!this.isEmpty(item)) {
                //         this.isHistoryAvailable[`task${ item }`] = true;
                //     }
                // });
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

            // Форма добавления задачи
            openAddTaskForm(options) {

                let optionsNew = {};

                if (options) {
                    optionsNew = options;
                }

                optionsNew.buttonAction = this.modalButtonAction;

                this.$modal.show(VMAddTaskForm, optionsNew, {
                    height: 'auto',
                    width: '800px',
                    clickToClose: false,
                });
            },

            // openEditTask(editTask) {
            //     this.$modal.show(addTaskForm, {
            //         editTask,
            //         buttonAction: this.modalButtonAction,
            //     }, {
            //         height: 'auto',
            //         width: '800px',
            //         clickToClose: false,
            //     });
            // },

            // Сортировка задач
            sortTasks(tasks, key = 'subdivision') {
                const field = 'executionDate';
                tasks.sort((a, b) => a[field] > b[field] ? -1 : 1);
                tasks.sort((a, b) => a[key] > b[key] ? 1 : -1);
                let newList = {};
                for (let task of tasks) {
                    if (!newList[task.subdivision]) newList[task.subdivision] = [];
                    newList[task.subdivision].push(task);
                }
                return newList;
            },

            // Загрузка задач
            async loadData(filter) {

                this.setLoaderState(true);
                await this.getTasksHistory();
                const tasks = await apiTasks.getTasks(filter);

                for (let id in tasks) {
                    let task = tasks[id];
                    for (let user of this.dictionariesData.userProfiles) {
                        if (task.authorLogin == user.login) {
                            task.author = user.name;
                            break;
                        }
                        task.author = '';
                    }
                }

                this.taskList = this.sortTasks(tasks);
                this.setLoaderState(false);
            },

        },
        mounted() {
            this.loadData(this.filterState);
        },
        created() {
            this.loadAllDict();
        },

    };
</script>

<style scoped lang="scss">
    @import "../assets/styles/main";

    .tasks-view {
        padding-top: $default-margin;

        &-header {
            display: flex;
            justify-content: space-between;

            &-name {
                padding-left: 20px;
            }

            &-radioButtons {
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
                    box-shadow: 0 0.1em 0.3em rgba(0, 0, 0, 0.3);
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
