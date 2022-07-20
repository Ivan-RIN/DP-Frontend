<template>
	<div class="task-list">
		<div class="task-list-data-header">
			<div class="tasks-view-data-header-col" data-col="1">
				Категория работ
			</div >
			<div class="task-list-data-header-col" data-col="2">
				<input type="checkbox" v-model="isCheckAll" @change="selectAll()"/>
			</div>
			<div class="task-list-data-header-col" data-col="3">
				№
			</div>
			<div class="task-list-data-header-col drill-site-field">
				Площадка
        <label class="filter">
          <input class="CDNG" type="text" v-model="cdngToFilter">
        </label>
			</div>
			<div class="task-list-data-header-col facilityField">
				Объект
<!--        <label class="filter">-->
<!--          <input class="Object" type="text" :value="objectValue" @input="updateObjectToFilter">-->
<!--        </label>-->
			</div>
			<div class="task-list-data-header-col" data-col="4">
				Задачи
			</div>
			<div class="task-list-data-header-col author-field" >
				Автор
        <label class="filter">
          <input class="Author" type="text" v-model="authorToFilter">
        </label>
			</div>
			<div class="task-list-data-header-col" data-col="5">
				Ответственный
        <label class="filter">
          <input class="Executor" type="text" v-model="executorToFilter">
        </label>
			</div>
		</div>
		<div class="task-list-content">
			<template v-for="i in taskListGroup">
				<div v-for="brigade in i.brigades"
				     class="task-list-content-brigade">
					<div data-brigade-name>
						{{i.id}}
						<br>
						{{brigade.brigade.name}}
						<br>
						<a data-check-all @click="brigadeSelect(brigade)">
							Отметить всё
						</a>
					</div>
					<div v-for="category in brigade.values"
					     class="task-list-content-brigade-category">
						<div data-name>
							{{category.taskCategory.name}}
							<br>
							<a data-check-all @click="categorySelect(category)">Отметить всё</a>
						</div>
						<div data-values>
							<div class="task-list-content-brigade-category-task"
							     v-for="task in category.values" :id="`task${task.id}`">
								<div class="task-list-content-brigade-category-task-container">
									<div data-col="2">
										<input type="checkbox"
										       v-model="task.isCheck"
										       :disabled="!task.executorId"/>
										<div v-if="!task.executorId"
										     :data-disabled="!task.executorId"
										     class="cover-input"
										     @click="isStatusDisabled($event.target.dataset.disabled)"/>
									</div>
									<div data-col="3">
										<div data-status :style="{'background-color': taskStatus[task.state].color}">
										</div>
										{{task.id}}
									</div>
									<div class="drill-site-field-data">
										<div v-html="showFacilityParent(task)">
										</div>
									</div>
									<div class="facilityField">
										<div v-html="showFacilityText(task)">
										</div>
									</div>
									<div data-col="4">
										<div data-task-name
											@click="openEditTask(task)"
										>
											{{createShortText(task.name, 65)}}
										</div>
										<div v-if="task.comment" data-task-comment>
											<span>Комментарий к отчёту:</span>
											{{createShortText(task.comment, 40)}}
										</div>
									</div>
									<div class="author-field">{{getAuthorName(task)}}</div>
									<div data-col="5" @click="openAddExecutor(task)">
										<span v-if="task.executor">{{createShortName(task.executor.name)}}</span>
										<span v-else>Не назначен <a>Назначить</a></span>
									</div>
									<div class="load-pdf-icon">
										<img v-if="checkFileId(task.soPs)"
										     src="../../assets/images/pdf.svg"
										     alt="Загрузить PDF"
										     @click="loadFile(task.soPs[0].sop.fileId)">
									</div>
									<template v-if="tasksHistory[`task${task.id}`]
									&& $can('read', 'ChangeHistory')">
										<div class="history-button"
										     @click="toggleTaskHistory($event.target)"
										     :data-taskId="task.id">
											<img v-if="checkButtonState(task.id)"
											     class="history-button-close"
                           src="../../assets/images/closeHistory.svg"
                           alt="Показать историю изменений"
                           :data-taskId="task.id">
											<img v-else src="../../assets/images/history.svg"
											     class="history-button-open"
											     alt="Показать историю изменений"
											     :data-taskId="task.id">
										</div>
									</template>
								</div>
								<TaskHistoryComponent
									v-if="$can('read', 'ChangeHistory')"
									:ref="`taskHistory${task.id}`"
									:isOpened="false"
									:taskId="task.id"
									@isHistoryExist="changeTaskBackground"/>
							</div>
						</div>
					</div>
				</div>
			</template>
		</div>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex';
  import debounce from 'lodash.debounce';
	import TaskExecutor from './task-executor-select-component.vue';
	import globalMethods from '../../mixins/global-methods';
	import TaskHistoryComponent from './taskHistoryComponent.vue';
  import SearchIcon from '@/components/common/search-icon-component.vue';

	export default {
		name: 'task-list-component',
		data() {
			return {
				// taskList:[],
				isCheckAll: false,
				openedHistory: [],
        newInputCollection: [],
        cdngToFilter: '',
        // objectToFilter: this.objectValue,
        authorToFilter: '',
        executorToFilter: '',
        // touched: false,
        refresh: false,
			};
		},
		components: {
      SearchIcon,
			TaskHistoryComponent,
		},
		props: {
      taskList: [],
      taskListGroup: [],
      tasksHistory: [],
      // cdngValue: String,
      // objectValue: String,
      // authorValue: String,
      // executorValue: String,
      clear: {
        default: 1,
      },
    },
    // ['taskList', 'taskListGroup', 'tasksHistory'],
		mixins: [globalMethods],
		computed: {
      ...mapGetters('dict', ['taskStatus']),
      ...mapGetters('task', ['filterState']),
      // ...mapGetters('dict', ['filterItems']),
		},
    watch: {
      clear() {
        this.cdngToFilter = '';
        this.authorToFilter = '';
        this.executorToFilter = '';
      },
      // objectValue(value) {
      //   if (!this.touched) this.objectToFilter = value;
      // },
      cdngToFilter() {
        this.updateValue();
      },
      // ObjectToFilter() {
      //   this.filterList();
      // },
      authorToFilter() {
        this.updateValue();
      },
      executorToFilter() {
        this.updateValue();
      },
    },
		methods: {
      // updateObjectToFilter(event) {
      //   this.touched = true;
      //   this.updateValue(event.target.value.toLowerCase());
      // },
      updateValue: debounce(function () {
        // this.touched = false;
        this.filterList();
        // this.$emit('input', value);
        // this.$emit('update:value', value);
      }, 700),
      filterList() {
        const array = this.taskList.map(item => item);
        this.newInputCollection = [];
        if (this.cdngToFilter === ''
            && this.authorToFilter === ''
            && this.executorToFilter === '') {
          this.$parent.collectTasksInGroups(this.taskList);
          this.$parent.actionFilterByDateApply('2');
          return;
        }
        const cdngLower = this.cdngToFilter.toLowerCase();
        const authorLower = this.authorToFilter.toLowerCase();
        const executorLower = this.executorToFilter.toLowerCase();
        for (let i = 0; i < array.length; i++) {
          const arrayItem = array[i];
          if (arrayItem.executor == null) {
            arrayItem.executor = { name: 'Не назначен' };
          }
          if ((arrayItem.facility.name.toString().toLowerCase().includes(cdngLower)
              || (arrayItem.facility.field != null
                  && arrayItem.facility.field.name.toString().toLowerCase().includes(cdngLower)))
              && arrayItem.author.name.toString().toLowerCase().includes(authorLower)
              && arrayItem.executor.name.toString().toLowerCase().includes(executorLower)) {
            this.newInputCollection.push(arrayItem);
          } else if (arrayItem.facility.parent != null) {
            if (arrayItem.facility.parent.name.toString().toLowerCase().includes(cdngLower)
                && arrayItem.author.name.toString().toLowerCase().includes(authorLower)
                && arrayItem.executor.name.toString().toLowerCase().includes(executorLower)) {
              this.newInputCollection.push(arrayItem);
            } else if ((arrayItem.facility.parent.parent != null
                        && arrayItem.facility.parent.parent.name.toString().toLowerCase().includes(cdngLower))
                       && arrayItem.author.name.toString().toLowerCase().includes(authorLower)
                       && arrayItem.executor.name.toString().toLowerCase().includes(executorLower)) {
              this.newInputCollection.push(arrayItem);
            }
          }
          if (arrayItem.executor.name === 'Не назначен') {
            arrayItem.executor = null;
          }
        }
        this.$parent.collectTasksInGroups(this.newInputCollection);
        this.$parent.actionFilterByDateApply('2');
      },
      openAddExecutor(task) {
        if (this.$can('read', 'Tasks')) {
          const event = {
            closed: () => {
              if (this.refresh) {
                this.$emit('reloadlist');
                this.refresh = !this.refresh;
              }
            },
          };
          this.$modal.show(TaskExecutor, { task }, { height: 'auto', width: '400px' }, event);
          this.$root.$on('refreshTasks', () => {
             this.refresh = true;
          });
        } else {
          this.$root.showModalError({
            errorMessage: {
              title: 'Ошибка',
              message: 'Ваша роль не позволяет произвести данное действие',
            },
          });
        }
      },
      isStatusDisabled(disabled) {
        if (disabled) {
          this.$root.showModalError({
            errorMessage: {
              title: 'Ошибка',
              message: 'Назначьте ответственного оператора для изменения статуса',
            },
          });
        }
      },
      async loadFile(id) {
        await this.$root.downloadFile(id);
      },
      checkFileId(sops) {
        return (sops[0] && sops[0].sop && sops[0].sop.fileId);
      },
      openEditTask(task) {
        this.$emit('openEditTask', task);
      },
      brigadeSelect(brigade, check = true) {
        brigade.values.forEach((category) => {
          this.categorySelect(category, check);
        });
      },
      toggleTaskHistory(e) {
        this.$refs[`taskHistory${e.dataset.taskid}`][0].toggleHistory();
        const taskIndex = this.openedHistory.indexOf(e.dataset.taskid);
        if (taskIndex > -1) {
          this.openedHistory.splice(taskIndex, 1);
        } else {
          this.openedHistory.push(e.dataset.taskid);
        }
      },
      changeTaskBackground(taskId) {
        const background = document.getElementById(`task${ taskId }`).style.backgroundColor;
        if (background) {
          document.getElementById(`task${ taskId }`).style.backgroundColor = '';
        } else {
          document.getElementById(`task${ taskId }`).style.backgroundColor = '#0E3E64';
        }
      },
      checkButtonState(id) {
        return this.openedHistory.includes(id.toString());
      },
      categorySelect(category) {
        category.values.forEach((task) => {
          // eslint-disable-next-line no-param-reassign
          if (task.executorId) {
            task.isCheck = !task.isCheck;
          }
        });
      },
      selectAll() {
        this.taskListGroup.forEach((i) => {
          i.brigades.forEach((brigade) => { this.brigadeSelect(brigade, this.isCheckAll); });
        });
      },
      createShortText(comment, maxlength) {
        if (comment) {
          return comment.length > maxlength ? `${comment.slice(0, maxlength) }...` : comment;
        }
        return '';
      },
      createShortName(name) {
        const shortName = name.split(' ');
        return shortName.length > 2 ? `${shortName[0]} ${shortName[1]} ...` : shortName.join(' ');
      },
      showFacilityText(task) {
        let facilityName = '';
        let parentName = '';
        if (this.isObject(task.facility) && !this.isNull(task.facility)) {
          facilityName = task.facility.name ? task.facility.name : '';
          parentName = task.facility.parent ? task.facility.parent.name : '';
          return task.facility.type == 2 ? `Скв. ${facilityName}<br>${parentName}` : `${facilityName}<br>${parentName}`;
        }
        return '';
      },
      showFacilityParent(task) {
        let fieldName = '';
        let parentName = '';
        if (!this.isEmpty(task.facility) && !this.isEmpty(task.facility.parent)) {
          fieldName += !this.isEmpty(task.facility.field) ? task.facility.field.name : '';
          const { parent } = task.facility;
          if (!this.isEmpty(parent.parent)) {
            parentName = parent.parent.name;
            return `${fieldName}<br>${parentName}`;
          }
          parentName = parent.name;
          return `${fieldName}<br>${parentName}`;
        }
        return '';
      },
      getAuthorName(task) {
        if (task && this.isObject(task.author) && task.author.name) {
          return task.author.name;
        }
        return '';
      },
    },
	};
