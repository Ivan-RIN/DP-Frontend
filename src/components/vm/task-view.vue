<template>
    <div>
        <div class="add-task">
            <div class="add-task-header">
                <span>Обзор / Доска задачи</span>
                <div class="add-task-header-close" @click="$parent.closeViewTask()"></div>
            </div>
	        <div style="display: flex;">
		        <div class="add-task-content" style="width: 250px;">
			        <div class="body-row">
				        <div style="min-height: 460px; text-align: left; margin-left: 20px; border-right: 1px solid #ffffff;">
					        <div style="margin-bottom: 16px; font-size: 16px;">Управление задачей</div>
					        <ul class="nav-ul" style="list-style-type: none; cursor: pointer;font-weight: normal;">
						        <li @click="editTask()" v-show="currentUser.id == task.initiatorId">- Редактировать</li>
						        <li
							        @click="uploadFiles()"
							        v-show="currentUser.id == task.initiatorId || currentUser.id == task.executorId">- Загрузить файлы</li>
						        <li></li>
						        <li
							        @click="сhangeProgress()"
							        v-show="currentUser.id == task.initiatorId || currentUser.id == task.executorId">- Установить прогресс</li>
						        <li @click="delegateTask()" >- Делегировать задачу</li>
						        <li @click="downloadReport()">- Загрузить отчет</li>
						        <li @click="$parent.closeViewTask()">- Закрыть окно</li>
						        <li style="margin-top: 30px;" @click="removeTask()" v-show="currentUser.id == task.initiatorId">- Удалить задачу</li>
					        </ul>
				        </div>
			        </div>
		        </div>
	            <div class="add-task-content" style="left: -100px;">
	                <div class="body-row">
	                    <div>Номер задачи / ID</div>
	                    <div>#{{ task.id }}</div>
	                </div>
					<div class="body-row" v-if="task.parentTask">
						<div>Родительская задача</div>
						<div style="padding: 10px; background-color: #0d304b;">
							<div class="body-row-child">
								<div>Задача:</div>
								<div>#{{ task.parentTask.id }}, {{ task.parentTask.name }}</div>
							</div>
							<div class="body-row-child">
								<div>Описание:</div>
								<div>{{ task.parentTask.description }}</div>
							</div>
							<div class="body-row-child">
								<div>Инициатор:</div>
								<div>{{ getUserName(task.parentTask.initiatorId) }}</div>
							</div>
							<div class="body-row-child">
								<div>Срок выполнения</div>
								<div>{{ convertDate(task.parentTask.startDate) }} - {{ convertDate(task.parentTask.endDate) }}</div>
							</div>
							<div class="body-row-child">
								<div>Приоритет</div>
								<div>{{ getPriority(task.parentTask.priority) }}</div>
							</div>
							<div class="body-row-child">
								<div>Прогресс</div>
								<div>{{ task.parentTask.progress }}%</div>
							</div>
							<div class="body-row-child" style="position: relative;">
								<div></div>
								<div data-button style="position: absolute; right: 0px; top: -30px"
									 @click="$parent.openViewTaskBy(task.parentTask.id)">Открыть задачу</div>
							</div>
						</div>
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
	                        <div v-if="taskInitiator" style="display: flex; gap: 20px; padding: 20px; width: 50%; background-color: #0d304b;">
	                            <div>
	                                <div class="profile-foto">
	                                    <img width="64" :src="getFoto(task.initiatorId)" @error="errorFoto($event.target)"/>
	                                </div>
	                            </div>
	                            <div>
	                                <div style="font-weight: bold;">{{ getUserName(task.initiatorId) }}</div>
	                                <div>{{ getUserPost(task.initiatorId) }}</div>
	                                <div>{{ getUserDepartment(task.initiatorId) }}</div>
	                                <div><span v-html="getUseEmail(task.initiatorId)"></span></div>
	                                <div>
		                                <span v-show="taskInitiator.telephone">Тел.: {{ taskInitiator.telephone }}</span>
	                                    <span v-show="taskInitiator.telephone && taskInitiator.mobile">,&nbsp;</span>
	                                    <span v-show="taskInitiator.mobile">Сот.: {{ taskInitiator.mobile }}</span>
	                                </div>
	                            </div>
	                        </div>
	                        <div v-if="taskExecutor" style="display: flex; gap: 20px; padding: 20px; width: 50%; background-color: #0d304b;">
	                            <div>
	                                <div class="profile-foto">
	                                    <img width="64" :src="getFoto(task.executorId)" @error="errorFoto($event.target)"/>
	                                </div>
	                            </div>
	                            <div>
	                                <div style="font-weight: bold;">{{ getUserName(task.executorId) }}</div>
	                                <div>{{ getUserPost(task.executorId) }}</div>
	                                <div>{{ getUserDepartment(task.executorId) }}</div>
	                                <div><span v-html="getUseEmail(task.executorId)"></span></div>
	                                <div>
	                                    <span v-show="taskExecutor.telephone">Тел.: {{ taskExecutor.telephone }}</span>
	                                    <span v-show="taskExecutor.telephone && taskExecutor.mobile">,&nbsp;</span>
	                                    <span v-show="taskExecutor.mobile">Сот.: {{ taskExecutor.mobile }}</span>
	                                </div>
	                            </div>
	                        </div>
	                    </div>
	                </div>
					<div class="body-row">
						<div>Статус</div>
						<div>{{ getState(task.state) }}</div>
					</div>
	                <div class="body-row">
	                    <div>Срок выполнения</div>
	                    <div>{{ convertDate(task.startDate) }} - {{ convertDate(task.endDate) }}</div>
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
	                        <div v-for="(step, index) in getTaskSteps" :key="step.id"
	                             style="padding-bottom: 15px;">
	                            <div style="padding: 2px;">
	                                {{ index + 1 }}. [{{ convertDate(step.userDate) }}] - {{
	                                    getUserName(step.userId)
	                                }}
	                                <span style="float: right">Прогресс {{ step.value }}% </span>
	                            </div>
	                            <div style="padding: 8px; border: 1px solid #0e5994; overflow: hidden; margin-top: 2px; white-space: pre-line;">{{ step.comment }}</div>
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
	                                        v-show="currentUser.id == task.initiatorId || currentUser.id == task.executorId"
	                                        src="@/assets/icons/file-delete.png"
	                                        style="float: right; cursor: pointer; height: 32px;"
	                                        @click="deleteFile(file)"
	                                    >
	                                    <div @click="downloadFile(file)" style="cursor: pointer;">
	                                        {{ index + 1 }}. [{{ convertDate(file.date, true) }} -
	                                        {{ getUserName(file.userId) }}]<br>
	                                        {{ file.name }}, {{ getSize(file.size) }}
	                                    </div>
	                                </div>
	                            </div>
	                        </div>
	                    </div>
	                </div>
	                <div class="line"></div>
	            </div>
	        </div>
            <div class="add-task-footer">
                <div data-remove @click="$parent.closeViewTask()">Закрыть</div>
            </div>
        </div>
    </div>
