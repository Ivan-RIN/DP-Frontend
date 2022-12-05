<template>
    <div class="add-task">
        <h3>Добавить блок</h3>
        <div slot="body">
            <div style="padding: 10px;">
                <div class="form-row">
                    <div>Имя блока</div>
                    <div>
                        <input v-model="block.name" style="width: 100%;">
                    </div>
                </div>
                <div class="form-row">
                    <div>Описание блока</div>
                    <div>
                        <textarea style="width: 100%; height: 100px;"
                              v-model="block.description">
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
    name: 'add-block-form',
    data() {
        return {
            block: {
                adminId: 0,
                name: '',
                description: '',
            }
        }
    },
    computed: {
        ...mapState('vm', ['currentUser', 'users', 'organizations', 'departments', 'listDepartments', 'rootDepartments', 'blocks']),
    },
    methods: {

        // Сохранить
        save() {
            if (this.block.name.length > 3) {
                this.$emit('close');
                this.$parent.$emit('save', this.block);
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
