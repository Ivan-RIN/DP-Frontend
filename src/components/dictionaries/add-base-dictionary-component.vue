<template>
    <div class="add-dict-form">
        <div class="add-dict-form-header">
            <span>{{currDict.name}}</span>
            <div class="add-dict-form-header-close" @click="closeForm()"></div>
        </div>
        <div class="line"></div>
        <div class="add-dict-form-content">
            <div
                    v-for="(column, index) in currDict.description.columns"
                    v-bind:key="index"
                    class="add-dict-form-content-item"
            >
                <template v-if="column.visible">
                    <div data-name>{{column.displayName}}:</div>
                    <div data-value>
                        <template v-if="column.referenceDictionary">
                            <dp-combobox-component
                                    :options="dictionariesData[column.referenceDictionary]"
                                    v-model="currDictItem.values[column.fieldName]"
                                    :text-field="column.referenceDisplayField"
                                    :value-field="column.referencePKField"
                            />
                        </template>
                        <template v-else-if="column.innerObjectColumns">
                            <dp-combobox-component
                                    :options="dictionariesData.performanceCriterions"
                                    v-model="criterion"/>
                            <template v-if="currDictItem.values.criterions.length > 0">
                                <div class="add-dict-form-content-item-criterions-container">
                                    <div class="add-dict-form-content-item-criterions-container-item"
                                        v-for="(criterion, index) in currDictItem.values.criterions"
                                         v-bind:key="index">
                                        {{getCriterionName(criterion.criterionId)}}
                                        <span   :data-id="criterion.criterionId"
                                                @click="deleteCriterion($event.target.dataset.id)"
                                                class="add-dict-form-content-item-criterions-container-item-delete"/>
                                    </div>
                                </div>
                            </template>
                        </template>
                        <template v-else-if="column.type === 'boolean'">
                            <input type="checkbox" v-model="currDictItem.values[column.fieldName]"/>
                        </template>
                        <template v-else-if="column.type === 'file'">
                            <template v-if="checkFileId(currDictItem.values[column.fieldName])">
                                <div class="load-buttons">
                                    <button class="button download-button-label"
                                            @click="getFile(currDictItem.values[column.fieldName])">
                                        Скачать
                                    </button>
                                    <button class="edit-button"
                                            @click="currDictItem.values[column.fieldName] = 0">
                                        <img src="../../assets/images/edit.svg" alt="">
                                    </button>
                                </div>
                            </template>
                            <template v-else>
                                <label :for="`add-dict-form-content-item-upload-${column.fieldName}`"
                                       class="button upload-button-label">Выбрать
                                </label>
                                <input type="file" @input="getFileId($event.target, column.fieldName)"
                                       :id="`add-dict-form-content-item-upload-${column.fieldName}`"
                                       :data-fieldName="column.fieldName"
                                       accept="application/pdf"/>
                            </template>
                        </template>
                        <template v-else-if="column.type === 'number'">
                            <input type="number"
                                   max="2000000"
                                   @input="validateNumberField($event.target, column.fieldName)"
                                   :value="currDictItem.values[column.fieldName]"/>
                        </template>
                        <template v-else-if="column.type === 'date'">
                            <input type="text"
                                   @change="validate($event.target.value, column.fieldName)"
                                   :value="setDate(currDictItem.values[column.fieldName])"/>
                        </template>
                        <template v-else>
                            <input type="text" v-model="currDictItem.values[column.fieldName]"/>
                        </template>
                    </div>
                </template>
            </div>
        </div>
        <div class="add-dict-form-footer">
            <div data-save @click="uploadAndSave()">Сохранить</div>
            <div data-close @click="closeForm()">Закрыть</div>
        </div>
    </div>
</template>

