<template>
    <div class="add-task">
        <div class="add-task-header">
            <span><slot name="header">Прогресс выполнения задачи {{task.id}}</slot></span>
            <div class="add-task-header-close" @click="close()"></div>
        </div>

        <div class="add-task-content">
            <div style="padding: 10px 20px 0 20px;">
                <div>Прогресс:</div>
                <div style="display: flex; gap: 20px;">
                    <input type="range" min="0" max="100" v-model="task.execution"
                           style="width: 90%;">
                    <span style="position: relative; top: 5px; font-weight: bold;">{{ task.execution }}%</span>
                </div>
            </div>
            <div style="padding: 20px;">
                <div>Комментарий:</div>
                <textarea id="add-task-content-data-textarea-task"
                          style="width: 100%; height: 240px;"
                          v-model="task.comment">
						</textarea>
            </div>
        </div>
        <div class="add-task-footer">
            <slot name="footer">
                <div data-remove @click="close()">Закрыть</div>
                <div data-remove @click="save()">Сохранить</div>
            </slot>
        </div>
    </div>
</template>

<script>

import apiTasks from '@/api/___VMTasks/vm-tasks';

export default {
    name: 'vm-change-progress',
    data() {
        return {
            execution: undefined,
            comment: undefined
        };
    },
    props: {
        task: { type: Object }
    },
    methods: {
        close() {
            this.task.execution = this.execution;
            this.task.comment = this.comment;
            this.$emit('close');
        },
        save() {
            let res = apiTasks.setProgress(this.task.id, {
                execution: this.task.execution,
                comment: this.task.comment,
            });
            console.log('res', res)
            this.$emit('close');
        }
    },
    mounted() {
        this.execution = this.task.execution;
        this.comment = this.task.comment;
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
        padding: 20px;
        display: flex;
        position: absolute;
        bottom: 0;
        gap: 15px;

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

