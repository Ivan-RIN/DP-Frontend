<template>
    <div class="task-list">
        <div style="display: flex;">
            <select v-model="blockId" @change="setBlockId(blockId); setBoardId(0); boardId = 0">
                <option
                    v-for="(block) in blocks"
                    :key="block.id"
                    :value="block.id"
                    :selected="block.id == blockId"
                >
                    {{ block.name }}
                </option>
            </select>
            <select v-model="boardId" style="margin-left: 5px;" @change="setBoardId(boardId)">
                <option :value="0" style="font-weight: bold;">Все задачи</option>
                <option
                    v-for="(board) in boards"
                    v-if="blockId == board.blockId"
                    :key="board.id"
                    :value="board.id"
                    :selected="board.id == boardId"
                >
                    {{ board.name }}
                </option>

            </select>
        </div>
        <div style="position: relative">
            <div class="type-states">
                <div style="padding: 2px 24px; font-weight: bold;">
                    Состояния:
                </div>
                <div style="display: flex;">
                    <div class="task-status" style="background-color: #FFFFFF; margin: 3px;"></div>
                    <div style="padding: 1px 8px;">Планируется</div>
                </div>
                <div style="display: flex;">
                    <div class="task-status" style="background-color: #E0E709; margin: 3px;"></div>
                    <div style="padding: 1px 8px;">В работе</div>
                </div>
                <div style="display: flex;">
                    <div class="task-status" style="background-color: #257A0D; margin: 3px;"></div>
                    <div style="padding: 1px 8px;">Выполнено</div>
                </div>
                <div style="display: flex;">
                    <div class="task-status" style="background-color: #D41717; margin: 3px;"></div>
                    <div style="padding: 1px 8px;">Просрочено</div>
                </div>
                <div style="display: flex;">
                    <div class="task-status" style="background-color: #F38F06; margin: 3px;"></div>
                    <div style="padding: 1px 8px;">Отменено</div>
                </div>
            </div>
        </div>
        <div class="line"></div>
        <div class="vm-task-list-header" style="background-color: #10548a; margin-bottom: 15px; border-radius: 5px;">
            <div class="row-col-1" style="cursor: pointer;"
                 @click="sortTasks('executionDate')"
            >
                Дата исполнения
            </div>
            <div class="row-col-2" style="cursor: pointer;"
                 @click="sortTasks('execution')"
            >
                Прогресс
            </div>
            <div class="row-col-3" style="cursor: pointer;"
                 @click="sortStringTasks('name')"
            >
                Задачи
            </div>
            <div class="row-col-4" style="cursor: pointer;"
                 @click="sortTasks('initiatorId')"
            >
                Инициатор
            </div>
            <div class="row-col-5" style="cursor: pointer;"
                 @click="sortTasks('executorId')"
            >
                Исполнитель
            </div>
            <div class="row-col-6" style="cursor: pointer;"
                 @click="sortTasks('createDate')"
            >
                Дата создания
            </div>
        </div>
        <div style="position: relative;"
             v-for="board in boards"
             :key="board.id"
             v-if="blockId == board.blockId && (!boardId || boardId == board.id)"
        >
            <div style="height: 33px;"></div>
            <div style="padding: 8px 8px 8px 8px; font-weight: bold; background-color: #0d304b; min-width: 170px; text-align: center;
            position: absolute; top: 0px; display: inline-block; border-radius: 10px 10px 0 0; text-decoration: underline;">
                {{ board.name }}
            </div>
            <div style="display: flex; position: absolute; right: 0px; top: -2px; gap: 5px;">
                <add-task-button
                    :title="'Загрузить Отчет'"
                    :action="downloadBoardReport"
                    :data="board"
                >
                </add-task-button>
                <add-task-button
                    v-if="getAccessAddTask(board)"
                    :title="'Добавить Задачу'"
                    :action="openAddTaskForm"
                    :data="board"
                >
                </add-task-button>
            </div>
            <div class="vm-task-list-content-background" style="margin-bottom: 20px;">
                <template v-if="board.tasks.length > 0">
                    <div class="vm-task-list-content"
                         v-for="task in board.tasks"
                         :key="task.id"
                         @click="openViewTask(board, task)">
                        <div class="row-col-1" :style="{ color: overdueDateColor(task.state, task.executionDate) }">
                            {{ convertDate(task.endDate) }}
                        </div>
                        <div class="row-col-2">
                            {{ task.progress }}%
                        </div>
                        <div class="row-col-3" style="text-align: left; display: flex; align-items: center;">
                            <div style="width: 24px;">
							<img v-if="task.id == task.mainTaskId" src="@/assets/icons/home_house.png" width="18" style="position: relative; top: 2px;">
