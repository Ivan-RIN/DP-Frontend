<template>
    <div class="add-task">
        <div class="add-task-header">
            <span><slot name="header">Загрузка файлов</slot></span>
            <div class="add-task-header-close" @click="close()"></div>
        </div>

        <div class="add-task-content">
            <div style="padding: 10px 20px;">
	            <h3>Требование к файлам:</h3>
	            <div>
					<p>Типы разрешенных файлов: {{ this.exts.join(', ') }}</p>
		            <p>Максимальный размер файла, не более {{ getSize(maxSize) }}</p>
					<p>Общий размер файлов, не более {{ getSize(maxSize * maxFiles) }}</p>
		            <p>Количество загружаемых файлов за раз, не более {{ maxFiles }}</p>
	            </div>
                <h3 style="font-weight: bold; margin-top: 10px;">Файлы:</h3>
                <div v-if="files.length == 0" style="height: 200px;">
                    Отсутствуют.
                </div>
                <ul v-for="(file, index) in files" style="padding: 2px 30px;">
                    <li v-if="file.allowed" :key="index">{{file.name}}, {{ getSize(file.size) }}</li>
                    <li v-else :key="index" style="color: #969696;">{{file.name}}, {{ getSize(file.size) }}</li>
                </ul>
	            <div style="margin-top: 20px;">Общий размер всех файлов: {{ getSize(totalSize) }}</div>
            </div>
            <div style="display: none;">
                <input ref="inputFiles" type="file" @change="onFileChange" multiple>
            </div>
        </div>
        <div class="add-task-footer">
            <slot name="footer">
                <div data-remove @click="appFiles()">Выбрать файлы</div>
                <div data-remove @click="save()">Загрузить</div>
	            <div data-remove @click="close()">Закрыть</div>
            </slot>
        </div>
    </div>
</template>

<script>

import { mapState } from 'vuex';
import DatePickerComponent from '@/components/common/date-picker-component.vue';

export default {
    name: 'loader-files',
    components: {
        DatePickerComponent
    },
    data() {
        return {
	        maxFiles: 5,
	        maxSize: 1048576 * 20,
	        exts: ['.pdf', '.png', '.jpeg', '.doc', '.docx', '.xls', '.xlsx', '.pptx', '.ppt', '.msg'],
            date: undefined,
            files: [],
            inputFiles: undefined,
	        totalSize: 0
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
            return size >= 1048576 ? `${(size / 1048576).toFixed(2)}Мб.` : `${(size / 1024).toFixed(2)}Кб.`;
        },
        onFileChange(element) {
            if (element.target.files.length > this.maxFiles) {
                this.files = [{name: `Превышено допустимое количество файлов для загрузки,
                выберите не более ${this.maxFiles} файлов. Общий размер`, size: this.maxSize * this.maxFiles}];
                return;
            };
            this.files = element.target.files;
	        this.totalSize = 0;
            for(let file of this.files) {
	            this.totalSize += file.size;
                file.allowed = this.checkFile(file);
            }
        },
        checkFile(file) {
            let ext = '.' + file.name.split('.').reverse()[0];
            if (this.exts.indexOf(ext) == -1) return false;
            if (file.size > this.maxSize) return false;
            return true;
        },
        save() {

            let files = this.files.length > 0 ? {
                taskId: this.task.id,
                userId: this.currentUser.id,
                files: this.files
            } : null;

            this.$emit('close');
            this.$parent.$emit('save', files);
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

