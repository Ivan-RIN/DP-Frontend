<template>
    <div>
        <dp-modal>
            <template slot="header">Добавить задачу</template>
            <template slot="body">
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
                    <div class="add-task-content-data-field" data-field>
                        <div data-name>Приоритет:<span class="requiredField">*</span></div>
                        <div class="add-task-content-data-field-priority">
                            <input id="add-task-content-data-field-priority-critical" type="radio"
                                   v-model="task.priority" :value="1">
                            <label for="add-task-content-data-field-priority-critical">
                                Критичные&nbsp;(первоочередные)</label>
                            <input id="add-task-content-data-field-priority-typical" type="radio"
                                   v-model="task.priority" :value="2">
                            <label for="add-task-content-data-field-priority-typical">
                                Некритичные</label>
                        </div>
                    </div>
                </div>

                <div class="add-task-content-data">
                    <div class="add-task-content-data-field" data-field>
                        <div data-name>Структурное подразделение:<span class="requiredField">*</span></div>
                        <div data-value>
                            <dp-combobox-component
                                :options="listDepartments"
                                :isDisabled="!!editTask"
                                text-field="fullName"
                                v-model="task.departmentId"/>
                        </div>
                        <div data-name>Тип:<span class="requiredField">*</span></div>
                        <div data-value>
                            <dp-combobox-component
                                :options="[]"
                                :isDisabled="true"/>
                        </div>
                    </div>
                </div>

                <div class="add-task-content-data">
                    <div class="add-task-content-data-field" data-field>
                        <div data-name>Ответственный:<span class="requiredField">*</span></div>
                        <div data-value>
                            <input type="text" v-model="userName"
                                   @input="inputValue($event.target.value)"
                                   @focus="visibleListExecutor=true"
                                   @click="visibleListExecutor=true"
                                   @blur1="visibleListExecutor=false"
                            >
                            <div v-show="visibleListExecutor"
                                 @mouseleave="visibleListExecutor=false"
                                 style="
                                position: absolute; top: 34px; overflow: hidden;
                                background-color: rgba(0,0,0,0.9); border: 1px solid #010177"
                            >
                                <div style="overflow-x: hidden; overflow-y: auto; width: 200px; max-height: 180px;">
                                    <div
                                        class="add-task-content-data-list-users"
                                        style="padding: 4px; font-size: 12px; white-space: nowrap;"
                                        v-for="(user, index) in filteredList"
                                        v-bind:key="index"
                                        @click="setExecutorId(user.id)"
                                        @mouseover=""
                                    >{{ user.name }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div data-name>Дата выполнения:<span class="requiredField">*</span></div>
                        <div data-value>
                            <date-picker-component
                                :attachQuery="false"
                                v-model="task.executionDate"
                                :date="task.executionDate.substr(0, 10)"
                                :minDate="dateTo"
                            />
                        </div>
                    </div>
                </div>

                <div class="add-task-content-data">
                    <div class="add-task-content-data-textarea">
                        <label for="add-task-content-data-textarea-task" data-name>Описание задачи:<span
                            class="requiredField">*</span></label>
                        <textarea id="add-task-content-data-textarea-task"
                                  style="height: 240px;"
                                  v-model="task.description">
						</textarea>
                    </div>
                </div>
            </template>
        </dp-modal>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import DpComboboxComponent from '../common/dp-combobox-component.vue';
import globalMethods from '@/mixins/global-methods';
import apiTasks from '@/api/VM_Tasks/vm-tasks';
import DatePickerComponent from '../common/date-picker-component.vue';
import PerformanceCriterionsComponent from '../tasks/performanceCriterionsComponent.vue';
import LoadingMaskComponent from '../common/loading-mask-component.vue';
import DpModal from '@/components/vm/dp-modal'

export default {
    name: 'vm-add-task-form',
    components: {
        'dp-modal': DpModal,
        DpComboboxComponent,
        DatePickerComponent,
        PerformanceCriterionsComponent,
        LoadingMaskComponent,
    },
    mixins: [globalMethods],
    props: ['editTask', 'buttonAction', 'tasks'],
    data() {
        return {
            ...mapState('vm', ['userId']),
            task: {
                initiatorId: 0,
                name: '',
                priority: 1,
                departmentId: 0,
                executorId: 0,
                executionDate: new Date().toISOString(),
                description: ''
            },
            visibleListExecutor: false,
            userName: '',
            dateTo: new Date().toISOString().substr(0, 10),

        };
    },
    watch: {
    },
    computed: {
        ...mapState('vm', ['currentUserId', 'users', 'departments', 'listDepartments']),
        filteredList() {
            //let list = this.dictionariesData.operators.filter(e => ((this.userName) ? (e.name.toUpperCase().indexOf(this.userName.toUpperCase()) >= 0) : true));
            let list = [];
            for (let id in this.users) {
                let user = this.users[id];
                if (user.name.toUpperCase().indexOf(this.userName.toUpperCase()) >= 0) list.push(user);
            }
            if (!list.length) this.visibleListExecutor = false;
            return list;
        },
    },
    methods:
        {
            getUserName(id) {
                if (!this.users[id]) return 'Не известный';
                return this.users[id].name;
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

                if (!this.task.departmentId) {
                    title = 'Ошибка';
                    message = 'Выберите: "Структурное подразделение"';
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

            // Сохранить
            async 'save'() {

                if (!this.validateTaskFields()) {
                    return;
                }

                const self = this;
                let response;

                if (self.editTask) {
                    response = await apiTasks.put(self.task.id, self.task);
                } else {
                    delete self.task.id;
                    response = await apiTasks.post(self.task);
                }

                if (response.errorMessage) {
                    self.$root.showModalError(response);
                } else {
                    if (this.buttonAction) this.buttonAction('save');
                    self.$emit('close');

                    // if (!this.tasks[response.departmentId]) {
                    //     this.tasks[response.departmentId] = [];
                    // }
                    // this.tasks[response.departmentId].push(response);

                }

            },

            // Ввести имя ответственного
            inputValue(value) {
                this.visibleListExecutor = true;
                this.userName = value;
                this.task.executorId = 0;
            },

            // Выберите имя исполнителя
            setExecutorId(id) {
                this.userName = this.users[id].name;
                this.task.executorId = id;
                this.task.departmentId = this.users[id].departmentId;
                this.visibleListExecutor = false;
            }
        },

    mounted() {
        this.task.initiatorId = this.currentUserId;
        if (this.editTask) {
            this.task = this.editTask;
            this.userName = this.getUserName(this.task.executorId);
        }
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
                margin-left: 25px;
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
