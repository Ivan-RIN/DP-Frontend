<template>
    <div v-if="!task.groupId && performanceCriterions.length > 0">
<!--        <h3>Отчёт</h3>-->
        <div class="add-task-content-data-sop-criterions"
             v-for="(sop, indexSop) in performanceCriterions"
             v-bind:key="indexSop">
            <span class="add-task-content-data-sop-criterions-sop-name">{{sop.sopName}}</span>
            <div class="add-task-content-data-sop-criterions-sop-criterion"
                 v-for="(criterion, indexCriterion) in sop.criterions"
                 v-bind:key="indexCriterion">
                <label :for="`add-task-content-data-sop-criterions-sop-criterion-item${indexCriterion}`"
                       class="add-task-content-data-sop-criterions-sop-criterion-label">
                    {{getCriterionName(criterion.criterion.name)}}
                </label>

                <!-- If criterionType is String -->
                <template v-if="criterion.criterion.criterionType === 0">
                    <input :id="`add-task-content-data-sop-criterions-sop-criterion-item${indexCriterion}`"
                            type="text" maxlength="512" :data-id="criterion.criterion.id"
                           :data-sopid="sop.sopId"
                           :value="criterion.value"
                           @change="setValues(criterion.criterion.id, sop.sopId, $event.target.value)">
                </template>

                <!-- If criterionType is Number -->
                <template v-if="criterion.criterion.criterionType === 1">
                    <input :id="`add-task-content-data-sop-criterions-sop-criterion-item${indexCriterion}`"
                           type="number" :data-id="criterion.criterion.id"
                           :data-sopid="sop.sopId"
                           :value="criterion.value"
                           @change="setValues(criterion.criterion.id, sop.sopId, $event.target.value)">
                </template>

                <!-- If criterionType is File -->
                <template v-if="criterion.criterion.criterionType === 2">
                    <template v-if="isFileIdExist(criterion.criterion.id, sop.sopId)">
                        <button class="button attached-file" @click="loadFile(criterion.value)">
                            Открыть
                        </button>
                    </template>
                    <template v-else>
                        <label class="upload-button-label" :for="`load-file-field-${indexCriterion}`">
                            Выбрать
                        </label>
                        <input type="file" size="5000000"
                               accept=".jpg, .png, .tiff, .tif, .jpeg, .jpe, .jfif, .gif, .bmp"
                               :id="`load-file-field-${indexCriterion}`"
                               name=“FileUpload.FormFile”
                               :data-id="criterion.criterion.id"
                               :data-sopid="sop.sopId"
                               @input.prevent="loadFileToServer(criterion.criterion.id, sop.sopId, $event.target)">
                    </template>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
	import apiFiles from '../../api/Files/files';
	import imageModalComponent from '../modals/imageModalComponent.vue';

	export default {
        props: [
            'task',
            'editTask',
            'criterionOptions',
            'setCriterionValues',
            'loadingMaskHandler',
        ],
        data() {
            return {
	            performanceCriterions: [],
            };
        },
        mounted() {
	        this.setValuesToSop();
        },
        methods: {
	        getCriterionName(name) {
		        const canvas = document.createElement('canvas');
		        if (name && name.length > 0) {
			        const ctx = canvas.getContext('2d');
			        ctx.font = '12pt Arial';
			        const width = ctx.measureText(name).width;
			        return width > 190 ? `${name.slice(0, 11)}...` : name;
		        }
		        return '';
            },
            async loadFile(id) {
	            this.loadingMaskHandler(true);
                const data = await apiFiles.getById(id);
                const image = new Image();
                image.src = data.content;

	            let width = image.width;
	            width = width > 1024 || width <= 0 ? 990 : width;

                this.loadingMaskHandler(false);

                this.$modal.show(imageModalComponent, { image: data },
		            { height: 'auto', width: `${width}px` });
            },
	        isFileIdExist(criterionId, sopId) {
                if (criterionId && sopId && this.task.values) {
	                return this.task.values.some(item => (criterionId === item.criterionId && sopId === item.sopId));
                }
                return false;
            },
	        setFileName(target) {
		        // eslint-disable-next-line no-param-reassign
	            target.labels[0].textContent = target.files[0].name;
            },
            setValuesToSop() {
			    const isSopsNotEmpty = this.task.soPs.length > 0;
			    const isValuesNotEmpty = this.task.values ? this.task.values.length > 0 : false;
			    const performanceCriterions = {};

                if (isSopsNotEmpty) {
                    this.task.soPs.forEach((item) => {
                        if (item.sop.criterions && item.sop.criterions.length > 0) {
                            const name = `id${item.sopId}`;

                            performanceCriterions[name] = {
	                            sopId: item.sopId,
                                taskId: item.taskId,
                                sopName: item.sop.number,
                                criterions: item.sop.criterions,
                            };
                        }
                    });

                    if (isValuesNotEmpty) {
                        this.task.values.forEach((itemValue) => {
                            if (performanceCriterions[`id${itemValue.sopId}`]) {
                                const criterion = itemValue.criterionId;
	                            // eslint-disable-next-line no-unused-vars,max-len
	                            performanceCriterions[`id${itemValue.sopId}`].criterions = performanceCriterions[`id${itemValue.sopId}`].criterions.map((itemCriterion) => {
                                    if (itemCriterion.criterionId === criterion) {
                                        // eslint-disable-next-line no-param-reassign
                                        itemCriterion.value = itemValue.value;
                                        return itemCriterion;
                                    }
                                    return itemCriterion;
                                });
                            }
                        });
                    }
	                this.performanceCriterions = [];
                    // eslint-disable-next-line no-restricted-syntax
	                for (const sop in performanceCriterions) {
                        // eslint-disable-next-line no-prototype-builtins
                        if (performanceCriterions.hasOwnProperty(sop)) {
                            performanceCriterions[sop].criterions.sort((a, b) => a.criterion.id - b.criterion.id);
			                this.performanceCriterions.push(performanceCriterions[sop]);
		                }
	                }
                }
            },
	        loadFileToServer(criterionId, sopId, target) {
                const file = target.files[0];
                const files = this.criterionOptions.files;
                const maxFileSize = 5000000;
                const acceptedFormats = ['jpg', 'png', 'tiff', 'tif', 'jpeg', 'jpe', 'jfif', 'gif', 'bmp'];
                const fileFormat = file.type.replace('image/', '');
                let isFileExist;

                if (!acceptedFormats.includes(fileFormat)) {
	                this.$root.showModalError({
		                errorMessage: {
			                title: 'Ошибка загрузки файла',
			                message: 'Недопустимый формат изображения. Допустимы .jpg, .png, .tiff, .tif, '
                                + '.jpeg, .jpe, .jfif, .gif, .bmp',
		                },
	                });
                    // eslint-disable-next-line no-param-reassign
	                target.value = '';
	                return;
                }

		        if (file.size >= maxFileSize) {
			        this.$root.showModalError({
				        errorMessage: {
					        title: 'Ошибка загрузки файла',
					        message: 'Максимальный размер файла не должен превышать 5 мегабайт',
				        },
			        });
			        return;
		        }

                if (file) {
                    isFileExist = this.isFileExistInFileArray(files, criterionId, sopId);

                    const reader = new FileReader();

                    reader.onloadend = (result) => {
                        if (isFileExist) {
                            this.criterionOptions.files.splice(isFileExist.index, 1, {
                                content: result.target.result,
                                file,
                                sopId,
                                criterionId,
                            });
                        } else {
                            this.criterionOptions.files.push({
                                content: result.target.result,
                                file,
                                sopId,
                                criterionId,
                            });
                        }
                        this.setFileName(target);
                    };

                    reader.readAsDataURL(file);
                }
	        },
            isFileExistInFileArray(files, criterionId, sopId) {
	            if (this.criterionOptions.files.length > 0) {
		            return files.find((item, index) => {
			            if (item.criterionId === criterionId && item.sopId === sopId) {
				            // eslint-disable-next-line no-param-reassign
				            item.index = index;
				            return true;
			            }
			            return false;
		            });
	            }

                return false;
            },
	        setValues(criterionId, sopId, value) {
		        this.setCriterionValues(criterionId, sopId, value);
                this.setValuesToSop();
	        },
        },
    };
