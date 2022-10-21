<template xmlns="http://www.w3.org/1999/html">
    <div class="add-task">
        <div class="add-task-header">
            <span>{{ title }}</span>
            <div class="add-task-header-close" @click="close()"></div>
        </div>
        <div class="add-task-content" v-html="content"></div>
        <div class="add-task-footer">
            <slot name="footer">
                <div data-button @click="ok()">Да</div>
                <div data-button @click="close()">Нет</div>
            </slot>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'vm-task-dialog',
    props: {
        title: {
            type: String,
            default: '',
        },
        content: {
            type: String,
            default: '',
        },
    },
    methods: {
        close() {
            this.$emit('close');
        },
        ok() {
            this.$emit('close');
            this.$parent.$emit('ok');
        }
    },
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
            border: solid 1px $line-color;
            border-top: none;
        }
    }

    &-footer {
        padding: 20px;
        display: flex;
        align-items: center;
        width: 100%;
        text-align: right;
        gap: 10px;

        div[data-button] {
            @extend %button;
            width: 100px;
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
