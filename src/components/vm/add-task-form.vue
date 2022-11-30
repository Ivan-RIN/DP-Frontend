<template>
    <div>
        <dp-modal>
            <template slot="header">Добавить задачу</template>
            <template slot="body">
                <div style="padding: 10px; font-weight: bold;"> {{ board.block.name }} / {{ board.name }}</div>
                <div class="add-task-content-data">
                    <div class="add-task-content-data-textarea">
                        <label for="add-task-content-data-textarea-task-name" data-name>
                            Название задачи:
                            <span class="requiredField">*</span>
                        </label>
                        <textarea id="add-task-content-data-textarea-task-name"
                                  class="add-task-content-data-textarea-task" v-model="task.name">
						</textarea>
                    </div>
                </div>
                <div class="add-task-content-data">
                    <div class="add-task-content-data-textarea">
                        <label for="add-task-content-data-textarea-task" data-name>Описание задачи:<span
                            class="requiredField">*</span></label>
                        <textarea id="add-task-content-data-textarea-task"
                                  style="height: 100px;"
                                  v-model="task.description">
						</textarea>
                    </div>
                </div>

                <div class="add-task-content-data">
                    <div class="add-task-content-data-field" data-field>
                        <div data-name>Приоритет:<span class="requiredField">*</span></div>
                        <div class="add-task-content-data-field-priority">
                            <select v-model="task.priority" style="margin-left: 5px; width: 180px;">
                                <option :value="1">Низкий</option>
                                <option :value="2" selected>Обычный</option>
                                <option :value="3">Средний</option>
                                <option :value="4">Высокий</option>
                                <option :value="5">Критический</option>
                            </select>
                        </div>
                        <div style="margin-right: 30px;"></div>
                        <div data-name>Дата выполнения:<span class="requiredField">*</span></div>
                        <div data-value>
                            <date-picker-component
                                :attachQuery="false"
                                v-model="task.endDate"
                                :date="task.endDate.substr(0, 10)"
                                :minDate="dateTo"
                            />
                        </div>
                    </div>
                </div>

                <div class="add-task-content-data">
                    <div class="add-task-content-data-field" data-field>
                        <div data-name>Структурное подразделение:<span class="requiredField">*</span></div>
                        <div style="display: flex;">
                            <select style="margin-left: 5px;" @change="setDepartmentId($event.target.value)">
                                <option :value="0" style="font-weight: bold;">Все пользователи</option>
                                <option
                                    v-for="(root) in rootDepartments"
                                    :key="root.id"
                                    :value="root.id"
                                    :selected="selectedDepartment(0, root)"
                                >
                                    {{ root.abbreviation }}
                                </option>
                            </select>
                            <template v-for="(department, index) in currentDepartments" v-if="department.childs.length">
                                <select style="margin-left: 5px;" @change="setDepartmentId($event.target.value)">
                                    <option :value="department.id" style="font-weight: bold;">Все</option>
                                    <option
                                        v-for="(dep) in department.childs"
                                        :key="dep.id"
                                        :value="dep.id"
                                        :selected="selectedDepartment(index + 1, dep)"
                                    >
                                        {{ dep.abbreviation }}
                                    </option>
                                </select>
                            </template>
                        </div>
                    </div>
                </div>

                <div class="add-task-content-data">
                    <div class="add-task-content-data-field" data-field>
                        <div data-name>Ответственный:<span class="requiredField">*</span></div>
                        <div data-value>
                            <input style="width: 250px;"
                                   type="text" v-model="userName"
                                   @input="inputValue($event.target.value)"
                                   @focus="visibleListExecutor=true"
                                   @click="visibleListExecutor=true"
                            >
                            <div v-show="visibleListExecutor"
                                 @mouseleave="visibleListExecutor=false"
                                 style="position: absolute; top: 34px; overflow: hidden;
                                background-color: rgba(0,0,0,0.9); border: 1px solid #010177"
                            >
                                <div if v-if="filteredList.length > 0"
                                     style="overflow-x: hidden; overflow-y: auto; width: 250px; max-height: 120px;">
                                    <div
                                        class="add-task-content-data-list-users"
                                        style="padding: 4px; font-size: 12px; white-space: nowrap;"
                                        v-for="(user, index) in filteredList"
                                        v-bind:key="index"
                                        @click="setExecutorId(user.id)"
                                        @mouseover=""
                                    >
                                        {{ user.name }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style="padding: 10px; cursor: pointer; white-space: nowrap;">
                            <span @click="resetUserName" style="">Очистить поле</span>
                        </div>
                    </div>
                </div>
                <div style="height: 120px;"></div>

            </template>
        </dp-modal>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import DpCombobox from '@/components/vm/dp-combobox.vue';
import globalMethods from '@/mixins/global-methods';
import api from '@/api/baseAPI';
import DatePickerComponent from '../common/date-picker-component.vue';
import PerformanceCriterionsComponent from '../tasks/performanceCriterionsComponent.vue';
import LoadingMaskComponent from '../common/loading-mask-component.vue';
import DpModal from '@/components/vm/dp-modal';
import ListMailUsers from '@/components/vm/list-mail-users';

export default {
    name: 'add-task-form',
    components: {
        'dp-modal': DpModal,
        DpCombobox,
        DatePickerComponent,
        PerformanceCriterionsComponent,
        LoadingMaskComponent,
        ListMailUsers
    },
    mixins: [globalMethods],
    props: ['buttonAction', 'board', '_task'],
    data() {
        return {
            task: {
                boardId: 0,
                name: '',
                description: '',
                priority: 2,
                departmentId: 0,
                initiatorId: 0,
                executorId: 0,
                endDate: new Date().toISOString(),
            },
            //abbreviation: 'abbreviation',
            visibleListExecutor: false,
            userName: '',
            dateTo: new Date().toISOString()
                .substr(0, 10),
            //departmentParent: null,
            //departmentCurrentId: 0,
            currentDepartment: null,
            currentDepartments: []
        };
    },
    watch: {},
    computed: {
        ...mapState('vm', ['currentUser', 'users', 'listUsers', 'departments', 'listDepartments', 'rootDepartments']),
        filteredList() {
            let list = [];
            let users = this.currentDepartment ? this.currentDepartment.users : this.listUsers;
            for (let id in users) {
                let user = users[id];
                if (user.name.toUpperCase()
                    .indexOf(this.userName.toUpperCase()) >= 0) {
                    list.push(user);
                }
            }
            if (!list.length) this.visibleListExecutor = false;
            return list;
        },
    },
    methods: {
        ...mapActions('task', ['setLoaderState']),

        init() {
            this.task.boardId = this.board.id;
            this.task.initiatorId = this.currentUser.id;
            if (this._task) {
                this.task = this._task;
                this.userName = this.getUserName(this.task.executorId);
            }
        },

        getUserName(id) {
            return this.users[id] ? this.users[id].name : 'Не известный';
        },

        // Проверить поля задачи
        validateTaskFields() {

            let title = '';
            let message = '';
            let isError = false;

            if (!this.task.description) {
                title = 'Ошибка';
                message = 'Поле "Задача" обязательно к заполнению';
                isError = true;
            }

            if (!this.task.executorId) {
                title = 'Ошибка';
                message = 'Поле "Ответственный" обязательно к заполнению';
                isError = true;
            }

            if (!this.task.name) {
                title = 'Ошибка';
                message = 'Поле "Название" обязательно к заполнению';
                isError = true;
            }

            if (isError) {
                this.$root.showModalError({
                    'errorMessage': {
                        title,
                        message,
                    },
                });
                return false;
            }
            return true;
        },

        // Ввести имя ответственного
        inputValue(value) {
            this.visibleListExecutor = true;
            this.userName = value;
            this.task.executorId = 0;
        },

        resetUserName() {
            this.userName = '';
            this.task.executorId = 0;
            this.visibleListExecutor = false;
        },

        // Выберите имя исполнителя
        setExecutorId(id) {
            this.userName = this.users[id].name;
            this.task.executorId = id;
            this.task.departmentId = this.users[id].departmentId;
            this.visibleListExecutor = false;
        },

        setUserCurrentDepartment() {
            let dep = this.departments[this.currentUser.departmentId];
            this.currentDepartment = dep;
            this.currentDepartments.unshift(dep);
            while (dep.parentId) {
                dep = this.departments[dep.parentId];
                this.currentDepartments.unshift(dep);
            }
        },

        selectedDepartment(index, department) {
            if (index < this.currentDepartments.length) {
                return this.currentDepartments[index].id == department.id;
            }
            return false;
        },

        setDepartmentId(id) {
            this.currentDepartment = null;
            this.currentDepartments.length = 0;
            if (!id) return;
            if (this.departments[id]) {
                let dep = this.departments[id];
                this.currentDepartment = dep;
                while (dep) {
                    this.currentDepartments.unshift(dep);
                    if (dep.parentId) {
                        dep = this.departments[dep.parentId];
                    } else {
                        dep = null;
                    }
                }
            }
        },

        // Сохранить
        async 'save'() {

            if (!this.validateTaskFields()) {
                return;
            }

            const self = this;
            let task;

            self.setLoaderState(true);

            if (self._task) {
                task = await api.put('Tasks/editTask/' + self.task.id, self.task);
            } else {
                task = await api.post('Tasks/createTask', self.task);
            }

            if (task.errorMessage) {
                self.$root.showModalError(task);
            } else {
                if (this.buttonAction) {
                    this.buttonAction('createTask', task);
                }
                self.$emit('close');
            }

            self.setLoaderState(false);

            if (!self._task && !task.errorMessage) {
                self.sendMailPost(task);
            }

        },

        sendMailPost(task) {
            let self = this;
            this.$modal.show(ListMailUsers,
                {
                    task: task
                },
                {
                    height: 'auto',
                    width: '600px',
                    clickToClose: false
                },
                {
                    async send(users) {

                        let recipients = [];

                        for (let userId of users) {
                            recipients.push({
                                taskId: task.id,
                                userId: userId,
                                mailId: 1
                            });
                        }

                        await api.post('Tasks/SendTaskMail', recipients);

                    }
                }
            );
        },

    },

    mounted() {
        this.init();
        this.setUserCurrentDepartment();
    },
    created() {
        this.$on('save', () => {
            this.save();
        });
    },
};
</script>

<style lang="scss">
@import "../../assets/styles/main";

.add-task {
    position: relative;
    width: 100%;
    /*max-height: 80vh;*/
    background-color: $form-background-color;
    color: $text-color-01;
    z-index: 1000;
    overflow: auto;

    .requiredField {
        color: red;
    }

    //add-task-content-data-textarea-task
    &-header {
        margin: 0 $default-margin;
        border-bottom: solid 1px $line-color;
        position: relative;
        top: 0;
        left: 0;
        right: 0;

        span {
            text-transform: uppercase;
        }

        &-close {
            position: absolute;
            top: $default-margin;
            cursor: pointer;
        }

        button {
            @extend %button;
            margin: 0 30px;
        }
    }

    &-content {
        position: relative;
        margin: 80px $default-margin;
        max-height: 90%;
        overflow: hidden;

        &-data {
            display: flex;

            .disabled-select {
                position: absolute;
                width: 100%;
                height: 30px;
                top: 0;
                left: 0;
                background-color: rgba(255, 255, 255, 0.2);
            }

            &-field {
                div[data-value] {
                    position: relative;
                }

                &-from {
                    flex: 0 0 200px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;

                    .date-picker {
                        margin-left: 0;

                        .v-input__slot {
                            background-color: #16334c !important;
                            width: 185px;
                        }
                    }

                    &.specialWidth {
                        margin-left: 10px;

                        .date-picker {
                            margin-left: 0;

                            .v-input__slot {
                                background-color: #16334c !important;
                                width: 120px;
                            }
                        }
                    }

                    .name-field {
                        flex: 0 0 174px;
                        padding: 0 10px;

                        &-specialWidth {
                            flex: 0 0 90px;
                        }
                    }

                }

                &-to {
                    display: flex;
                    flex-direction: row;
                    flex: 0 0 40px;
                    flex-wrap: nowrap;
                    align-items: center;

                    div[data-name] {
                        flex: 0 0 50px;
                        text-align: right;
                        padding: 0 10px;
                    }

                    label[data-name] {
                        flex: 0 0 50px;
                        text-align: right;
                        padding: 0 10px;
                    }

                    .date-picker {
                        margin-left: 0;

                        .v-input__slot {
                            background-color: #16334c !important;
                            width: 120px;
                        }
                    }
                }

                &-priority {
                    position: relative;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    justify-content: flex-start;
                    align-items: center;

                    label {
                        margin: 0 15px 0 15px;
                    }
                }
            }

            &-list-users:hover {
                background-color: #0f426b;
            }
        }

        &-data.border {
            border: solid 1px $line-color;
            border-bottom: none;
            padding-top: 5px;
        }

        &-data-periodic {
            position: relative;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            border: solid 1px $line-color;
            border-top: none;
            padding-bottom: 5px;
            margin-bottom: 10px;

            &-field-checkAll {
                display: flex;
                flex-direction: row;
                justify-content: flex-end;
                align-items: center;
                width: 355px;

                input {
                    margin-left: 10px;
                }
            }

            &-field-dates {
                width: 750px;
                display: flex;
                justify-content: space-between;
                padding-left: 5px;

                &.interval {
                    span:first-child {
                        padding-right: 15px;
                    }

                    span:last-child {
                        padding-left: 15px;
                    }
                }

                &.week {
                    justify-content: space-around;
                }

                &-week {
                    display: flex;
                    flex-direction: row;
                    align-items: center;

                    label {
                        margin-right: 5px;
                    }

                    input {
                        margin-right: 5px;
                    }
                }

                &-day {
                    width: 50px !important;
                }

                &-month {
                    display: flex;
                    flex-direction: row;
                    align-items: center;

                    label {
                        margin-right: 5px;
                    }

                    input {
                        margin-right: 10px;
                    }
                }

                & .year {
                    flex-wrap: wrap;

                    .monthDays {
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        padding-top: 5px;

                        & .day {
                            border: 1px solid #ffffff;
                            padding: 2px 4px;

                            input {
                                position: absolute;
                                opacity: 0;
                            }

                            &.filled {
                                background-color: #a8aeb4;
                                color: #0f426b;
                            }
                        }
                    }
                }
            }
        }

        &-data-textarea {
            width: 100%;
            display: flex;
            padding: 0 0 10px 10px;

            &-task {
                height: 140px;
            }

            label[data-name] {
                width: 107px;
                margin-top: 20px;
            }

            textarea {
                width: 84%;
                /*margin-left: 25px;*/
                margin-top: 20px;
            }

        }
    }

    &-footer {
        padding: 20px;
        display: flex;
        position: absolute;
        bottom: 0;

        div[data-save] {
            @extend %button;
        }

        div[data-close] {
            color: $text-color-02;
            padding: 5px 10px;
            margin-left: 20px;
            cursor: pointer;
        }
    }
}

div[data-field] {
    display: flex;
    flex: 0 0 355px;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    margin: 5px 0;

    div[data-name] {
        flex: 0 0 175px;
        padding: 0 10px;
    }

    label[data-name] {
        flex: 0 0 150px;
        padding: 0 10px;
    }

    div[data-value] {
        flex: 0 0 185px;

        input {
            width: 100%;
        }

        select {
            width: 100%;
        }
    }
}

</style>
