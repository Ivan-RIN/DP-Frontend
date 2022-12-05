<template>
    <div class="add-task">
        <div style="margin-bottom: 20px; font-weight: bold;">Переместить задачу в следующий борд:</div>
        <div>
            <select style="margin-left: 5px; width: 98%;" @change="boardId = $event.target.value">
                <option
                    v-for="(board) in listBoards"
                    :key="board.id"
                    :value="board.id"
                    :selected="board.id == boardId"
                >
                    {{ board.name }}
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

import { mapActions, mapGetters, mapState } from 'vuex';

export default {
    name: "change-board-task",
    props: {
        task: {},
        blockId: 0
    },
    data() {
        return {
            boardId: 0,
            listBoards: []
        }
    },
    computed: {
        ...mapState('vm', ['currentUser', 'boards', 'boardUsers']),
    },
    methods: {

        select() {
            this.$emit('close');
            this.$parent.$emit('selected', this.boardId);
        },

        close() {
            this.$emit('close');
        }
    },
    mounted() {
        for (let board of this.boards) {
            if (board.blockId == this.blockId) {
                if (this.currentUser.access.isDeveloper || this.currentUser.access.isAdministrator) {
                  this.listBoards.push(board);
                  continue;
                }
                if (board.id != this.task.boardId && this.boardUsers[board.id] && this.boardUsers[board.id] > 1) {
                    this.listBoards.push(board);
                }
            }
        }
        if (this.listBoards.length) {
            this.boardId = this.listBoards[0].id;
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