</template>

<script>

import { mapActions, mapState } from 'vuex';
import api from '@/api/baseAPI';
import VMTaskModal from '@/components/vm/task-dp-modal.vue';
import VMTaskDialog from '@/components/vm/task-dialog.vue';
import stub_img from '@/assets/images/photo_stub.jpeg';
import AddTaskForm from '@/components/vm/add-task-form';
import AddTaskDelegateForm from '@/components/vm/add-task-delegate-form';
import ChangeProgress from '@/components/vm/change-progress';
import LoaderFiles from '@/components/vm/loader-files';
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
	    board: {
		    type: Object,
		    required: true
	    },
        task: {
            type: Object,
            required: true
        },
      buttonAction: {
        type: Function
      }
    },
    getters: {

    },
    computed: {
        ...mapState('vm', ['currentUser', 'users', 'departments']),
	    taskInitiator() {
		    return this.users[this.task.initiatorId] ? this.users[this.task.initiatorId] : null;
	    },
	    taskExecutor() {
        	return this.users[this.task.executorId] ? this.users[this.task.executorId] : null;
	    },
	    getTaskSteps() {
            return this.task.taskSteps.sort((a, b) => a.id > b.id ? 1 : -1);
        }
    },
    methods: {
        ...mapActions('task', ['setLoaderState']),

		init() {

		},

        getState(state) {
            return ['Неизвестный', 'Планируется', 'В работе', 'Выполнено', 'Отменено', 'Просрочено', 'Утверждение', 'Отклоненный'][state];
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

        getPriority(state) {
	        return ['Неизвестный', 'Низкий', 'Обычный', 'Средний', 'Высокий', 'Критический'][state];
        },

        // Конвертировать дату
        convertDate(date, full = false) {
            if (!date) return '';
            let part = date.split('T');
            part[0] = part[0].split('-').reverse().join('.');
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
            return size > 1048576 ? `${(size / 1048576).toFixed(2)}Мб.` : `${(size / 1024).toFixed(2)}Кб.`;
        },

        editTask() {
            let optionsNew = {
            	board: this.board,
	            _task: this.task
            };
            this.$modal.show(AddTaskForm, optionsNew, {
                height: 'auto',
                width: '800px',
                clickToClose: false,
            }, {
                close() {
                    this.$emit('close');
                },
	            async save() {
                    this.$emit('close');
	                let response = await api.put('Tasks/' + this.task.id, this.task);
                }
            });
        },

        сhangeProgress() {
            let self = this;
            const options = {
                task: this.task
            };
            this.$modal.show(ChangeProgress,
                options,
                {
                    height: 'auto',
                    width: '600px',
                    clickToClose: false
                },
                {

                    async save(progress) {

                        self.setLoaderState(true);

                        if (progress) {
	                        let response = await api.post('Tasks/setProgress/' + progress.taskId, progress);
                            self.task.taskSteps.push(response);
                        }

                        self.setLoaderState(false);

                        if (progress.value == 100) {

	                        self.task.state = 3;

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

	    uploadFiles() {
		    let self = this;
		    const options = {
			    task: this.task
		    };
		    this.$modal.show(LoaderFiles,
			    options,
			    {
				    height: 'auto',
				    width: '600px',
				    clickToClose: false
			    },
			    {

				    async save(files) {

					    self.setLoaderState(true);

					    if (files) {

						    let response = await api.form('Tasks/uploadFiles', files);
						    console.log(response)

						    for (let i in response.loadedFiles) {
							    self.task.files.push(response.loadedFiles[i]);
						    }

						    if (response.errorFiles.length) {

						    }

					    }

					    self.setLoaderState(false);
				    }
			    });
	    },

        async deleteFile(file) {

            let self = this;

            let options = {
                title: 'Внимание!',
                content: `<p>Вы действительно хотите удалить файл: "${file.name}"?</p>`
            };

            this.$modal.show(VMTaskDialog,
				options,
                {
                    height: 'auto',
                    width: '600px',
                    clickToClose: false
                },
                {
                    async ok() {

                        self.setLoaderState(true);
	                    let response = await api.get('Tasks/deleteFile/' + file.id);
                        //response = await apiTasks.deleteFile(file.id);
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
            window.location.href = '/dtm/Tasks/getReportTask/' + this.task.id;
            //window.open('/api/VM_Tasks/getReport/' + this.task.id, '_blank');
        },

        // Удалить задачу
        removeTask() {
            let self = this;
            let options = {
                title: 'Вы действительно хотите удалить задачу?',
                content: '<h3>' + this.task.name + '</h3><p><span style="font-weight: bold;">Описание:</span> ' + this.task.description + '</p>'
            };
            this.$modal.show(VMTaskDialog,
				options,
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

	    delegateTask() {

		    let optionsNew = {
			    board: this.board,
			    task: this.task,
          buttonAction: this.buttonAction
		    };

		    this.$modal.show(AddTaskDelegateForm, optionsNew, {
			    height: 'auto',
			    width: '800px',
			    clickToClose: false,
		    }, {
			    close() {
				    this.$emit('close');
			    },
			    async save() {
				    this.$emit('close');
				    let response = await api.put('Tasks/delegateTask/' + this.task.id, this.task);
			    }
		    });
	    }

    },

    created() {
    	this.init();
    },

    mounted() {
    	this.task.files = this.task.files || [];
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

.body-row-child {
	display: flex;
}

.body-row-child > div {
	margin: 4px 10px;
}

.body-row-child > div:nth-child(1) {
	width: 160px;
	text-align: right;
	font-weight: bold;
}

.body-row-child > div:nth-child(2) {

}

.profile-foto {
    /*margin-top: 15px;*/
    border-radius: 50%;
    /*border: solid 1px white;*/
    width: 64px;
    height: 64px;
    overflow: hidden;
    // background-image: url(../assets/images/photo_stub.jpeg)
}

.nav-ul li {
	position: relative;
	cursor: pointer;
	line-height: 1;         /*задаём высоту строки*/
	text-decoration: none;  /*убираем подчёркивание*/
	margin: 10px;
}

.nav-ul li:after {
	display: block;
	position: absolute;
	left: 0;                      /*изменить на right:0;, чтобы изменить направление подчёркивания */
	width: 0;                     /*задаём длинну линии до наведения курсора*/
	height: 0.5px;                /*задаём ширину линии*/
	background-color: #ffffff;    /*задаём цвет линии*/
	content: "";
	transition: width 0.15s ease-out; /*задаём время анимации*/
}

.nav-ul li:hover:after,

.nav-ul li:focus:after {
	width: 90%;
}

div[data-button] {
	@extend %button;
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
