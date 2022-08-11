<template>
    <div>
        <div class="add-task">
            <div class="add-task-header">
                <span>Обзор / Доска задачи</span>
                <div class="add-task-header-close" @click="$parent.closeViewTask()"></div>
            </div>
            <div class="add-task-content">
                <div class="body-row">
                    <div>Номер задачи / ID</div>
                    <div>#{{ task.id }}</div>
                </div>
                <div class="body-row">
                    <div>Статус</div>
                    <div>{{ getState(task.state) }}</div>
                </div>
                <div class="body-row">
                    <div>Задача</div>
                    <div style="padding: 10px; background-color: #0d304b;">{{ task.name }}</div>
                </div>
                <div class="body-row">
                    <div>Описание</div>
                    <div style="padding: 10px; background-color: #0d304b;">{{ task.description }}</div>
                </div>
                <div class="body-row">
                    <div>Инициатор &#8658; Исполнитель</div>
                    <div style="display: flex; gap: 20px;">
                        <div style="display: flex; gap: 20px; padding: 20px; width: 50%; background-color: #0d304b;">
                            <div>
                                <div class="profile-foto">
                                    <img :src="getFoto(task.initiatorId)" @error="errorFoto=true"/>
                                </div>
                            </div>
                            <div>
                                <div style="font-weight: bold;">{{ getUserName(task.initiatorId) }}</div>
                                <div>{{ getUserTitle(task.initiatorId) }}</div>
                                <div>{{ getUserDepartment(task.initiatorId) }}</div>
                                <div><span v-html="getUseMail(task.initiatorId)"></span></div>
                                <div>
                                    <span v-show="initiator.telephone">Тел.: {{ initiator.telephone }}</span>
                                    <span v-show="initiator.telephone && initiator.mobile">,&nbsp;</span>
                                    <span v-show="initiator.mobile">Сот.: {{ initiator.mobile }}</span>
                                </div>
                            </div>
                        </div>
                        <div style="display: flex; gap: 20px; padding: 20px; width: 50%; background-color: #0d304b;">
                            <div>
                                <div class="profile-foto">
                                    <img :src="getFoto(task.executorId)" @error="errorFoto=true"/>
                                </div>
                            </div>
                            <div>
                                <div style="font-weight: bold;">{{ getUserName(task.executorId) }}</div>
                                <div>{{ getUserTitle(task.executorId) }}</div>
                                <div>{{ getUserDepartment(task.executorId) }}</div>
                                <div><span v-html="getUseMail(task.executorId)"></span></div>
                                <div>
                                    <span v-show="executor.telephone">Тел.: {{ executor.telephone }}</span>
                                    <span v-show="executor.telephone && executor.mobile">,&nbsp;</span>
                                    <span v-show="executor.mobile">Сот.: {{ executor.mobile }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="body-row">
                    <div>Срок выполнения</div>
                    <div>{{ convertDate(task.createDate) }} - {{ convertDate(task.executionDate) }}</div>
                </div>
                <div class="body-row">
                    <div>Приоритет</div>
                    <div>{{ getPriority(task.priority) }}</div>
                </div>
                <div class="body-row">
                    <div>Прогресс</div>
                    <div>{{ task.progress }}%</div>
                </div>
                <div class="line"></div>
                <div class="body-row">
                    <div>Ход выполнения задачи,<br>Комментарий к отчёту
                    </div>
                    <div style="padding: 10px; background-color: #0d304b; min-height: 50px;">
                        <div v-for="(comment, index) in comments" :key="comment.id" style="padding-bottom: 15px;">
                            <div style="padding: 2px;">
                                #{{ index + 1 }} [{{ convertDate(comment.entryDate) }}] - {{
                                    getUserName(comment.userId)
                                }}
                                <span style="float: right">Прогресс {{ comment.value }}% </span>
                            </div>
                            <div style="padding: 2px;">
                                <textarea style="width: 100%;" disabled> {{ comment.comment }}</textarea>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="line"></div>
            </div>
            <div class="add-task-footer">
                <div data-remove @click="removeTask()" v-show="user.id == task.initiatorId">Удалить</div>
                <div data-remove @click="editTask()" v-show="user.id == task.initiatorId">Редактировать</div>
                <div data-remove @click="сhangeProgress()" v-show="user.id == task.initiatorId || user.id == task.executorId">Зафиксировать работу</div>
                <div data-remove @click="$parent.closeViewTask()">Закрыть</div>
            </div>
        </div>
    </div>
</template>

<script>

import VMTaskModal from '@/components/vm/task-dp-modal.vue';
import VMTaskDialog from '@/components/vm/task-dialog.vue';
import { mapState } from 'vuex';
import stub_img from '@/assets/images/photo_stub.jpeg';
import VMAddTaskForm from '@/components/vm/add-task-form';
import apiTasks from '@/api/VM_Tasks/vm-tasks';
import VMChangeProgress from '@/components/vm/change-progress';
import taskMessage from '@/components/vm/task-message';

