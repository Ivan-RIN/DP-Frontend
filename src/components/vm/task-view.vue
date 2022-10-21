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
                                    <img width="64" :src="getFoto(task.initiator.id)" @error="errorFoto($event.target)"/>
                                </div>
                            </div>
                            <div>
                                <div style="font-weight: bold;">{{ getUserName(task.initiator.id) }}</div>
                                <div>{{ getUserPost(task.initiator.id) }}</div>
                                <div>{{ getUserDepartment(task.initiator.id) }}</div>
                                <div><span v-html="getUseEmail(task.initiator.id)"></span></div>
                                <div>
                                    <span v-show="task.initiator.telephone">Тел.: {{ task.initiator.telephone }}</span>
                                    <span v-show="task.initiator.telephone && task.initiator.mobile">,&nbsp;</span>
                                    <span v-show="task.initiator.mobile">Сот.: {{ task.initiator.mobile }}</span>
                                </div>
                            </div>
                        </div>
                        <div style="display: flex; gap: 20px; padding: 20px; width: 50%; background-color: #0d304b;">
                            <div>
                                <div class="profile-foto">
                                    <img width="64" :src="getFoto(task.executor.id)" @error="errorFoto($event.target)"/>
                                </div>
                            </div>
                            <div>
                                <div style="font-weight: bold;">{{ getUserName(task.executor.id) }}</div>
                                <div>{{ getUserPost(task.executor.id) }}</div>
                                <div>{{ getUserDepartment(task.executor.id) }}</div>
                                <div><span v-html="getUseEmail(task.executor.id)"></span></div>
                                <div>
                                    <span v-show="task.executor.telephone">Тел.: {{ task.executor.telephone }}</span>
                                    <span v-show="task.executor.telephone && task.executor.mobile">,&nbsp;</span>
                                    <span v-show="task.executor.mobile">Сот.: {{ task.executor.mobile }}</span>
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
                    <div>Ход выполнения задачи,<br>Комментарий к отчёту</div>
                    <div style="padding: 10px; background-color: #0d304b; min-height: 50px;">
                        <div v-for="(comment, index) in getListComments" :key="comment.id"
                             style="padding-bottom: 15px;">
                            <div style="padding: 2px;">
                                {{ index + 1 }}. [{{ convertDate(comment.date) }}] - {{
                                    getUserName(comment.userId)
                                }}
                                <span style="float: right">Прогресс {{ comment.progress }}% </span>
                            </div>
                            <div style="padding: 8px; border: 1px solid #0e5994; overflow: hidden; margin-top: 2px; white-space: pre-line;">{{ comment.comment }}</div>
                        </div>
                    </div>
                </div>
                <div class="body-row">
                    <div>Загруженные файлы</div>
                    <div style="padding: 10px; background-color: #0d304b; min-height: 50px;">
                        <div v-for="(file, index) in task.files" :key="index" style="padding-bottom: 2px;">
                            <div
                                style="display: flex; padding: 8px; border: 1px solid #0e5994; overflow: hidden; margin-top: 2px;">
                                <img src="@/assets/icons/document-file.png" style="margin-right: 10px; cursor: pointer;"
                                     @click="downloadFile(file)">
                                <div style="width: 100%;">
                                    <img
                                        v-show="currentUser.id == task.initiator.id || currentUser.id == task.executor.id"
                                        src="@/assets/icons/file-delete.png"
                                        style="float: right; cursor: pointer; height: 32px;"
                                        @click="deleteFile(file)"
                                    >
                                    <div @click="downloadFile(file)" style="cursor: pointer;">
                                        {{ index + 1 }}. [{{ convertDate(file.date, true) }} -
                                        {{ getUserName(file.ownerId) }}]<br>
                                        {{ file.name }}, {{ getSize(file.size) }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="line"></div>
            </div>
            <div class="add-task-footer">
                <div data-remove @click="removeTask()" v-show="currentUser.id == task.initiator.id">Удалить</div>
                <div data-remove @click="editTask()" v-show="currentUser.id == task.initiator.id">Редактировать</div>
                <div data-remove @click="сhangeProgress()"
                     v-show="currentUser.id == task.initiator.id || currentUser.id == task.executor.id">
                    Зафиксировать работу
                </div>
                <div data-remove @click="downloadReport()">Загрузить отчет</div>
                <div data-remove @click="$parent.closeViewTask()">Закрыть</div>
            </div>
        </div>
    </div>
</template>

<script>

import { mapActions, mapState } from 'vuex';
import VMTaskModal from '@/components/vm/task-dp-modal.vue';
import VMTaskDialog from '@/components/vm/task-dialog.vue';
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
            comments: [],
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
        ...mapState('vm', ['currentUser', 'users', 'departments']),
        getListComments() {
            return this.task.comments.sort((a, b) => a.id > b.id ? 1 : -1);
        }
    },
    methods: {
        ...mapActions('task', ['setLoaderState']),
        getState(state) {
            return ['Планируется', 'В работе', 'Выполнено', 'Просрочено', 'Отменено'][state];
        },

        getUserName(id) {
            if (!this.users[id]) return 'Не известный';
            return this.users[id].name;
        },

        getUserPost(id) {
            if (!this.users[id]) return '';
            return this.users[id].post;
        },

        getUseEmail(id, link = true) {
            if (!this.users[id]) return '';
            return link ? '<a href="mailto:' + this.users[id].email + '" style="color: #ffffff;">' + this.users[id].email + '</a>' : this.users[id].email;
        },

        getUserDepartment(id) {
            if (!this.users[id] || !this.departments[this.users[id].departmentId]) return '';
            return this.departments[this.users[id].departmentId].name;
        },

        getPriority(val) {
            return val == 1 ? 'Критичный' : 'Некритичный';
        },

        // Конвертировать дату
        convertDate(date, full = false) {
            if (!date) return '';
            let part = date.split('T');
            part[0] = part[0].split('-')
                .reverse()
                .join('.');
            part[1] = part[1].split('.')[0];
            if (full) {
                return part[0] + ' ' + part[1];
            } else {
                return part[0];
            }
        },

        getFoto(userId) {
            if (this.users[userId])
                return 'https://mail.gazprom-neft.local/ews/Exchange.asmx/s/GetUserPhoto?size=HR64x64&email=' + this.users[userId].email;
            else
                return stub_img;
        },

        errorFoto(img) {
            img.src = stub_img;
        },

        getSize: function (size) {
            return size > 1048576 ? `${(size / 1048576).toFixed(2)}Mb.` : `${(size / 1024).toFixed(2)}Kb.`;
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

                    async save(comment, files) {

                        self.setLoaderState(true);

                        if (comment) {
                            let response = await apiTasks.appendComment(comment);
                            self.task.comments.push(response.comment);
                        }

                        if (files) {
                            let response = await apiTasks.appendFiles(files);
                            self.task.files.push(...response.loadedFiles);
                        }

                        self.setLoaderState(false);

                        if (comment.progress == 100) {

                            let options = {
                                title: 'Внимание!',
                                content: '<p>Вы установили прогресс выполнения задачи в 100%, состояние текущей задачи будет автоматически обновлен до статуса "Выполнено".</p>'
                            };

                            self.$modal.show(taskMessage, options, {
                                height: 'auto',
                                width: '600px',
                                clickToClose: false
                            });
                        }

                    }
                });
        },

        downloadFile(file) {
            let response = apiTasks.downloadFile(file.id, file.name);
        },

        async deleteFile(file) {

            let self = this;

            let options = {
                title: 'Внимание!',
                content: `<p>Вы действительно хотите удалить файл: "${file.name}"?</p>`
            };

            this.$modal.show(VMTaskDialog, options,
                {
                    height: 'auto',
                    width: '600px',
                    clickToClose: false
                },
                {
                    async ok() {

                        self.setLoaderState(true);
                        let response = await apiTasks.deleteFile(file.id);
                        self.setLoaderState(false);

                        let index = self.task.files.indexOf(file);
                        if (index !== -1) {
                            self.task.files.splice(index, 1);
                        }

                        self.$emit('close');
                    }
                }
            );
        },

        downloadReport() {
            window.location.href = '/api/VM_Tasks/getReport/' + this.task.id;
            //window.open('/api/VM_Tasks/getReport/' + this.task.id, '_blank');
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

    },

    created() {
    },

    mounted() {
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
