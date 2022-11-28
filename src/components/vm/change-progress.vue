<template>
    <div class="add-task">
        <div class="add-task-header">
            <span><slot name="header">Прогресс выполнения задачи #{{task.id}}</slot></span>
            <div class="add-task-header-close" @click="close()"></div>
        </div>

        <div class="add-task-content">
            <div style="padding: 10px 20px 0 20px;">
                <div>Прогресс:</div>
                <div style="display: flex; gap: 20px;">
                    <input type="range" min="0" max="100" v-model="progress"
                           style="width: 90%;">
                    <span style="position: relative; top: 5px; font-weight: bold;">{{ progress }}%</span>
                </div>
            </div>
            <div style="padding: 20px; display: flex;">
                <div style="padding: 6px 0px;">
                  Введите дату исполнения:
                </div>
                <div>
                    <date-picker-component
                        :attachQuery="false"
                        v-model="date"
                    />
                </div>
            </div>
            <div style="padding: 0px 20px;">
                <div>Комментарий:</div>
                <textarea id="add-task-content-data-textarea-task"
                      style="width: 100%; height: 240px;"
                      v-model="comment">
                </textarea>
            </div>
        </div>
        <div class="add-task-footer">
            <slot name="footer">
                <div data-remove @click="save()">Сохранить</div>
	            <div data-remove @click="close()">Закрыть</div>
            </slot>
        </div>
    </div>
</template>

<script>

import { mapState } from 'vuex';
import DatePickerComponent from '@/components/common/date-picker-component.vue';

export default {
    name: 'vm-change-progress',
    components: {
        DatePickerComponent
    },
    data() {
        return {
            date: undefined,
            progress: 0,
            comment: '',
            files: [],
            inputFiles: undefined
        };
    },
    computed: {
        ...mapState('vm', ['currentUser', 'users'])
    },
    props: {
        task: { type: Object }
    },
    methods: {
        close() {
            this.$emit('close');
        },
        appFiles() {
            this.$refs.inputFiles.click();
        },
        getSize: function (size) {
            return size >= 1048576 ? `${(size / 1048576).toFixed(2)}Mb.` : `${(size / 1024).toFixed(2)}Kb.`;
        },
        onFileChange(element) {
            let maxFiles = 10;
            if (element.target.files.length > maxFiles) {
                this.files = [{name: 'Превышено допустимое количество файлов для загрузки, выберите не более 10 файлов. Общий размер', size: 1048576 * 10}];
                return;
            };
            this.files = element.target.files;
            for(let file of this.files) {
                file.allowed = this.checkFile(file);
            }
        },
        checkFile(file) {

            let size = 1048576 * 10;
            let exts = ['.pdf', '.png', '.jpeg', '.doc', '.docx', '.xls', '.xlsx', '.pptx', '.ppt'];
            let ext = '.' + file.name.split('.').reverse()[0];

            if (exts.indexOf(ext) == -1) return false;
            if (file.size > size) return false;

            return true;
        },
        save() {

            this.task.progress = this.progress;

            if (this.progress == 100) this.task.state = 6;
            else this.task.state = 5;

            let comment = {
                taskId: this.task.id,
                userId: this.currentUser.id,
	            userDate: this.date ? this.date : new Date().toISOString(),
	            value: this.progress,
                comment: this.comment
            };

            let files = this.files.length > 0 ? {
                taskId: this.task.id,
                userId: this.currentUser.id,
                files: this.files
            } : null;

            this.$emit('close');
            this.$parent.$emit('save', comment, files);
        },
    },
    mounted() {
        this.progress = this.task.progress;
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
        gap: 5px;
	    float: right;

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

