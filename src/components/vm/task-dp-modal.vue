<template>
    <div class="add-task" v-if="isHavePermission">
        <div class="add-task-header">
            <span><slot name="header"></slot></span>
            <div class="add-task-header-close" @click="close()"></div>
        </div>
        <div class="add-task-content">
            <slot name="body"></slot>
        </div>
        <div class="add-task-footer">
            <slot name="footer">
                <div data-remove @click="close()">Закрыть</div>
                <div data-remove @click="edit()">Редактировать</div>
                <div data-remove @click="сhange()">Изменить прогресс, оставить комментарий</div>
                <div data-remove @click="remove()">Удалить</div>
            </slot>
        </div>
    </div>
    <div class="add-task" v-else>
        <div class="add-task-header">
            <div class="add-task-header-close" @click="close()"></div>
        </div>
        <div class="add-task-content text-center">
            <img src="../../assets/images/noaccess.svg" width="64" height="64" alt="Доступ запрещен"/>
            <h4 class="pt-5">Ваша роль не позволяет произвести данное действие</h4>
        </div>
    </div>
</template>

<script>

import VMChangeProgress from '@/components/vm/change-progress';
import VMAddTaskForm from '@/components/vm/add-task-form';
import apiTasks from '@/api/VM_Tasks/vm-tasks';

export default {
    name: 'vm-task-dp-modal',
    components: {
        VMChangeProgress
    },
    props: {
        isHavePermission: {
            type: Boolean,
            default: true,
        },
        task: {
            type: Object
        }
    },
    methods: {
        close() {
            this.$parent.$emit('close');
        },
        сhange() {
            const options = {
                task: this.task
            };
            this.$modal.show(VMChangeProgress, options,
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
        edit() {

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
        remove() {
            this.$parent.$emit('remove');
        },
    },
    created() {
        this.$on('ok', () => {
            console.log('OK');
        });
    }
};
</script>

<style scoped lang="scss">
@import "../../assets/styles/main";

.add-task {
    position: relative;
    width: 100%;
    /*max-height: 80vh;*/
    background-color: $form-background-color;
    color: $text-color-01;
    z-index: 1000;
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
        padding: 10px;
        display: flex;
        justify-content: right;
        gap: 10px;

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
