<template>
    <div>
        <vm-task-dp-modal :task="task">
            <template slot="header">Обзор / Доска задачи</template>
            <template slot="body">
                <div class="body-row">
                    <div>Номер задачи / ID</div>
                    <div>#{{ task.id }}</div>
                </div>
                <div class="body-row">
                    <div>Задача</div>
                    <div>{{ task.name }}</div>
                </div>
                <div class="body-row">
                    <div>Описание</div>
                    <div>{{ task.description }}</div>
                </div>
                <div class="body-row">
                    <div>Инициатор / Автор</div>
                    <div>{{ task.author }}</div>
                </div>
                <div class="body-row">
                    <div>Исполнитель</div>
                    <div>{{ task.executor }}</div>
                </div>
                <div class="body-row">
                    <div>Структурное подразделение</div>
                    <div>{{ getSubdivision(task.subdivision) }}</div>
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
                    <div>{{ task.execution }}%</div>
                </div>
                <div class="body-row">
                    <div>Комментарий</div>
                    <div style="max-height: 200px; width: 450px; overflow-y: auto;">
                        <pre>{{ task.comment }}</pre>
                    </div>
                </div>
                <div class="line"></div>
            </template>
        </vm-task-dp-modal>
    </div>
</template>

<script>

import VMTaskModal from '@/components/tasks/vm-task-dp-modal.vue';
import VMTaskDialog from '@/components/tasks/vm-task-dialog.vue';
import { mapState } from 'vuex';

export default {
    name: 'vm-task-view',
    components: {
        'vm-task-dp-modal': VMTaskModal,
        'vm-task-dialog': VMTaskDialog
    },
    props: {
        task: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapState('dict', ['dictionariesData'])
    },
    methods: {

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
                        self.$parent.$emit('remove', self.task);
                    }
                });

        },

        getSubdivision(id) {
            return this.dictionariesData.subdivisions[id] ? this.dictionariesData.subdivisions[id].name : '';
        },

        getPriority(val) {
            return val == 1 ? 'Критичный' : 'Некритичный'
        },

        // Конвертировать дату
        convertDate (date) {
            return date ? date.split('T')[0].split('-').reverse().join('.') : '';
        },

    },

    created() {
        this.$on('remove', () => {
            this.removeTask();
        });
    },
};
</script>

<style scoped>

.body-row {
    display: flex;
}

.body-row div {
    margin: 10px;
}

.body-row div:first-child {
    width: 250px;
    text-align: right;
    font-weight: bold;
}

.body-row div:first-child::after {
    content: '\003A';
}

</style>