<script>
	import { mapActions, mapGetters } from 'vuex';
	import api from '../../api/dictionaries-api';
	import apiFile from '../../api/Files/files';
	import DpComboboxComponent from '../common/dp-combobox-component.vue';

	export default {
        name: 'add-base-dictionary-component',
        components: { DpComboboxComponent },
        props: ['currDict', 'dictItem'],
        data() {
            return {
	            criterion: undefined,
                criterions: [],
                file: undefined,
	            /**
                 * Criterions
                 * {Array{}}
                 * Example:
                 * {
                 *   "sopId": 0,
	             *   "criterionId": 0,
	             *   "criterion": {
	             *     "id": 0,
	             *     "name": "string",
	             *     "criterionType": 0
	             *   }
	             * }
	             */
                currDictItem:
                    {
                        values: {},
                    },
            };
        },
        watch: {
            criterion(n) {
                const me = this;
	            let existInArray;
                if (me.currDictItem.values.criterions.length > 0) {
		            existInArray = me.currDictItem.values.criterions.find(item => item.criterionId === parseInt(n, 10));
	            }

                if (!existInArray) {
                    if (me.dictItem) {
	                    me.currDictItem.values.criterions.push({
			                sopId: me.dictItem.id,
			                criterionId: parseInt(n, 10),
		                });
	                } else {
	                    me.currDictItem.values.criterions.push({
			                criterionId: parseInt(n, 10),
		                });
	                }
	            } else {
                    this.$root.showModalError({
                        errorMessage: {
                            title: 'Ошибка',
                            message: 'Данный критерий уже добавлен',
                        },
                    });
                }
            },
        },
        computed:
            {
                ...mapGetters('dict', ['dictionariesData']),
            },
        methods:
            {
                ...mapActions('dict', ['loadAllDict']),
                closeForm() {
                    this.$emit('close');
                },
                setDate(date) {
                    return date ? date.substr(0, 10) : new Date().toISOString().substr(0, 10);
                },
	            validateNumberField(target, columnName) {
		            const oldValue = this.currDictItem.values[columnName];
		            const valueInt = parseInt(target.value, 10);

		            if (valueInt < 2000000000) {
			            this.currDictItem.values[columnName] = valueInt;
		            } else {
			            this.$root.showModalError({
				            errorMessage: {
					            title: 'Ошибка ввода',
					            message: 'Максимальное число должно быть менее 2 147 483 647',
				            },
			            });
			            target.value = oldValue;
                    }
	            },
                validate(value, column) {
	                const expression = new RegExp(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/);
	                if (expression.test(value) && value.length === 10) {
		                this.currDictItem.values[column] = value;
                    } else {
		                this.currDictItem.values[column] = this.dictItem[column].substr(0, 10);
		                this.$root.showModalError({
			                errorMessage: {
				                message: 'Допустимый формат даты 0000-00-00',
			                },
		                });
                    }
                },
	            async getFile(id) {
		            await this.$root.downloadFile(id);
                },
	            getCriterionName(criterionId) {
		            const criterion = this.dictionariesData.performanceCriterions.find(item => item.id === criterionId);
		            const canvas = document.createElement('canvas');
		            if (criterion && criterion.name && criterion.name.length > 0) {
			            const ctx = canvas.getContext('2d');
			            ctx.font = '12pt Arial';
			            const width = ctx.measureText(criterion.name).width;
			            return width > 190 ? `${criterion.name.slice(0, 11)}...` : criterion.name;
		            }
		            return 'Неизвестный';
	            },
                getFileId(target) {
                    const typeCorrect = target.files[0].type === 'application/pdf';
	                const maxFileSize = 5000000;
	                const file = target.files[0];
                    if (typeCorrect) {
	                    if (file.size >= maxFileSize) {
		                    this.$root.showModalError({
			                    errorMessage: {
				                    title: 'Ошибка загрузки файла',
				                    message: 'Максимальный размер файла не должен превышать 5 мегабайт',
			                    },
		                    });
		                    target.value = '';
		                    return;
	                    }

	                    if (file) {
		                    const reader = new FileReader();

		                    reader.onloadend = (result) => {
                                this.file = {
                                    content: result.target.result,
                                    file,
                                };
			                    this.setFileName(target);
		                    };

		                    reader.readAsDataURL(file);
	                    }
                    } else {
	                    this.$root.showModalError({
		                    errorMessage: {
			                    title: 'Ошибка загрузки файла',
			                    message: 'Недопустимый формат файла. Допустим только PDF',
		                    },
	                    });
	                    target.value = '';
                    }
                },
	            setFileName(target) {
		            target.labels[0].textContent = target.files[0].name;
	            },
	            checkFileId(id) {
                    return !!id;
                },
                deleteCriterion(id) {
                    for (let i = 0, len = this.currDictItem.values.criterions.length; i < len; i++) {
                        if (this.currDictItem.values.criterions[i].criterionId === parseInt(id, 10)) {
                            if (this.currDictItem.values.criterions.length === 1) {
		                        this.currDictItem.values.criterions = [];
                            } else {
		                        this.currDictItem.values.criterions.splice(i, 1);
	                        }
	                        break;
                        }
                    }
                },
                async uploadAndSave() {
                    let response;

                    if (!this.$root.isEmpty(this.file)) {
                        response = await apiFile.post({
                            name: this.file.file.name,
                            content: this.file.content,
                        });
	                    this.currDictItem.values.fileId = response;
	                    this.save();
                    } else {
	                    this.save();
                    }
                },
                async save() {
                    let response;

                    if (this.dictItem) {
                        response = await api.put(this.currDict.description.apiAddress, this.getPK(),
                                this.currDictItem.values);
                    } else {
                        response = await api.post(this.currDict.description.apiAddress,
                                this.currDictItem.values);
                    }
                    if (response.errorMessage) {
                        this.$root.showModalError(response);
                    } else {
                        this.$emit('close');
                    }
                },
                getPK() {
                    const pkField = this.currDict.description.columns.find(e => e.primaryKey);
                    return (pkField)
                        ? this.currDictItem.values[pkField.fieldName]
                        : null;
                },
            },
        created() {
            this.loadAllDict();
            if (this.dictItem) {
                this.currDictItem.values = JSON.parse(JSON.stringify(this.dictItem));
            } else {
                this.currDict.description.columns.forEach((e) => {
                    if (!e.primaryKey) {
                        this.currDictItem.values[e.fieldName] = e.defaultValue;
                    }
                });
            }
        },
        mounted() {
            if (this.dictItem) {
                this.currDictItem.values = JSON.parse(JSON.stringify(this.dictItem));
            }
        },
    };
