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
<!--            <button-->
<!--                :style="{backgroundColor: activeComponent == 'task-my-list' ? '#0c79cd' : ''}"-->
<!--                @click="activeComponent = 'task-my-list'">-->
<!--                 Мои Задачи-->
<!--            </button>-->
			<button
				:style="{backgroundColor: activeComponent == 'list-boards' ? '#0c79cd' : ''}"
				@click="activeComponent = 'list-boards'">
				Доски ВУ
			</button>
<!--			<button-->
<!--				:style="{backgroundColor: activeComponent == 'subtask-scheme' ? '#0c79cd' : ''}"-->
<!--				@click="activeComponent = 'subtask-scheme'">-->
<!--				Схема-->
<!--			</button>-->
            <button
                :style="{backgroundColor: activeComponent == 'list-users' ? '#0c79cd' : ''}"
                @click="activeComponent = 'list-users'">
                Резиденты
            </button>
			<div style="width: 100%;"></div>
        </div>

        <div v-show="!loaderState">
            <div class="line"></div>
            <component :is="activeComponent" v-if="isActive"
                       :tasks="tasks"
                       :boards="boards"
                       :board="board"
                       :task="task"
                       :users="users"
                       :openViewTask="openViewTask"
					   :openViewBoard="openViewBoard"
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

import { mapActions, mapState, mapMutations } from 'vuex';
import LoadingMaskComponent from '../common/loading-mask-component.vue';
import api from '@/api/baseAPI';
import TaskList from '@/components/vm/task-list.vue';
import TaskMyList from '@/components/vm/task-my-list.vue';
import TaskView from '@/components/vm/task-view.vue';
import ListUsers from '@/components/vm/list-users.vue';
import ListBoards from '@/components/vm/list-boards.vue';
import BoardView from '@/components/vm/board-view.vue';
import SubtaskScheme from '@/components/vm/subtask-scheme.vue';

export default {
    name: 'vm-tasks-view',
    components: {
        TaskList,
        TaskMyList,
        LoadingMaskComponent,
        TaskView,
        ListUsers,
		ListBoards,
		BoardView,
		SubtaskScheme
    },
    props: {},
    data() {
        return {
	        board: null,
	        boards: [],
            tasks: {},
            task: {},
            taskDisabled: true,
            isActive: false,
            activeComponent: 'task-list'
        };
    },
    watch: {},
    computed: {
        ...mapState('task', ['loaderState']),
        ...mapState('vm', ['currentUser', 'users', 'boardBlocks'])
    },
    methods: {
        ...mapActions('vm', ['loadAllVM', 'setRoles']),
        ...mapActions('task', ['setLoaderState']),
        ...mapMutations('vm', ['setBoards']),
	    async modalButtonAction(buttonName, task) {
            if (buttonName === 'createTask') {
	            await this.loadData();
                if (task) {
	                this.openViewTaskBy(task.id);
                } else {
                  this.activeComponent = 'task-list';
                }
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
        async loadData() {

            this.setLoaderState(true);

            if (this.currentUser.access && this.currentUser.access.isActive) {
                this.boards = await api.get('Loader/getBoards');
	            for (let boardId in this.boards) {
		            let board = this.boards[boardId];
		            let block = this.boardBlocks[board.blockId];
		            if (block) board.block = block;
		            for (let i in board.tasks) {
						let task = board.tasks[i];
						this.tasks[task.id] = task;
					}
	            }
	            this.setBoards(this.boards);
                this.checkSelectedTask();
                this.isActive = true;
            }

            this.setLoaderState(false);

        },

        openViewTask(board, task) {
	        this.board = board;
            this.task = task;
            this.activeComponent = 'task-view';
        },

		openViewBoard(board) {
			this.board = board;
			this.activeComponent = 'board-view';
		},

        closeViewTask() {
            this.activeComponent = 'task-list';
        },

		showStructure(taskId) {
            for (let board of this.boards) {
                for (let task of board.tasks) {
                    if (task.id == taskId) {
                        this.task = task;
                        break;
                    }
                }
            }
			this.activeComponent = 'subtask-scheme';
		},

        checkSelectedTask() {
            if (this.$route.params.taskId) {
	            this.openViewTaskBy(this.$route.params.taskId);
            }
        },

	    openViewTaskBy(id) {
		    for (let board of this.boards) {
			    for (let task of board.tasks) {
				    if (task.id == id) {
					    this.openViewTask(board, task);
					    break;
				    }
			    }
		    }
	    },

        async removeTask(task) {
            this.closeViewTask();
	        this.setLoaderState(true);
	        let res = await api.delete('Tasks/' + task.id);
            this.loadData();
	        this.setLoaderState(false);
        },

    },
    mounted() {
    },
    created() {
    	const self = this;
        this.loadAllVM(function () {
	        self.loadData();
        });
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