<!--							<img v-if="task.countChilds" src="@/assets/icons/structure.png" width="16">-->
<!--                            <img v-if="task.mainTaskId" src="@/assets/icons/structure.png" width="16">-->
                            </div>
                            <div style="width: 24px; text-align: center;">
<!--                                <img v-if="task.state == 6" src="@/assets/icons/performed.png" width="20">-->
                                <img v-if="task.priority == 5 && task.state == 5" src="@/assets/icons/fire.png" width="24">
                                <div v-else class="task-miniboard-status" :style="{ background: 'conic-gradient(' + getColorStatus(task) + ', transparent 0)'}"></div>
                            </div>
                            <div style="padding-left: 10px;">#{{ task.id }}. {{ task.name }}</div>
                        </div>
                        <div class="row-col-4">
                            {{ getShortUserName(task.initiatorId) }}
                        </div>
                        <div class="row-col-5">
                            {{ getShortUserName(task.executorId) }}
                        </div>
                        <div class="row-col-6">
                            {{ convertDate(task.createDate) }}
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="vm-task-list-content" style="padding: 10px 20px; font-weight: bold;">Список задач пуст
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>

import { mapState, mapMutations, mapGetters } from 'vuex';
import DpComboboxComponent from '../common/dp-combobox-component.vue';
import VMViewTask from '@/components/vm/task-view.vue';
import VMTaskActionComponent from '@/components/vm/task-action-component.vue';
import AddTaskForm from '@/components/vm/add-task-form';
import AddTaskButton from '@/components/vm/add-task-button';