</script>

<style lang="scss">
    @import "../../assets/styles/main";

    .add-dict-form {
        position: relative;
        width: 100%;
        max-height: 80vh;
        background-color: $form-background-color;
        color: $text-color-01;
        padding: 10px;
        overflow: auto;
        z-index: 2000;

        select {
            width: 215px;
        }

        &-header {
            position: relative;
            padding-left: 10px;
            padding-top: 10px;

            span {
                text-transform: uppercase;
            }

            &-close {
                position: absolute;
                right: 25px;
                top: 5px;
                cursor: pointer;
                &:after{
                    content: "";
                    background-image: url("../../assets/images/cross.svg");
                    background-repeat: no-repeat;
                    position: absolute;
                    top: 3px;
                    right: 10px;
                    height: 18px;
                    width: 18px;
                }
            }
        }

        &-content {
            width: 70%;
            margin: auto;
            &-item {
                margin: 10px 0;
                display: flex;
                align-items: center;

                div[data-name] {
                    flex: 0 0 250px;
                    text-align: right;
                    padding: 0 10px;
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
                    width: 157px;
                    background-color: $action-color;
                    border-radius: 2px;
                    text-align: center;
                    vertical-align: middle;
                    padding: 0 10px;
                    cursor: pointer;
                    color: $text-color-01;
                }
                .load-buttons{
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    .download-button-label {
                        height: 26px;
                        width: 120px;
                    }
                    .edit-button {
                        margin-left: 10px;
                        width: 26px;
                        height: 26px;
                        background-color: #d65151;
                        border-radius: 3px;
                        img {
                            position: relative;
                            top: 1px;
                            left: 1px;
                            width: 60%;
                        }
                    }
                }


                div[data-value] {
                    flex: 0 0 140px;

                    input {
                        border-radius: 5px;
                    }
                }
                &-criterions-container {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    width: 215px;
                    margin-top: 10px;
                    &-item {
                        position: relative;
                        width: 215px;
                        padding: 0 20px 0 5px;
                        margin: 1px 0 1px 0;
                        background-color: #105e8f;
                        border-radius: 5px;
                        max-height: 20px;
                        &-delete {
                            position: absolute;
                            right: 0;
                            top: 0;
                            cursor: pointer;

                            &:after {
                                content: "";
                                background-image: url("../../assets/images/cross.svg");
                                background-repeat: no-repeat;
                                background-size: contain;
                                position: absolute;
                                top: -2px;
                                right: 0;
                                height: 20px;
                                width: 20px;
                            }
                        }
                    }
                }
            }
        }

        &-footer {
            padding: 10px 0 10px 10px;
            display: flex;

            div[data-save] {
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
