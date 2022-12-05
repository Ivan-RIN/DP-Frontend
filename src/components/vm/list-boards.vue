<template>
    <div>
        <template v-if="currentUser.access.isAdministrator">
            <div style="display: flex; justify-content: right; gap: 5px;">
                <div data-button @click="appBlock()">Добавить блок</div>
                <div data-button @click="appBoard()">Добавить доску</div>
            </div>
            <div class="line"></div>
        </template>
        <div style="display: flex; flex-wrap: wrap; grid-gap: 20px; padding: 0px 40px 20px;">
            <div
            style="background-color: #10548A; border-radius: 10px; width: 300px;
            min-height: 130px; padding: 10px; cursor: pointer; border-top: 1px solid #1071be;
            border-right: 1px solid #1071be;"
            v-for="board in boards"
            @click="openViewBoard(board)"
            >
                <div style="font-size: 16px;">
                    {{ board.block.name }} => {{ board.name }}
                </div>
                <div style="font-size: 12px;">
                    {{ board.description }}
                </div>
                <div style="border-bottom: 1px solid #ffffff; margin: 8px 0px;"></div>
                <div style="font-size: 14px;" v-if="board.ownerId">
                    Владелец: {{ getShortUserName(board.ownerId) }}
                </div>
                <div style="font-size: 14px;" v-if="false && board.adminId">
                    Администратор: {{ getShortUserName(board.adminId) }}
                </div>
                <div style="font-size: 14px;">
                    Количество задач: {{ board.tasks.length }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { mapActions, mapState } from 'vuex';
import api from '@/api/baseAPI';
import AddBoardForm from '@/components/vm/add-board-form';
import AddBlockForm from '@/components/vm/add-block-form';

export default {
	name: 'list-boards',
	props: {
		boards: {
			type: Array
		},
		openViewBoard: {
			type: Function
		},
	},
	computed: {
		...mapState('vm', ['currentUser', 'users', 'departments', 'boardBlocks', 'blocks']),
	},
	methods: {
        ...mapActions('task', ['setLoaderState']),
		getShortUserName(userId) {
			let user = this.users[userId];
			let fio = user.name.split(' ');
			if (fio.length == 2) return fio[0] + ' ' + fio[1][0] + '.';
			if (fio.length > 2) return fio[0] + ' ' + fio[1][0] + '.' + fio[2][0] + '.';
			return user.name;
		},
		getNameDepartment(id) {
			return this.departments[id].abbreviation;
		},
        appBlock() {
            let self = this;
            this.$modal.show(AddBlockForm,
                {},
                {
                    height: 'auto',
                    width: '600px',
                    clickToClose: false
                },
                {
                    async save(block) {

                        let response;
                        self.setLoaderState(true);

                        try {
                            response = await api.post('Boards/appendBlock', block);
                            if (response.result && response.result == 5) {
                                let block = response.data;
                                self.boardBlocks[block.id] = block;
                                //self.blocks.push(block);
                            }
                        } catch (e) {
                            self.$root.showModalError("Не удалось добавить блок.");
                        } finally {
                            self.setLoaderState(false);
                        }
                    }
                }
            );
        },
        appBoard() {
            let self = this;
            this.$modal.show(AddBoardForm,
                {},
                {
                    height: 'auto',
                    width: '600px',
                    clickToClose: false
                },
                {
                    async save(board) {

                        let response;
                        self.setLoaderState(true);

                        try {
                            response = await api.post('Boards/appendBoard', board);
                            if (response.result && response.result == 5) {
                                let board = response.data;
                                board.block = self.boardBlocks[board.blockId];
                                self.boards.push(board);
                            }
                        } catch (e) {
                            self.$root.showModalError("Не удалось добавить доску.");
                        } finally {
                            self.setLoaderState(false);
                        }
                    }
                }
            );
        }
	}
};
</script>

<style scoped lang="scss">

@import "../../assets/styles/main";

div[data-button] {
    @extend %button;
}

</style>
