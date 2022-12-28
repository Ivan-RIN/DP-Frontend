<template>
    <div class="add-task">
        <h3>Добавить доску</h3>
        <div slot="body">
            <div style="padding: 10px;">
                <div class="form-row">
                    <div>Выберете тип прав для создания задач</div>
                    <div>
                        <select style="width: 100%;" v-model="board.accessType">
                            <option
                                v-for="(access, index) in accessList"
                                v-if="access"
                                :key="index"
                                :value="index"
                                :selected="index == 1"
                            >
                                {{ access }}
                            </option>
                        </select>
						<div style="font-size: 12px; font-weight: normal; padding: 4px;">
							Частный - владелец и инициаторы доски, локальный - любой пользователь подразделения,
							публичный – любой пользователь с правами на просмотр доски.
						</div>
                    </div>
                </div>
                <div class="form-row">
                    <div>Выберете организацию</div>
                    <div>
                        <select style="width: 100%" v-model="board.organizationId">
                            <option :value="0" style="font-weight: bold;">Выберете организацию</option>
                            <option
                                v-for="(org) in organizations"
                                :key="org.id"
                                :value="org.id"
                            >
                                {{ org.shortName }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div>Выберете подразделение</div>
                    <div>
                        <select style="width: 100%;" v-model="board.departmentId">
                            <option :value="0" style="font-weight: bold;">Не установлен</option>
                            <option
                                v-for="(department, index) in departments"
                                :key="index"
                                :value="index"
                            >
                                {{ department.name }} ({{ department.abbreviation }})
                            </option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div>Выберете блок</div>
                    <div>
                        <select style="width: 100%;" v-model="board.blockId">
                            <option :value="0" style="font-weight: bold;">Выберете блок</option>
                            <option
                                v-for="(block) in boardBlocks"
                                :key="block.id"
                                :value="block.id"
                            >
                                {{ block.name }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div>Имя доски</div>
                    <div>
                        <input v-model="board.name" style="width: 100%;">
                    </div>
                </div>
                <div class="form-row">
                    <div>Описание доски</div>
                    <div>
                        <textarea style="width: 100%; height: 100px;"
                              v-model="board.description">
                        </textarea>
                    </div>
                </div>
            </div>
            <div style="height: 30px;"></div>
        </div>
        <div class="add-task-footer">
            <div data-remove @click="save()">Добавить</div>
            <div data-remove @click="close()">Закрыть</div>
        </div>
    </div>
</template>

<script>

import { mapActions, mapGetters, mapState } from 'vuex';

export default {
    name: 'add-board-form',
    data() {
        return {
            board: {
                accessType: 1,
                departmentId: 0,
                adminId: 0,
                blockId: 0,
                name: '',
                description: '',
                organizationId: 0
            },
            accessList: ['', 'Частный', 'Локальный', 'Групповой', '', 'Публичный']
        }
    },
    computed: {
        ...mapState('vm', ['currentUser', 'users', 'organizations', 'departments', 'listDepartments', 'rootDepartments', 'boardBlocks']),
    },
    methods: {

        // Сохранить
        save() {
            if (this.board.blockId > 0 && this.board.name.length > 3 && this.board.organizationId > 0) {
                this.$emit('close');
                this.$parent.$emit('save', this.board);
            } else {
                this.$root.showModalError({
                    'errorMessage': {
                        title: 'Ошибка заполнения формы',
                        message: 'Заполните все поля формы',
                    },
                });
            }
        },
        close() {
            this.$emit('close');
        }
    }
};

</script>

<style scoped lang="scss">

@import "../../assets/styles/main";

div[data-button] {
    @extend %button;
}

.form-row {

}

.form-row > div:nth-child(1) {
    font-weight: bold;
    margin-bottom: 4px;
}

.form-row > div:nth-child(2) {
    margin-bottom: 18px;
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
