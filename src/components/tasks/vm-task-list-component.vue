<template>
    <div class="task-list">
        <div>
<!--            <dp-combobox-component-->
<!--                :options="subdivisions"-->
<!--                text-field="name"-->
<!--                v-model="filterSubdivisions"/>-->
<!--            &nbsp;&nbsp;-->
            <select :class="select-component" v-model="filterSubdivisions">
                <option :value="0" style="font-weight: bold;">Все</option>
                <option
                    v-for="(option, index) in subdivisions"
                    :key="index"
                    :value="option.id"
                >
                    {{ option.name }}
                </option>
            </select>
        </div>
        <div class="line"></div>
        <div class="vm-task-list-header">
            <div class="row-col-1" style="cursor: pointer;"
                 @click="sortTasks('executionDate')"
            >
                Дата<br>исполнения
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
                 @click="sortStringTasks('author')"
            >
                Инициатор /<br>Автор
            </div>
            <div class="row-col-5" style="cursor: pointer;"
                 @click="sortStringTasks('executor')"
            >
                Ответственный /<br>Исполнитель
            </div>
            <div class="row-col-6" style="cursor: pointer;"
                 @click="sortTasks('createDate')"
            >
                Дата<br>создания
            </div>
        </div>
        <div class=""
             v-for="(section, index) in taskList"
             :key="index"
             v-if="!filterSubdivisions || filterSubdivisions == index"
        >
            <div style="padding: 8px 8px 8px 8px; font-weight: bold; background-color: #0d304b; min-width: 170px; text-align: center;
            position: relative; top: 0px; display: inline-block; border-radius: 10px 10px 0 0 ; margin-top: 10px; text-decoration: underline;">
                {{ subdivisions[index].abbreviation }} {{ getParentSubdivisions(index) }}
            </div>
            <div class="vm-task-list-content-background">
                <div class="vm-task-list-content"
                     v-for="task in section"
                     :key="task.id"
                     @click="openViewTask(task)"
                >
                    <div class="row-col-1">
                        {{ convertDate(task.executionDate) }}
                    </div>
                    <div class="row-col-2">
                        {{ task.execution }}%
                    </div>
                    <div class="row-col-3" style="text-align: left; display: flex; align-items: center;">
                        <div style="width: 32px;">
                            <img v-show="task.priority == 1" src="@/assets/icons/fire.png" width="24">
                        </div>
                        <div>{{ task.name }}</div>
                    </div>
                    <div class="row-col-4">
                        {{ task.author }}
                    </div>
                    <div class="row-col-5">
                        {{ task.executor }}
                    </div>
                    <div class="row-col-6">
                        {{ convertDate(task.createDate) }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { mapState } from 'vuex';
import DpComboboxComponent from '../common/dp-combobox-component.vue';
import VMViewTask from '@/components/tasks/vm-task-view.vue';
import apiTasks from '@/api/VMTasks/vm-tasks';

export default {
    name: 'vm-task-list-component',
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
            filterSubdivisions: 0
        };
    },
    components: {
        DpComboboxComponent,
        VMViewTask
    },
    props: {
        taskList: {
            type: Object
        },
        subdivisions: {
            type: Object
        },
        userProfiles: {
            type: Array
        },

    },
    mixins: [],
    computed: {
        ...mapState('dict', ['dictionariesData'])
    },
    watch: {},
    methods: {
        convertDate: function (date) {
            return date ? date.split('T')[0].split('-')
                .reverse()
                .join('.') : '';
        },
        getPriority: function (priority) {
            return priority < 4 ? ['-', 'Высокий', 'Средний', 'Низкий'][priority] : '-';
        },
        getParentSubdivisions(id) {
            const parentId = this.subdivisions[id].parentId;
            if (!parentId) return '';
            return '(' + this.subdivisions[parentId].abbreviation + ')';
        },
        getNameUser(login) {
            for (let user of this.userProfiles) {
                if (user.login == login) return user.name;
            }
            return '';
        },
        // Форма добавления задачи
        openViewTask(task) {

            let self = this;

            let options = {
                task,
            };

            options.buttonAction = function (name) {
                console.log('buttonAction - name', name);
            };

            this.$modal.show(VMViewTask, options, {
                    height: 'auto',
                    width: '800px',
                    clickToClose: false,
                },
                {
                    remove(task) {
                        self.removeTask(task);
                    }
                }
            );
        },
        async removeTask(task) {
            for (let id in this.taskList) {
                let tasks = this.taskList[id];
                for (let tid in tasks) {
                    if (tasks[tid].id == task.id) {
                        await apiTasks.delete(task.id);
                        this.taskList[id].splice(tid, 1);
                        return;
                    }
                }
            }
        },
        sortStringTasks(field) {
            this.sortFields[field] = !this.sortFields[field];
            for (let id in this.taskList) {
                let tasks = this.taskList[id];
                if (this.sortFields[field]) {
                    tasks.sort((a, b) => a[field].toLowerCase() > b[field].toLowerCase() ? -1 : 1);
                } else {
                    tasks.sort((a, b) => a[field].toLowerCase() > b[field].toLowerCase() ? 1 : -1);
                }
            }
        },
        sortTasks(field) {
            this.sortFields[field] = !this.sortFields[field];
            for (let id in this.taskList) {
                let tasks = this.taskList[id];
                if (this.sortFields[field]) {
                    tasks.sort((a, b) => a[field] > b[field] ? -1 : 1);
                } else {
                    tasks.sort((a, b) => a[field] > b[field] ? 1 : -1);
                }
            }
        }
    },
    mounted() {
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
        background-color: #154164;
    }

    &-content {
        display: flex;
        flex-wrap: nowrap;
        flex-direction: row;
        min-height: 40px;
        padding: 10px 10px 10px 10px;
        border-bottom: solid 1px $line-color;
        margin: 0px 0;
        cursor: pointer;
    }

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
    flex: 0 0 530px;
    text-align: center;
}

.row-col-4 {
    flex: 0 0 200px;
    text-align: center;
}

.row-col-5 {
    flex: 0 0 200px;
    text-align: center;
}

.row-col-6 {
    flex: 0 0 150px;
    text-align: center;
}

</style>
