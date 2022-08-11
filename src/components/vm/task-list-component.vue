<template>
    <div class="task-list">
        <div>
<!--            <dp-combobox-component-->
<!--                :options="subdivisions"-->
<!--                text-field="name"-->
<!--                v-model="filterSubdivisions"/>-->
<!--            &nbsp;&nbsp;-->
            <select  v-model="filter">
                <option :value="0" style="font-weight: bold;">Все</option>
                <option
                    v-for="(department) in departments"
                    :key="department.id"
                    :value="department.id">
                    {{ department.fullName }}
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
                 @click="sortTasks('initiatorId')"
            >
                Инициатор /<br>Автор
            </div>
            <div class="row-col-5" style="cursor: pointer;"
                 @click="sortTasks('executorId')"
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
             v-for="(department, depId) in tasks"
             :key="depId"
             v-if="!filter || filter == depId">
            <div style="padding: 8px 8px 8px 8px; font-weight: bold; background-color: #0d304b; min-width: 170px; text-align: center;
            position: relative; top: 0px; display: inline-block; border-radius: 10px 10px 0 0; text-decoration: underline;">
                {{ getNameDepartment(depId) }} {{ getParentDepartment(depId) }}
            </div>
            <div class="vm-task-list-content-background" style="margin-bottom: 20px;">
                <div class="vm-task-list-content"
                     v-for="task in department"
                     :key="task.id"
                     @click="openViewTask(task)">
                    <div class="row-col-1" :style="{ color: overdueDateColor(task.state, task.executionDate) }">
                        {{ convertDate(task.executionDate) }}
                    </div>
                    <div class="row-col-2">
                        {{ task.progress }}%
                    </div>
                    <div class="row-col-3" style="text-align: left; display: flex; align-items: center;">
                        <div style="width: 32px;">
                            <img v-if="task.state == 2" src="@/assets/icons/performed.png" width="20">
                            <img v-else v-show="task.priority == 1" src="@/assets/icons/fire.png" width="24">

                        </div>
                        <div>#{{ task.id }}. {{ task.name }}</div>
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
            </div>
        </div>
    </div>
</template>

<script>

import { mapState } from 'vuex';
import DpComboboxComponent from '../common/dp-combobox-component.vue';
import VMViewTask from '@/components/vm/task-view.vue';
import apiTasks from '@/api/VM_Tasks/vm-tasks';

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
            filter: 0
        };
    },
    components: {
        DpComboboxComponent,
        VMViewTask
    },
    props: {
        tasks: {
            type: Object
        },
        openViewTask: {
            type: Function
        }
    },
    mixins: [],
    computed: {
        ...mapState('vm', ['currentUserId', 'users', 'departments']),
    },
    watch: {},
    methods: {
        overdueDateColor(state, executionDate) {
            let date = new Date(executionDate);
            let current = new Date();
            current.setHours(0);
            current.setMinutes(0);
            current.setSeconds(0,0);
            return state == 1 && current > date ? '#f00' : '#fff';
        },
        convertDate(date) {
            return date ? date.split('T')[0].split('-').reverse().join('.') : '';
        },
        getNameDepartment(id) {
            return this.departments[id].name;
        },
        getParentDepartment(id) {
            const parentId = this.departments[id].parentId;
            if (!parentId) return '';
            return '(' + this.departments[parentId].name + ')';
        },
        getUserName(id) {
            if (!this.users[id]) return 'Не известный';
            return this.users[id].name;
        },
        getShortUserName(id) {
            if (!this.users[id]) return 'Не известный';
            let data = this.users[id].name.split(' ');
            if (data.length == 2) return data[0] + ' ' + data[1][0] + '.';
            if (data.length > 2) return data[0] + ' ' + data[1][0] + '.' + data[2][0] + '.';
            return this.users[id].name;
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
        }
    },
    mounted() {
        history.pushState(null, null, '/vm');
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