</script>

<style scoped lang="scss">
	@import "../../assets/styles/main";

  .filter{
    display: flex;
    flex-direction: row;
    justify-content: left;
  }
  input{
    font-size: 14px;
  }
  input.CDNG{
    width: 155px;
    height: 25px;
    //outline: none;
  }
  input.Object{
    width: 90px;
    height: 25px;
    //outline: none;
  }
  input.Author{
    width: 102px;
    height: 25px;
    //outline: none;
  }
  input.Executor{
    width: 140px;
    height: 25px;
    //outline: none;
  }

	.task-list
	{
		a
		{
			cursor: pointer;
		}

		&-data-header
		{
			display: flex;
			flex-wrap: nowrap;
			flex-direction: row;
			//justify-content: space-between;
			padding: 0 $default-margin;

			div[data-col='1']
			{
				flex: 0 0 160px;
        text-align: center;
			}
			div[data-col='2']
			{
				flex: 0 0 40px;
				padding: 0 0 0 5px;

				input {
					border: none;
					padding: 0;
					height: 20px;
					cursor: pointer;
				}
			}
			div[data-col='3']
			{
				flex: 0 0 70px;
				text-align: center;
			}
			div[data-col='4']
			{
				flex: 0 0 500px;
        text-align: center;
			}
			div[data-col='5']
			{
				flex: 0 0 130px;
        text-align: center;
			}
			.facilityField {
				flex: 0 0 90px;
        text-align: center;
			}
			.drill-site-field {
				flex: 0 0 160px;
        text-align: center;
			}
			.author-field {
				width: 110px;
				padding-left: 4px;
        text-align: center;
			}
		}

		&-content
		{
			position: relative;
			a
			{
				color: $text-color-03;
				text-decoration: underline;
			}

			&-brigade
			{
				position: relative;
				background-color: $content-background-color;
				border-radius: 5px;
				min-height: 40px;
				margin: 10px 0;

				div[data-brigade-name]
				{
					position: absolute;
					top: 5px;
					left: -120px;
					width:  120px;
				}

				&-category
				{
					min-height: 40px;
					padding: 10px 10px 10px 20px;
					border-bottom: solid 2px $app-background-color;

					input{
						border: none;
						padding: 0;
						height: 20px;
						cursor: pointer;
					}

					>div[data-name]
					{
						width: 160px;
						float: left;
					}
					>div[data-values]
					{
						margin-left: 160px;

						.task-list-content-brigade-category-task
						{
							border-bottom: solid 1px $line-color;
							padding: 5px 0 5px 0;
							display: flex;
							flex-direction: column;

							&-container {
								display: flex;
								div[data-col='2'] {
									position: relative;
									flex: 0 0 40px;
									padding: 0 0 0 5px;
									.cover-input {
										position: absolute;
										top: 0;
										left: 0;
										height: 20px;
										width: 20px;
										z-index: 5;
									}
								}

								div[data-col='3'] {
									position: relative;
									flex: 0 0 70px;
									text-align: center;
									padding-top: 1px;

									div[data-status] {
										position: absolute;
										top: 4px;
										border-radius: 50%;
										width: 12px;
										height: 12px;
										background-color: white;
									}
								}

								div[data-col='4'] {
									flex: 0 0 500px;

									> div[data-task-name] {
										cursor: pointer;
									}

									> div[data-task-comment] {
										span {
											color: $text-color-02
										}
									}
								}

								div[data-col='5'] {
									flex: 0 0 130px;
									cursor: pointer;
								}

								.facilityField {
									flex: 0 0 90px;
								}

								.drill-site-field-data {
									flex: 0 0 160px;
								}

								.author-field {
									flex: 0 0 110px;
								}

								.load-pdf-icon {
									min-width: 35px;
									max-width: 35px;
									height: 35px;

									img {
										position: relative;
										top: 5px;
										cursor: pointer;
									}
								}

								.history-button {
									width: 40px;
									height: 40px;
									cursor: pointer;

									&-open {
										margin: 5px 0 0 10px;
									}
									&-close {
										margin: 5px 0 0 10px;
									}
								}
							}
						}
						.task-list-content-brigade-category-task:last-child
						{
							border-bottom: none;
						}
					}

				}
				&-category:last-child
				{
					border-bottom: none;
				}
			}
		}
	}
</style>