export default {
    name: 'task-list-component',
    data() {
        return {
            sortFields: {
                executionDate: false,
                execution: false,
                name: false,
                author: false,
                executor: false,
                createDate: false
            },
            listDepartments: [],
            departmentParent: null,
            departmentCurrentId: 0,
            boardId: this.$store.state.vm.boardId,
            blockId: this.$store.state.vm.blockId,
        };
    },
    components: {
        'vm-task-action-component': VMTaskActionComponent,
        DpComboboxComponent,
        VMViewTask,
        AddTaskForm,
        AddTaskButton
    },
    props: {
        tasks: {
            type: Object
        },
        boards: {
            type: Array
        },
        openViewTask: {
            type: Function
        },
        buttonAction: {
            type: Function
        }
    },
    mixins: [],
    computed: {
        ...mapState('vm', ['currentUser', 'users', 'departments', 'boardBlocks', 'blocks', 'boardUsers']),
    },
    watch: {},
    methods: {

        ...mapMutations('vm', ['setBlockId', 'setBoardId']),

        init() {

            if (this.blocks.length) return;

            for (let boardId in this.boards) {

                let board = this.boards[boardId];
                let block = this.boardBlocks[board.blockId];

                if (block) {
                    let add = true;
                    for (let item of this.blocks) if (item.id == block.id) add = false;
                    if (add) this.blocks.push(this.boardBlocks[board.blockId]);
                }

                if (!this.boardId && board.default) {
                    this.boardId = board.id;
                    this.blockId = board.blockId;

                }

                if (board.ownerId && board.ownerId == this.currentUser.id) {
                    this.boardId = board.id;
                    this.blockId = board.blockId;
                }
            }

            if (!this.blockId && this.blocks.length) {
                this.blockId = this.blocks[0].id;
            }

            this.setBlockId(this.boardId);
            this.setBoardId(this.blockId);

        },

        // Форма добавления задачи
        openAddTaskForm(board) {

            let options = {
                board: board,
                buttonAction: this.buttonAction,
                tasks: this.tasks
            };

            this.$modal.show(AddTaskForm, options, {
                height: 'auto',
                width: '800px',
                clickToClose: false,
            });
        },

        overdueDateColor(state, executionDate) {
            let date = new Date(executionDate);
            let current = new Date();
            current.setHours(0);
            current.setMinutes(0);
            current.setSeconds(0, 0);
            return state == 1 && current > date ? '#f00' : '#fff';
        },
        convertDate(date) {
            return date ? date.split('T')[0].split('-')
                .reverse()
                .join('.') : '';
        },
        getNameDepartment(id) {
            return this.departments[id].abbreviation;
        },
        hasParentDepartment(id) {
            return !!this.departments[id].parentId;
        },
        getNameParentDepartment(id) {
            const parentId = this.departments[id].parentId;
            if (!parentId) return 'Отсутствует';
            return this.departments[parentId].abbreviation;
        },
        getShortUserName(userId) {
            if (!userId) return '';
            let user = this.users[userId];
            let fio = user.name.split(' ');
            if (fio.length == 2) return fio[0] + ' ' + fio[1][0] + '.';
            if (fio.length > 2) return fio[0] + ' ' + fio[1][0] + '.' + fio[2][0] + '.';
            return user.name;
        },
        sortStringTasks(field) {
            this.sortFields[field] = !this.sortFields[field];
            for (let id in this.tasks) {
                let tasks = this.tasks[id];
                if (this.sortFields[field]) {
                    tasks.sort((a, b) => a[field].toLowerCase() > b[field].toLowerCase() ? -1 : 1);
                } else {
                    tasks.sort((a, b) => a[field].toLowerCase() > b[field].toLowerCase() ? 1 : -1);
                }
            }
        },
        sortTasks(field) {
            this.sortFields[field] = !this.sortFields[field];
            for (let id in this.tasks) {
                let tasks = this.tasks[id];
                if (this.sortFields[field]) {
                    tasks.sort((a, b) => a[field] > b[field] ? -1 : 1);
                } else {
                    tasks.sort((a, b) => a[field] > b[field] ? 1 : -1);
                }
            }
        },
        downloadBoardReport(board) {
            window.location.href = '/dtm/Tasks/getReportBoard/' + board.id;
        },
        getAccessAddTask(board) {
            if (this.currentUser.access.isDeveloper || this.currentUser.access.isAdministrator) return true;
            if (board.ownerId && this.currentUser.id == board.ownerId) return true;
            if (this.boardUsers[board.id] && this.boardUsers[board.id] > 1) return true;
            return false;
        },
        getColorStatus(task) {

            if (task.state == 5) return  '#257A0D 0 ' + task.progress + '%, #E0E709 0 100%';

            let color ='#';
            if (task.state == 1) color += 'FFFFFF';   // Планируется
            else if (task.state == 5) color += 'E0E709';   // В работе
            else if (task.state == 6) color += '257A0D';   // Выполнено, Завершено
            else if (task.state == 7) color += 'D41717';   // Просрочено
            else if (task.state == 8) color += 'F38F06';   // Отменено
            else color += '0493FC';
            return color + ' 100%';
        }
    },
    mounted() {
        this.init();
    }
};

</script>

<style scoped lang="scss">
@import "../../assets/styles/main";

.filter {
    display: flex;
    flex-direction: row;
    justify-content: left;
}

input {
    font-size: 14px;
}

input.CDNG {
    width: 155px;
    height: 25px;
    //outline: none;
}

input.Object {
    width: 90px;
    height: 25px;
    //outline: none;
}

input.Author {
    width: 102px;
    height: 25px;
    //outline: none;
}

input.Executor {
    width: 140px;
    height: 25px;
    //outline: none;
}

.vm-task-list {

    &-header {
        display: flex;
        flex-wrap: nowrap;
        flex-direction: row;
        min-height: 40px;
        padding: 10px 10px 10px 10px;
        border-bottom: solid 2px $app-background-color;
        font-weight: bold;
    }

    &-content-background {
        background-color: #0d304b;
    }

    &-content:hover {
        background-color: #0c395a;
    }

    &-content {
        display: flex;
        flex-wrap: nowrap;
        flex-direction: row;
        min-height: 40px;
        padding: 10px 10px 10px 10px;
        border-bottom: solid 1px $line-color;
        border-right: solid 1px $line-color;
        margin: 0px 0;
        cursor: pointer;
    }

}

.task-miniboard-status {
    position: relative;
    left: 8px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 1px solid #fff;
}