export default {
    name: 'task-view',
    components: {
        'vm-task-dp-modal': VMTaskModal,
        'vm-task-dialog': VMTaskDialog
    },
    data() {
        return {
            errorFoto: false,
            comments: []
        };
    },
    props: {
        task: {
            type: Object,
            required: true
        }
    },
    getters: {},
    computed: {
        ...mapState('vm', ['currentUserId', 'users', 'departments']),
        user() {
            return this.users[this.currentUserId];
        },
        initiator() {
            return this.users[this.task.initiatorId];
        },
        executor() {
            return this.users[this.task.executorId];
        }
    },
    methods: {

        getState(state) {
            return ['Планируется', 'В работе', 'Выполнено', 'Просрочено', 'Отменено'][state];
        },

        getUserName(id) {
            if (!this.users[id]) return 'Не известный';
            return this.users[id].name;
        },

        getUserTitle(id) {
            if (!this.users[id]) return '';
            return this.users[id].title;
        },

        getUseMail(id, link = true) {
            if (!this.users[id]) return '';
            return link ? '<a href="mailto:' + this.users[id].mail + '" style="color: #ffffff;">' + this.users[id].mail + '</a>' : this.users[id].mail;
        },

        getDepartment(id) {
            return this.departments[id] ? this.departments[id].fullName : '';
        },

        getUserDepartment(id) {
            if (!this.users[id] || !this.departments[this.users[id].departmentId]) return '';
            return this.departments[this.users[id].departmentId].fullName;
        },

        getPriority(val) {
            return val == 1 ? 'Критичный' : 'Некритичный';
        },

        // Конвертировать дату
        convertDate(date) {
            return date ? date.split('T')[0].split('-')
                .reverse()
                .join('.') : '';
        },

        getFoto(userId) {
            if (!this.fotoError && this.users[userId]) {
                return 'https://mail.gazprom-neft.local/ews/Exchange.asmx/s/GetUserPhoto?size=HR64x64&email=' + this.users[userId].mail;
            }
            return stub_img;
        },

        editTask() {
            let optionsNew = {
                editTask: this.task
            };
            this.$modal.show(VMAddTaskForm, optionsNew, {
                height: 'auto',
                width: '800px',
                clickToClose: false,
            }, {
                close() {
                    this.$emit('close');
                },
                save() {
                    this.$emit('close');
                    let res = apiTasks.put(this.task.id, this.task);
                }
            });
        },

        сhangeProgress() {
            let self = this;
            const options = {
                task: this.task
            };
            this.$modal.show(VMChangeProgress,
                options,
                {
                    height: 'auto',
                    width: '600px',
                    clickToClose: false
                },
                {
                    save(data) {

                        self.comments.push(data);
                        let res = apiTasks.setProgress(data);

                        if (data.value == 100) {

                            let options = {
                                title: 'Внимание!',
                                content: '<p>Вы установили прогресс выполнения задачи в 100%, состояние текущей задачи будет автоматически обновлен до статуса "Выполнено".</p>'
                            };

                            self.$modal.show(taskMessage, options,
                                {
                                    height: 'auto',
                                    width: '600px',
                                    clickToClose: false
                                })
                        }
                    }
                });
        },

        // Удалить задачу
        removeTask() {
            let self = this;
            let options = {
                title: 'Вы действительно хотите удалить задачу?',
                content: '<h3>' + this.task.name + '</h3><p><span style="font-weight: bold;">Описание:</span> ' + this.task.description + '</p>'
            };
            this.$modal.show(VMTaskDialog, options,
                {
                    height: 'auto',
                    width: '600px',
                    clickToClose: false
                },
                {
                    ok() {
                        self.$emit('close');
                        self.$parent.removeTask(self.task);
                    }
                });
        },

        async loadProgress() {
            let res = await apiTasks.getProgress(this.task.id);
            this.comments.push(...res);
        }

    },

    created() {

    },

    mounted() {
        this.loadProgress();
        history.pushState(null, null, '/vm/' + this.task.id);
    }
};
</script>

<style scoped lang="scss">

@import "../../assets/styles/main";

.body-row {
    display: flex;
}

.body-row > div {
    margin: 10px;
}

.body-row > div:nth-child(1) {
    width: 300px;
    text-align: right;
    font-weight: bold;
}

.body-row > div:nth-child(2) {
    width: 880px;
}

.body-row > div:first-child::after {
    content: '\003A';
}

.profile-foto {
    /*margin-top: 15px;*/
    border-radius: 50%;
    /*border: solid 1px white;*/
    width: 64px;
    height: 64px;
    overflow: hidden;
    // background-image: url(../assets/images/photo_stub.jpeg);


}

.add-task {
    position: relative;
    width: 100%;
    z-index: 0;
    /*max-height: 80vh;*/
    background-color: $form-background-color;
    color: $text-color-01;
    overflow: auto;

    &-header {
        padding: 20px 0 20px 10px;
        border-bottom: solid 1px $line-color;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;

        span {
            text-transform: uppercase;
        }

        &-close {
            position: absolute;
            right: 0;
            top: 15px;
            cursor: pointer;

            &:after {
                content: "";
                background-image: url("../../assets/images/cross.svg");
                background-repeat: no-repeat;
                position: absolute;
                top: 3px;
                right: 10px;
                height: 24px;
                width: 24px;
            }
        }
    }

    &-content {
        position: relative;
        margin: 70px $default-margin;
        max-height: 90%;
        overflow: hidden;

        &-data {
            display: flex;
        }

        &-data-periodic {
            position: relative;
            // top:-30px;
            border: solid 1px $line-color;
            border-top: none;
            //padding-top: 20px;
        }
    }

    &-footer {
        width: 100%;
        padding: 20px;
        display: flex;
        gap: 10px;
        justify-content: right;

        div[data-remove] {
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

</style>