</script>
<style lang="scss">
    @import "../../assets/styles/main";

    h3 {
        margin-bottom: 15px;
        margin-left: 15px;
    }
    .add-task-content-data-sop-criterions {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        border: solid 1px #10548a;
        margin: 10px 0 10px 0;
        padding: 15px 0 5px 0;
        &-sop-criterion{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            flex-wrap: wrap;
            align-items: center;
            width: 355px;
            margin: 5px 0 5px 0;
            &-label {
                width: 170px;
                margin-left: 10px;
            }

            form {
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                align-items: center;
            }
        }

        span {
            position: absolute;
            padding: 0 3px 0 3px;
            top: -10px;
            left: 12px;
            background-color: rgba(15,66,107, 1);
        }

        input[type="file"] {
            height: 0;
            margin: 0;
            padding: 0;
            display: none;
            overflow: hidden;
            width: 0;
        }
        .upload-button-label {
            width: 160px;
            max-height: 26px;
            background-color: $action-color;
            border-radius: 2px;
            overflow: hidden;
            text-align: center;
            vertical-align: middle;
            padding: 0 10px;
            cursor: pointer;
            color: $text-color-01;
            line-height: 26px;
        }

        .attached-file {
            position: relative;
            padding: 0 20px 0 5px;
            margin-left: 5px;
            width: 160px;
            line-height: 26px;
            &:after {
                content: "";
                background-image: url("../../assets/images/attachedFile.svg");
                background-repeat: no-repeat;
                position: absolute;
                top: 6px;
                right: 35px;
                height: 15px;
                width: 15px;
            }
        }

        input {
            background-color: $input-background-color;
            border: 1px solid $line-color;
            border-radius: 2px;
            color: $text-color-01;
            padding: 5px;
            height: 30px;
            cursor: pointer;
            font-size: 11px;
            width: 160px;
        }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
    }
</style>
