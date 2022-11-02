<template>
    <div class="tasks-view">
        <loading-mask-component v-if="loaderState"/>
        <div class="tasks-view-header">
            <div class="tasks-view-header-name">ЗАДАЧИ ВУЭ</div>
        </div>

        <div style="display: flex">
            <button
                :style="{backgroundColor: activeComponent == 'task-list' ? '#0c79cd' : ''}"
                @click="activeComponent = 'task-list'">
                Задачи
            </button>
            <button
                :style="{backgroundColor: activeComponent == 'task-my-list' ? '#0c79cd' : ''}"
                @click="activeComponent = 'task-my-list'">
                 Мои Задачи
            </button>
            <button
                :style="{backgroundColor: activeComponent == 'list-users' ? '#0c79cd' : ''}"
                @click="activeComponent = 'list-users'">
                Резиденты
            </button>
			<div style="width: 100%;"></div>
			<button
				style="width: 200px;"
				@click="downloadReport()">
				Загрузить отчет
			</button>
        </div>

        <div v-show="!loaderState">
            <div class="line"></div>
            <component :is="activeComponent" v-if="isActive"
                       :tasks="tasks"
                       :task="task"
                       :users="users"
                       :openViewTask="openViewTask"
                       :buttonAction = modalButtonAction
            />
            <div v-else>
                <h3>
                    Ваша учетная запись не найдена или заблокирована!<br>
                    Для доступа в ВУЭ, Вам необходимо зарегистрировать вашу учетную запись.<br>
                    Для регистрации обратитесь к администрации ресурса.
                </h3>
            </div>
        </div>

    </div>
</template>

<script>

import { mapActions, mapState } from 'vuex';
import LoadingMaskComponent from '../common/loading-mask-component.vue';
import apiTasks from '../../api/VM_Tasks/vm-tasks';
//import VMTaskFilterComponent from '@/components/vm/task-filter-component.vue';
import TaskList from '@/components/vm/task-list.vue';
import TaskMyList from '@/components/vm/task-my-list.vue';
//import VMAddTaskForm from '@/components/vm/add-task-form.vue';
import TaskView from '@/components/vm/task-view.vue';
import ListUsers from '@/components/vm/list-users.vue';

export default {
    name: 'vm-tasks-view',
    components: {
        TaskList,
        TaskMyList,
        LoadingMaskComponent,
        TaskView,
        ListUsers
    },
    props: {},
    data() {
        return {
            tasks: {},
            task: {},
            taskDisabled: true,
            isActive: false,
            activeComponent: 'task-list'
        };
    },
    watch: {},
    computed: {
        ...mapState('task', ['filterState', 'loaderState']),
        ...mapState('vm', ['currentUser', 'users'])
    },
    methods: {
        ...mapActions('vm', ['loadAllVM', 'setRoles']),
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

            if (this.currentUser.access && this.currentUser.access.isActive) {

                const tasks = await apiTasks.getTasks(filter);
                this.tasks = this.sortTasks(tasks);

                this.checkSelectedTask(tasks);
                this.isActive = true;
            }

            this.setLoaderState(false);

        },

        openViewTask(task) {
            this.task = task;
            this.activeComponent = 'task-view';
        },

        closeViewTask() {
            this.activeComponent = 'task-list';
        },

        checkSelectedTask(tasks) {
            if (this.$route.params.taskId) {
                for (let task of tasks) {
                    if (task.id == this.$route.params.taskId) {
                        this.openViewTask(task);
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

		downloadReport() {
			window.location.href = '/dtm/Tasks/getReportTasks';
		},

    },
    mounted() {
        this.loadData(this.filterState);
    },
    created() {
        this.loadAllVM();
    },

};
</script>

<style scoped lang="scss">

@import "../../assets/styles/main";

button {
    min-width: 120px;
    background-color: #145a94;
    padding: 8px 16px;
    margin: 6px 2px;
}

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
