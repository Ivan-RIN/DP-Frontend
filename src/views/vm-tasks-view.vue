<template>
    <div class="tasks-view">
        <loading-mask-component v-if="loaderState"/>
        <div class="tasks-view-header">
            <div class="tasks-view-header-name">ЗАДАЧИ ВУЭ</div>
        </div>
        <vm-task-action-component
            v-show="user.isModerator"
            @add="openAddTaskForm()"
        />
        <template>
            <div class="line"></div>
            <task-list-component :tasks="tasks" :openViewTask="openViewTask" v-if="taskDisabled"/>
            <task-view :task="task" v-else />
        </template>
    </div>
</template>

<script>

    import { mapActions, mapState } from 'vuex';
    import LoadingMaskComponent from '../components/common/loading-mask-component.vue';
    import apiTasks from '../api/VM_Tasks/vm-tasks';
    import VMTaskActionComponent from '../components/vm/task-action-component.vue';
    import VMTaskFilterComponent from '../components/vm/task-filter-component.vue';
    import TaskListComponent from '../components/vm/task-list-component.vue';
    import VMAddTaskForm from '../components/vm/add-task-form.vue';
    import VMViewTask from '@/components/vm/task-view.vue';

    export default {
        name: 'vm-tasks-view',
        components: {
            VMTaskFilterComponent,
            TaskListComponent,
            LoadingMaskComponent,
            'vm-task-action-component': VMTaskActionComponent,
            'vm-add-task-form': VMAddTaskForm,
            'task-view': VMViewTask
        },
        props: {},
        data() {
            return {
                user: {
                    isModerator: false
                },
                tasks: {},
                task: {},
                taskDisabled: true
            };
        },
        watch: {},
        computed: {
            ...mapState('task', ['filterState', 'loaderState']),
            ...mapState('vm', ['currentUserId', 'users']),
        },
        methods: {
            ...mapActions('vm', ['loadAllVM']),
            ...mapActions('task', ['setLoaderState']),

            async getTasksHistory() {
                const history = await apiTasks.getHistory({
                    dateFrom: this.filterState.dateFrom,
                    dateTo: this.filterState.dateTo,
                });
            },

            modalButtonAction(buttonName) {
                if (buttonName === 'save') {
                    this.loadData(this.filterState);
                }
            },

            // Форма добавления задачи
            openAddTaskForm(options) {

                let optionsNew = {};

                if (options) {
                    optionsNew = options;
                }

                optionsNew.buttonAction = this.modalButtonAction;
                optionsNew.tasks = this.tasks;

                this.$modal.show(VMAddTaskForm, optionsNew, {
                    height: 'auto',
                    width: '800px',
                    clickToClose: false,
                });
            },

            // Сортировка задач
            sortTasks(tasks, key = 'subdivision') {
                const field = 'executionDate';
                tasks.sort((a, b) => a[field] > b[field] ? -1 : 1);
                tasks.sort((a, b) => a[key] > b[key] ? 1 : -1);
                let newList = {};
                for (let task of tasks) {
                    if (!newList[task.departmentId]) newList[task.departmentId] = [];
                    newList[task.departmentId].push(task);
                }
                return newList;
            },

            // Загрузка задач
            async loadData(filter) {
                this.setLoaderState(true);
                await this.getTasksHistory();
                const tasks = await apiTasks.getTasks(filter);
                this.tasks = this.sortTasks(tasks);
                this.user = this.users[this.currentUserId];
                this.setLoaderState(false);
                this.checkSelectedTask(tasks);
            },

            openViewTask(task) {
                this.task = task;
                this.taskDisabled = false;
            },

            checkSelectedTask(tasks) {
                if (this.$route.params.taskId) {
                    for (let task of tasks) {
                        if (task.id == this.$route.params.taskId) {
                            this.task = task;
                            this.taskDisabled = false;
                            break;
                        }
                    }
                }
            },

            async removeTask(task) {
                this.closeViewTask();
                apiTasks.delete(task.id);
                this.loadData(this.filterState);
            },

            closeViewTask() {
                this.taskDisabled = true;
            }

        },
        mounted() {
            this.loadData(this.filterState);
            console.log(this.$route.params.taskId);

        },
        created() {
            //this.loadAllDict();
            this.loadAllVM();
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