.task-list {
    a {
        cursor: pointer;
    }

    &-data-header {
        display: flex;
        flex-wrap: nowrap;
        flex-direction: row;
        //justify-content: space-between;
        padding: 0 $default-margin;

        div[data-col='1'] {
            flex: 0 0 160px;
            text-align: center;
        }

        div[data-col='2'] {
            flex: 0 0 40px;
            padding: 0 0 0 5px;

            input {
                border: none;
                padding: 0;
                height: 20px;
                cursor: pointer;
            }
        }

        .facilityField {
            flex: 0 0 90px;
            text-align: center;
        }

        .drill-site-field {
            flex: 0 0 160px;
            text-align: center;
        }

        .author-field {
            width: 110px;
            padding-left: 4px;
            text-align: center;
        }
    }

    &-content {
        position: relative;

        a {
            color: $text-color-03;
            text-decoration: underline;
        }

        &-brigade {
            position: relative;
            background-color: $content-background-color;
            border-radius: 5px;
            min-height: 40px;
            margin: 10px 0;

            div[data-brigade-name] {
                position: absolute;
                top: 5px;
                left: -120px;
                width: 120px;
            }

            &-category {
                min-height: 40px;
                padding: 10px 10px 10px 20px;
                border-bottom: solid 2px $app-background-color;

                input {
                    border: none;
                    padding: 0;
                    height: 20px;
                    cursor: pointer;
                }

                > div[data-name] {
                    width: 160px;
                    float: left;
                }

                > div[data-values] {

                    margin-left: 160px;

                    .task-list-content-brigade-category-task {
                        border-bottom: solid 1px $line-color;
                        padding: 5px 0 5px 0;
                        display: flex;
                        flex-direction: column;

                        &-container {
                            display: flex;

                            div[data-col='2'] {
                                position: relative;
                                flex: 0 0 40px;
                                padding: 0 0 0 5px;

                                .cover-input {
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    height: 20px;
                                    width: 20px;
                                    z-index: 5;
                                }
                            }

                            div[data-col='3'] {
                                position: relative;
                                flex: 0 0 70px;
                                text-align: center;
                                padding-top: 1px;

                                div[data-status] {
                                    position: absolute;
                                    top: 4px;
                                    border-radius: 50%;
                                    width: 12px;
                                    height: 12px;
                                    background-color: white;
                                }
                            }

                            div[data-col='4'] {
                                flex: 0 0 500px;

                                > div[data-task-name] {
                                    cursor: pointer;
                                }

                                > div[data-task-comment] {
                                    span {
                                        color: $text-color-02
                                    }
                                }
                            }

                            div[data-col='5'] {
                                flex: 0 0 130px;
                                cursor: pointer;
                            }

                            .facilityField {
                                flex: 0 0 90px;
                            }

                            .drill-site-field-data {
                                flex: 0 0 160px;
                            }

                            .author-field {
                                flex: 0 0 110px;
                            }

                            .load-pdf-icon {
                                min-width: 35px;
                                max-width: 35px;
                                height: 35px;

                                img {
                                    position: relative;
                                    top: 5px;
                                    cursor: pointer;
                                }
                            }

                            .history-button {
                                width: 40px;
                                height: 40px;
                                cursor: pointer;

                                &-open {
                                    margin: 5px 0 0 10px;
                                }

                                &-close {
                                    margin: 5px 0 0 10px;
                                }
                            }
                        }
                    }

                    .task-list-content-brigade-category-task:last-child {
                        border-bottom: none;
                    }
                }

            }

            &-category:last-child {
                border-bottom: none;
            }
        }
    }
}

.row-col-1 {
    flex: 0 0 150px;
    text-align: center;
}

.row-col-2 {
    flex: 0 0 100px;
    text-align: center;
}

.row-col-3 {
    flex: 0 0 670px;
    text-align: center;
}

.row-col-4 {
    flex: 0 0 160px;
    text-align: center;
}

.row-col-5 {
    flex: 0 0 160px;
    text-align: center;
}

.row-col-6 {
    flex: 0 0 100px;
    text-align: center;
}

.type-states {
    position: absolute;
    border: 1px solid #ffffff;
    background-color: #10548A;
    padding: 5px 10px;
    left: -160px;
    top: 40px;
    width: 140px;
}

.task-status {
    width: 12px;
    height: 12px;
    border-radius: 100%;
    background-color: #ffffff;
    border: 1px solid #fff;
}

</style>
