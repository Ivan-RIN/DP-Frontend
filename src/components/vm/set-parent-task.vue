<template>
    <div class="add-task">
        <div style="margin-bottom: 20px; font-weight: bold;">Добавить задачу в следующую родительскую задачу:</div>
        <div>
            <select style="margin-left: 5px; width: 98%;" @change="taskId = $event.target.value">
                <option value="0">Выйти из родительской задачи</option>
                <option
                    v-for="(task) in listTasks"
                    :key="task.id"
                    :value="task.id"
                    :selected="task.id == taskId"
                >
                    #{{ task.id }}, {{ task.name }}
                </option>
            </select>
        </div>
        <div style="height: 55px;"></div>
        <div class="add-task-footer">
            <div data-remove @click="select()">Выбрать</div>
            <div data-remove @click="close()">Закрыть</div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: "set-parent-task",
    props: {
        task: {},
        blockId: 0
    },
    data() {
        return {
            taskId: 0,
            listTasks: []
        }
    },
    computed: {
        ...mapState('vm', ['currentUser', 'boards']),
    },
    methods: {

        select() {
            this.$emit('close');
            this.$parent.$emit('selected', this.taskId);
        },

        close() {
            this.$emit('close');
        }
    },
    mounted() {
        for (let board of this.boards) {
            if (board.blockId == this.blockId) {
                console.log(board.name)
                for (let i in board.tasks) {
                    let task = board.tasks[i];
                    if (this.task.id != task.id) {
                        //if (i == 0) this.taskId = task.id;
                        this.listTasks.push(task);
                    }
                }
            }
        }
    }
}
</script>

<style scoped lang="scss">

@import "../../assets/styles/main";

div[data-remove] {
    @extend %button;
}

.add-task {
    position: relative;
    width: 100%;
    background-color: $form-background-color;
    color: $text-color-01;
    z-index: 1000;
    overflow: auto;
    padding: 20px;

    &-footer {
        width: 95%;
        padding: 20px;
        display: flex;
        position: absolute;
        bottom: 0;
        gap: 5px;
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
