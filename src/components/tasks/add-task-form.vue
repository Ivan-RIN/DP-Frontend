<template>
	<div>
		<loading-mask-component v-if="loadMaskIsActive"/>
		<dp-modal>
			<template v-if="editTask" slot="header">
				<span>Задача № {{ editTask.id }}</span>
				<!--				<span style="margin: 0 50px">-->
				<!--					<button @click="activeTab=0">Задача</button>-->
				<!--					<button @click="activeTab=1">СОП</button>-->
				<!--					<button @click="activeTab=2">Чек-лист</button>-->
				<!--					<button @click="loadFile(5)">Инструкция</button>-->
				<!--				</span>-->
			</template>
			<template v-else-if="$can('read', 'Tasks/Report')" slot="header">
				Добавление нарушения
			</template>
			<template v-else slot="header">Добавление задачи</template>
			<!--			<template v-if="activeTab==1" slot="body">-->
			<!--				<div class="add-task-content-data" style="height: 442px; margin-top: 20px">-->
			<!--					01.02.01.03-26 СОП Замена массомера<br>-->
			<!--					01.02.01.04-02 СОП Отбор проб<br>-->
			<!--					01.02.01.03-13 СОП Ревизия обратного клапана<br>-->
			<!--					01.02.01.03-18 СОП Замена СВУ<br>-->
			<!--					01.02.01.04-01 СОП Замер дебита скважины<br>-->
			<!--					01.02.01.03-22 СОП Замена задвижки на АФК<br>-->
			<!--					01.02.01.03-25 СОП Сборка Кабельного ввода (с шайбами звезда)<br>-->
			<!--					01.02.01.03-19 СОП Подготовка нефтяной скважины к ПГИ<br>-->
			<!--					01.02.01.03-04 СОП Замена БЭВ<br>-->
			<!--					01.02.01.03-08 СОП Замер Динамического уровня<br>-->
			<!--					01.02.02.01-11 СОП Замена штуцера КШД<br>-->
			<!--					01.02.01.03-20 СОП Прокачка коллектора<br>-->
			<!--					01.02.01.03-07 СОП Подготовка и проведение ХОС<br>-->
			<!--					01.02.01.03-10 СОП Опрессовка НКТ<br>-->
			<!--					01.02.01.03-01 СОП Замена пробоотборного вентиля<br>-->
			<!--					01.02.01.03-15 СОП Замена ТОР<br>-->
			<!--					01.02.01.03-12 СОП Проведение ГО по затрубному пространству<br>-->
			<!--					01.02.01.04-03 СОП Определение причины снижения замера<br>					-->
			<!--					01.02.01.04-02 СОП Отбор проб<br>-->
			<!--					01.02.01.03-14 СОП Замена газовой заслонки<br>-->
			<!--					01.02.01.03-09 СОП Сборка Кабельного ввода (с шайбами полумесяцами)<br>					-->
			<!--				</div>-->
			<!--			</template>-->
			<!--			<template v-if="activeTab==2" slot="body">-->
			<!--				<div class="add-task-content-data" style="height: 77px">-->
			<!--					<div class="add-task-content-data-field" data-field>-->
			<!--						<div data-name>Ознакомление с инструкцией:<span class="requiredField">*</span></div>-->
			<!--						<div class="add-task-content-data-field-priority">-->
			<!--							<input id="add-task-content-data-field-priority-critical" type="radio"-->
			<!--								v-model="task.priority" :value="1">								-->
			<!--							<label for="add-task-content-data-field-priority-critical">-->
			<!--								Ознакомился</label>-->
			<!--							<input id="add-task-content-data-field-priority-typical" type="radio"-->
			<!--								v-model="task.priority" :value="2">								-->
			<!--							<label for="add-task-content-data-field-priority-typical">-->
			<!--								Не&nbsp;ознакомился</label>-->
			<!--						</div>-->
			<!--					</div>					-->
			<!--				</div>-->
			<!--				<div class="add-task-content-data" style="height: 77px">-->
			<!--					<div class="add-task-content-data-field" data-field>-->
			<!--						<div data-name>Внимательное ознакомление с инструкцией:<span class="requiredField">*</span></div>-->
			<!--						<div class="add-task-content-data-field-priority">-->
			<!--							<input id="add-task-content-data-field-priority-critical" type="radio"-->
			<!--								v-model="task.priority" :value="1">								-->
			<!--							<label for="add-task-content-data-field-priority-critical">-->
			<!--								Ознакомился</label>-->
			<!--							<input id="add-task-content-data-field-priority-typical" type="radio"-->
			<!--								v-model="task.priority" :value="2">								-->
			<!--							<label for="add-task-content-data-field-priority-typical">-->
			<!--								Не&nbsp;ознакомился</label>-->
			<!--						</div>-->
			<!--					</div>					-->
			<!--				</div>-->
			<!--				<div class="add-task-content-data" style="height: 77px">-->
			<!--					<div class="add-task-content-data-field" data-field>-->
			<!--						<div data-name>Детальное ознакомление с инструкцией:<span class="requiredField">*</span></div>-->
			<!--						<div class="add-task-content-data-field-priority">-->
			<!--							<input id="add-task-content-data-field-priority-critical" type="radio"-->
			<!--								v-model="task.priority" :value="1">								-->
			<!--							<label for="add-task-content-data-field-priority-critical">-->
			<!--								Ознакомился</label>-->
			<!--							<input id="add-task-content-data-field-priority-typical" type="radio"-->
			<!--								v-model="task.priority" :value="2">								-->
			<!--							<label for="add-task-content-data-field-priority-typical">-->
			<!--								Не&nbsp;ознакомился</label>-->
			<!--						</div>-->
			<!--					</div>					-->
			<!--				</div>		-->
			<!--				<div class="add-task-content-data" style="height: 77px">-->
			<!--					<div class="add-task-content-data-field" data-field>-->
			<!--						<div data-name>Вдумчивое ознакомление с инструкцией:<span class="requiredField">*</span></div>-->
			<!--						<div class="add-task-content-data-field-priority">-->
			<!--							<input id="add-task-content-data-field-priority-critical" type="radio"-->
			<!--								v-model="task.priority" :value="1">								-->
			<!--							<label for="add-task-content-data-field-priority-critical">-->
			<!--								Ознакомился</label>-->
			<!--							<input id="add-task-content-data-field-priority-typical" type="radio"-->
			<!--								v-model="task.priority" :value="2">								-->
			<!--							<label for="add-task-content-data-field-priority-typical">-->
			<!--								Не&nbsp;ознакомился</label>-->
			<!--						</div>-->
			<!--					</div>					-->
			<!--				</div>		-->
			<!--				<div class="add-task-content-data" style="height: 77px">-->
			<!--					<div class="add-task-content-data-field" data-field>-->
			<!--						<div data-name>Зачитал инструкцию до дыр:<span class="requiredField">*</span></div>-->
			<!--						<div class="add-task-content-data-field-priority">-->
			<!--							<input id="add-task-content-data-field-priority-critical" type="radio"-->
			<!--								v-model="task.priority" :value="1">								-->
			<!--							<label for="add-task-content-data-field-priority-critical">-->
			<!--								Ознакомился</label>-->
			<!--							<input id="add-task-content-data-field-priority-typical" type="radio"-->
			<!--								v-model="task.priority" :value="2">								-->
			<!--							<label for="add-task-content-data-field-priority-typical">-->
			<!--								Не&nbsp;ознакомился</label>-->
			<!--						</div>-->
			<!--					</div>					-->
			<!--				</div>		-->
			<!--				<div class="add-task-content-data" style="height: 77px">-->
			<!--					<div class="add-task-content-data-field" data-field>-->
			<!--						<div data-name>Выучил инструкцию наизусть:<span class="requiredField">*</span></div>-->
			<!--						<div class="add-task-content-data-field-priority">-->
			<!--							<input id="add-task-content-data-field-priority-critical" type="radio"-->
			<!--								v-model="task.priority" :value="1">								-->
			<!--							<label for="add-task-content-data-field-priority-critical">-->
			<!--								Ознакомился</label>-->
			<!--							<input id="add-task-content-data-field-priority-typical" type="radio"-->
			<!--								v-model="task.priority" :value="2">								-->
			<!--							<label for="add-task-content-data-field-priority-typical">-->
			<!--								Не&nbsp;ознакомился</label>-->
			<!--						</div>-->
			<!--					</div>					-->
			<!--				</div>		-->
			<!--			</template>-->
			<!--			<template v-else-if="activeTab==0" slot="body">-->
			<template slot="body">
				<div class="add-task-content-data">
					<div class="add-task-content-data-textarea">
						<label for="add-task-content-data-textarea-task-name" data-name>
							Название:
							<span class="requiredField">*</span>
						</label>
						<textarea id="add-task-content-data-textarea-task-name"
						          class="add-task-content-data-textarea-task" v-model="task.name">
						</textarea>
					</div>
				</div>
				<div class="add-task-content-data">
					<div class="add-task-content-data-field" data-field>
						<div data-name>Приоритет:<span class="requiredField">*</span></div>
						<div class="add-task-content-data-field-priority">
							<input id="add-task-content-data-field-priority-critical" type="radio"
							       v-model="task.priority" :value="1">
							<label for="add-task-content-data-field-priority-critical">
								Критичные&nbsp;(первоочередные)</label>
							<input id="add-task-content-data-field-priority-typical" type="radio"
							       v-model="task.priority" :value="2">
							<label for="add-task-content-data-field-priority-typical">
								Некритичные</label>
						</div>
					</div>
				</div>
				<div class="add-task-content-data">
					<div class="add-task-content-data-field" data-field>
						<div data-name>Тип:<span class="requiredField">*</span></div>
						<div data-value>
							<dp-combobox-component :options="dictionariesData.SOPs" v-model="sopToAdd"
							                       :isDisabled="isSopDisabled()"
							                       text-field="number"/>
							<div class="disabled-select" v-if="isSopDisabled()"></div>
						</div>
					</div>
					<div class="add-task-content-data-field" data-field>
						<div data-name>Категория:<span class="requiredField">*</span></div>
						<div data-value>
							<dp-combobox-component
								:options="dictionariesData.taskCategories"
								v-model="task.taskCategoryId">
							</dp-combobox-component>
						</div>
					</div>
				</div>
				<div class="add-task-content-data">
					<div class="add-task-content-data-field" data-field>
						<div data-name>ЦДНГ:<span class="requiredField">*</span></div>
						<div data-value>
							<dp-combobox-component
								:options="chooseCDNG()"
								v-model="selectedCDNG"
								:isDisabled="isFacilityDisabled()"/>
							<div class="disabled-select" v-if="isFacilityDisabled()"></div>
						</div>
						<!-- <div data-value @click="showFacilitiesSearchModal">
								<input type="text" v-model="selectedFacility" placeholder="Искать" disabled>
								<div class="disabled-select" v-if="isFacilityDisabled()"></div>
						</div> -->
					</div>
					<div class="add-task-content-data-field" data-field>
						<div data-name>Месторождение:</div>
						<div data-value>
							<dp-combobox-component
								:options="chooseField()"
								v-model="selectedField"
								:isDisabled="isFacilityDisabled()"/>
							<div class="disabled-select" v-if="isFacilityDisabled()"></div>
						</div>
					</div>
				</div>
				<div class="add-task-content-data">
					<div class="add-task-content-data-field" data-field>
						<div data-name>Куст:</div>
						<div data-value>
							<dp-combobox-component
								:options="chooseCluster()"
								v-model="selectedCluster"
								:isDisabled="isFacilityDisabled()"/>
							<div class="disabled-select" v-if="isFacilityDisabled()"></div>
						</div>
					</div>
					<div class="add-task-content-data-field" data-field>
						<div data-name>Скважина:</div>
						<div data-value>
							<dp-combobox-component
								:options="chooseWell()"
								v-model="selectedWell"
								:isDisabled="isFacilityDisabled()"/>
							<div class="disabled-select" v-if="isWellDisabled()"></div>
						</div>
					</div>
				</div>
				<div class="add-task-content-data" v-if="!isFacilityDisabled()">
					<!--          <div class="add-task-content-data-field" data-field>-->
					<!--          </div>-->
					<div class="add-task-content-data-field" data-field>
						<div data-name>Выбранные скважины:</div>
						<textarea v-model="selectedFacilities"
						          style="height: 30px; width: 530px; resize: none; color: white"
						          disabled="true"></textarea>
						<div @click="clearFacilities()"
						     style="height: 30px; background-color: #2296f3; border-radius: 2px; line-height: 28px; padding: 0 10px; margin: 0 0 0 10px; cursor: pointer">
							Очистить
						</div>
					</div>
				</div>
				<div class="add-task-content-data" id="insert">
					<div class="add-task-content-data-field" data-field>
						<div data-name>Бригада:</div>
						<div data-value>
							<!-- <dp-combobox-component
									:options="dictionariesData.brigades"
									v-model="task.brigadeId"/> -->
							<dp-combobox-component
								:options="chooseBrigade()"
								v-model="selectedBrigade"/>
						</div>
					</div>
					<div class="add-task-content-data-field" data-field>
						<div data-name>Смена:<span class="requiredField">*</span></div>
						<div data-value>
							<select v-model="task.shift">   <!-- TODO: перевести на справочник -->
								<option :value="1">Смена 1</option>
								<option :value="2">Смена 2</option>
							</select>
						</div>
					</div>
				</div>
				<div class="add-task-content-data">
					<div class="add-task-content-data-field" data-field>
						<div data-name>Техника:</div>
						<div data-value>
							<dp-combobox-component
								:options="dictionariesData.mechanism"
								v-model="task.mechanismId"
								textField="model"/>
						</div>
					</div>
					<div class="add-task-content-data-field" data-field>
						<div data-name>Блочное оборудование:</div>
						<div data-value>
							<dp-combobox-component
								:options="dictionariesData.blockEquipments"
								v-model="task.blockEquipmentId"/>
						</div>
					</div>
				</div>
				<div class="add-task-content-data border">
					<div class="add-task-content-data-field" data-field>
						<div data-name>Периодичность:<span class="requiredField">*</span></div>
						<div data-value>
							<select v-model="task.periodic" :disabled="!isEmpty(editTask)">
								<option :value="1" :selected="true">
									Одноразовая
								</option>
								<option :value="2">
									Многоразовая
								</option>
							</select>
							<div class="disabled-select" v-if="!isEmpty(editTask)"></div>
						</div>
					</div>
					<div class="add-task-content-data-field-from"
					     :class="{'specialWidth': task.periodic === 2 }">
						<span v-if="task.periodic === 1" class="name-field">
							Дата выполнения:
						<span class="requiredField">*</span></span>
						<span v-else class="name-field-specialWidth">Период с: </span>
						<date-picker-component
							:attachQuery="false"
							v-model="dateFrom"
							:minDate="minDate"
						/>
					</div>
					<div class="add-task-content-data-field-to" v-if="task.periodic === 2 ">
						<div data-name class="specialWidth">по:</div>
						<date-picker-component
							:attachQuery="false"
							v-model="dateTo"
							:date="dateTo"
							:minDate="minDate"
						/>
					</div>
				</div>
				<div class="add-task-content-data-periodic">
					<div v-if="task.periodic === 2 " class="add-task-content-data-field" data-field>
						<div data-name>Режим повтора:</div>
						<div data-value>
							<select v-model="periodValue">
								<option :value="undefined" disabled :selected="!periodValue">
									Выберите значение
								</option>
								<option v-for="(i, index) in periodicType"
								        v-bind:key="index" :value="i.id">
									{{ i.name }}
								</option>
							</select>
						</div>
					</div>
					<div class="add-task-content-data-periodic-field-checkAll"
					     v-if="(task.periodic === 2 && (periodValue === 1 || periodValue === 2))">
						<label for="add-task-content-data-periodic-all">Выбрать все</label>
						<input type="checkbox" id="add-task-content-data-periodic-all" v-model="selectAllState"
						       @change="selectAll($event.target.checked)">
					</div>
					<div v-if="task.periodic === 2 "
					     class="add-task-content-data-periodic-field-dates interval"
					     data-field>
						<div v-if="periodValue === 0">
							<span>Повторять каждый</span>
							<input class="add-task-content-data-periodic-field-dates-day"
							       type="number" max="31"
							       @change="checkAndSetInterval($event.target)">
							<span>день</span>
						</div>
						<div class="add-task-content-data-periodic-field-dates week"
						     v-if="periodValue === 1">
							<div v-for="(day, index) in weekDay"
							     v-bind:key="index"
							     class="add-task-content-data-periodic-field-dates-week">
								<label :for="`add-task-content-data-periodic-${day.classSuffix}`">
									{{ day.name }}
								</label>
								<input type="checkbox"
								       :id="`add-task-content-data-periodic-${day.classSuffix}`"
								       name="month"
								       :value="day.id"
								       v-model="task.weekDays">
							</div>
						</div>
						<div class="add-task-content-data-periodic-field-dates year" v-if="periodValue === 2">
							<div v-for="(month, index) in yearMonth"
							     v-bind:key="index"
							     class="add-task-content-data-periodic-field-dates-month">
								<label :for="`add-task-content-data-periodic-${month.classSuffix}`">
									{{ month.name }}
								</label>
								<input type="checkbox"
								       :id="`add-task-content-data-periodic-${month.classSuffix}`"
								       name="month"
								       :value="month.id"
								       v-model="task.months">
							</div>
							<div class="monthDays">
								<label class="day" v-for="(day, index) in monthDays"
								       v-bind:key="index"
								       :for="`day-${day}`"
								       :class="{'filled': task.monthDays.indexOf(day) > -1}">
									{{ day }}
									<input :id="`day-${day}`"
									       type="checkbox"
									       :value="day"
									       v-model="task.monthDays">
								</label>
							</div>
						</div>
					</div>
				</div>
				<PerformanceCriterionsComponent
					ref="PerformanceCriterionsComponent"
					:setCriterionValues="setCriterionValues"
					:criterionOptions="criterionOptions"
					:task="task"
					:editTask="editTask"
					:loadingMaskHandler="loadingMaskHandler">
				</PerformanceCriterionsComponent>
				<performance-criterions-component-table
					:task="task"
					:tasksCriterions="tasksCriterions"
				>
				</performance-criterions-component-table>
				<div class="add-task-content-data">
					<div class="add-task-content-data-textarea">
						<label for="add-task-content-data-textarea-comment" data-name>Комментарий к отчёту:</label>
						<textarea id="add-task-content-data-textarea-comment"
						          class="add-task-content-data-textarea-comment"
						          v-model="task.comment">
						</textarea>
					</div>
				</div>
			</template>
		</dp-modal>
	</div>
</template>

<script>

import { mapActions, mapGetters, mapState, Store } from 'vuex';
import DpComboboxComponent from '../common/dp-combobox-component.vue';
import globalMethods from '../../mixins/global-methods';
import apiTasks from '../../api/Tasks/tasks';
import apiBrigades from '../../api/BrigadeInFacilities/brigadeInFacilities';
import apiSops from '../../api/SOPs/sops';
import apiFiles from '../../api/Files/files';
import searchFacilitiesModal from './search-facilities-modal-test.vue';
import DatePickerComponent from '../common/date-picker-component.vue';
import PerformanceCriterionsComponent from './performanceCriterionsComponent.vue';
import PerformanceCriterionsComponentTable from './PerformanceCriterionsComponentTable.vue';
import LoadingMaskComponent from '../common/loading-mask-component.vue';

export default {
	name: 'add-task-form',
	components: {
		DpComboboxComponent,
		DatePickerComponent,
		PerformanceCriterionsComponent,
		PerformanceCriterionsComponentTable,
		LoadingMaskComponent,
	},
	mixins: [globalMethods],
	props: ['editTask', 'date', 'buttonAction'],
	data() {
		return {

			// activeTab : 0,
			task: {
				name: '',
				groupId: undefined,
				executionDate: undefined,
				priority: 1,
				soPs: [],
				taskCategoryId: undefined,
				facilityId: undefined,
				facilityIds: [],
				brigadeId: undefined,
				shift: 1,
				mechanismId: undefined,
				blockEquipmentId: undefined,
				periodic: 1,
				from: undefined,
				to: new Date().toISOString()
					.substr(0, 10),
				lastMonthDay: undefined,
				interval: undefined,
				monthDays: [],
				authorLogin: undefined,
				author: undefined,
				type: 0,
				weekDays: [],
				months: [],
				values: [],
				comment: '',
				toDoDate: undefined,
				executorId: undefined,
				state: undefined,
				isCheck: undefined,
				remarklast: undefined,
				planTaskId: undefined,
				uploadMeasureState: undefined,
			},
			monthDays: [],
			dateFrom: undefined,
			dateTo: new Date().toISOString().substr(0, 10),
			selectAllState: false,
			selectedCDNG: this.$store.state.storage.selectedCDNG,
			selectedField: this.$store.state.storage.selectedField,
			selectedCluster: undefined,
			selectedWell: undefined,
			selectedBrigade: this.$store.state.storage.selectedBrigade,
			// selectedFacility: undefined,
			selectedFacilities: [],
			wells: [],
			filteredWells: [],
			sopToAdd: undefined,
			minDate: undefined,
			periodValue: undefined,
			criterionOptions: {
				files: [],
			},
			loadMaskIsActive: false,
			toDisable: undefined,
			tasksCriterions: {},
		};
	},
	watch: {
		sopToAdd(n) {
			// if (this.isEmpty(this.editTask)) {
			this.setSop(n);
			// }
		},
		dateFrom(n) {
			this.dateTo = n;
		},
		periodValue() {
			this.setSelectAllToFalse();
		},
		selectedCDNG() {

			if (!this.isFacilityDisabled()) {
				this.setFieldValue(['selectedCDNG', this.selectedCDNG]);
				this.selectedField = undefined;
				this.selectedCluster = undefined;
				this.selectedWell = undefined;
				this.selectedBrigade = undefined;
				this.clearFacilities();
			}

			// if (!this.isFacilityDisabled()
			//     && this.selectedCluster === undefined
			//     && this.selectedWell === undefined) {
			//   this.task.facilityId = this.selectedCDNG;
			// }
		},
		selectedField() {

			if (!this.isFacilityDisabled()) {
				this.setFieldValue(['selectedField', this.selectedField]);
				this.selectedCluster = undefined;
				this.selectedWell = undefined;
				this.clearFacilities();
			}
		},
		selectedCluster() {
			if (!this.isFacilityDisabled()) {
				this.selectedWell = undefined;
				this.clearFacilities();
			}
			// if (!this.isFacilityDisabled()
			//     && this.selectedCDNG !== undefined
			//     && this.selectedWell === undefined) {
			//   this.task.facilityId = this.selectedCluster;
			// }
		},
		selectedWell() {
			if (!this.isFacilityDisabled()) {
				// this.task.facilityId = this.selectedWell;
				let well;
				if (this.selectedFacilities.length == this.wells.length) {
					this.toDisable = true;
					this.selectedWell = DpComboboxComponent.placeholderProps;
					return;
				}
				if (this.selectedWell == '0') {
					for (let i = 0; i < this.wells.length; i++) {
						well = this.dictionariesData.facilities.find(item => this.wells[i].id == item.id);
						this.selectedFacilities.push(' ' + well.name.trim()
							.toString());
						this.task.facilityIds.push(well.id);
					}
					this.toDisable = true;
					this.selectedWell = DpComboboxComponent.placeholderProps;
					return;
					// this.filteredWells = [];
					// this.filteredWells.push({ id: -1, name: 'Выбраны все скважины' });
					// } else if (this.selectedWell == '-1') {
					//   return;
				} else if (this.selectedWell == DpComboboxComponent.placeholderProps) {
					return;
				} else {
					well = this.dictionariesData.facilities.find(item => this.selectedWell == item.id);
					this.selectedFacilities.push(' ' + well.name.trim()
						.toString());
					this.task.facilityIds.push(well.id);
				}
				if (this.filteredWells.length == 0) {
					this.filteredWells = this.wells.filter(f => f.id != well.id);
				} else {
					const filteredWellsTemp = this.filteredWells.filter(f => f.id != well.id);
					this.filteredWells = filteredWellsTemp.map(item => item);
				}
				this.selectedWell = DpComboboxComponent.placeholderProps;
			}
		},
		selectedBrigade() {

			if (!this.isFacilityDisabled()) {
				this.setFieldValue(['selectedBrigade', this.selectedBrigade]);
				this.task.brigadeId = this.selectedBrigade;
			}
		},
		// selectedFacility() {
		//   if (!this.isFacilityDisabled()) {
		//     this.task.facilityId = this.selectedFacility;
		//   }
		// },
	},
	computed: {
		...mapGetters('task', ['periodicType', 'yearMonth', 'weekDay']),
		...mapGetters('dict', ['dictionariesData', 'brigadesAll', 'brigadesActive']),
	},
	methods:
		{
			...mapActions('dict', ['loadAllDict']),
			...mapActions('storage', ['setFieldValue']),
			clearFacilities() {
				this.selectedFacilities = [];
				this.filteredWells = [];
				this.toDisable = false;
				this.task.facilityIds = [];
			},
			setEditTask() {
				const keys = Object.keys(this.task);
				keys.forEach((item) => {
					// eslint-disable-next-line no-prototype-builtins
					if (this.editTask.hasOwnProperty(item) && this.editTask[item]) {
						this.task[item] = this.editTask[item];
					}
				});
				this.task.id = this.editTask.id;
				this.task.createDate = this.editTask.createDate;
			},
			async setSop(id) {
				const sopCriterions = await apiSops.getById(id);
				const sops = {
					sop: sopCriterions,
					sopId: id,
				};

				if (this.task.id) {
					sops.taskId = this.task.id;
				}

				if (this.task.soPs.length > 0) {
					this.task.soPs.shift();
					this.task.soPs.push(sops);
				} else {
					this.task.soPs.push(sops);
				}

				if (this.$root.isEmpty(this.editTask)) {
					this.replaceNameBySopName();
				}

				this.$refs.PerformanceCriterionsComponent.setValuesToSop();
			},
			replaceNameBySopName() {
				const decription = this.task.soPs[0].sop.number;
				if (decription) {
					this.task.name = decription;
				}
			},
			async setBrigadeId(facility) {
				const brigadeId = await apiBrigades.getBrigadeId(facility.id);

				if (!this.isEmpty(brigadeId)) {
					this.task.brigadeId = brigadeId;
				} else {
					this.task.brigadeId = undefined;
				}
			},
			isSopDisabled() {
				return !this.isEmpty(this.editTask) && this.task.soPs.length > 0;
			},
			isFacilityDisabled() {
				return !this.isEmpty(this.editTask) && !!this.task.facilityId;
			},
			isWellDisabled() {
				if (this.toDisable) return true;
				return !this.isEmpty(this.editTask) && !!this.task.facilityId;
			},
			setSelectAllToFalse() {
				if (this.task.months.length > 0 && this.periodValue === 1) {
					this.selectAllState = false;
					this.task.months = [];
				} else if (this.task.weekDays.length > 0 && this.periodValue === 2) {
					this.selectAllState = false;
					this.task.weekDays = [];
				}
			},
			selectAll(event) {
				const allYear = 12;
				const allWeek = 6;

				const lengthNum = this.periodValue === 1 ? allWeek : allYear;
				const start = this.periodValue === 1 ? 0 : 1;
				if (event) {
					for (let i = start; i <= lengthNum; i++) {
						if (lengthNum > 6) {
							this.task.months.push(i);
						} else {
							this.task.weekDays.push(i);
						}
					}
				} else if (lengthNum > 6) {
					this.task.months = [];
				} else {
					this.task.weekDays = [];
				}
			},
			async createRequestBody() {
				const me = this;

				if (me.task.periodic === 2) {
					delete me.task.executionDate;
					me.task.from = me.dateFrom;
					me.task.to = me.dateTo;
					me.task.type = me.periodValue;
					me.task.taskCategoryId = parseInt(me.task.taskCategoryId, 10);
					me.task.sopIds = me.task.soPs.map(item => parseInt(item.sopId, 10));
					me.task.interval = me.task.interval ? me.task.interval : 0;
					me.task.lastMonthDay = false;
					delete me.task.soPs;
					if (me.isEmpty(me.task.facilityIds)) {
						if (me.selectedCluster == undefined) {
							me.task.facilityIds.push(parseInt(me.selectedCDNG, 10));
						} else {
							me.task.facilityIds.push(parseInt(me.selectedCluster, 10));
						}
					}
				} else {
					me.task.toDoDate = me.dateFrom;
					if (me.isEmpty(me.task.facilityIds)) {
						if (me.selectedCluster == undefined) {
							me.task.facilityIds.push(parseInt(me.selectedCDNG, 10));
						} else {
							me.task.facilityIds.push(parseInt(me.selectedCluster, 10));
						}
					}
				}
			},
			closeForm() {
				this.$emit('close');
			},
			setMinDateForTaskCreate() {
				const yesterday = new Date();
				yesterday.setDate(yesterday.getDate() - 1);
				this.minDate = yesterday.toISOString()
					.substring(0, 10);
			},
			checkAndSetInterval(target) {
				const interval = target.value > 0 && target.value <= 31;
				this.task.interval = interval ? target.value : this.$root.showModalError({
					errorMessage: {
						title: 'Ошибка',
						message: 'Задан неверный интервал',
					},
				});
			},
			loadingMaskHandler(status) {
				this.loadMaskIsActive = status;
			},
			createMonthDays() {
				const maxAmount = 31;
				for (let i = 1; i <= maxAmount; i++) {
					this.monthDays.push(i);
				}
			},
			chooseCDNG() {
				// if (!this.isFacilityDisabled()) {
				const me = this;
				const CDNGs = me.dictionariesData.facilities.filter(f => f.parentId == null);
				CDNGs.sort(this.sortFacilities);
				return CDNGs;
				// }
				// return this.dictionariesData.facilities;
			},
			chooseField() {
				// if (!this.isFacilityDisabled()) {
				const me = this;
				if (typeof me.selectedCDNG == 'undefined') return [];
				const clusters = me.dictionariesData.facilities.filter(f => f.parentId == me.selectedCDNG);
				const clusters_fields = clusters.map(function (item) {
					if (item.field !== null) return item.field.name;
				});
				const uniq_fields = clusters_fields.filter(function (item, pos) {
					return clusters_fields.indexOf(item) == pos;
				});
				uniq_fields.sort();
				uniq_fields.forEach((element) => {
					if (element == null) uniq_fields.pop();
				});
				const fields = [];
				uniq_fields.forEach((element) => {
					const id = me.dictionariesData.facilities.find(function (e) {
						if (e.field !== null && e.field.name == element) return e.field.id;
					});
					fields.push({
						id: id.field.id,
						name: element
					});
				});
				return fields;
				// }
			},
			chooseCluster() {
				// if (!this.isFacilityDisabled()){
				const me = this;
				if (typeof me.selectedField == 'undefined') return [];
				const field_clusters = me.dictionariesData.facilities.filter(f => f.parentId == me.selectedCDNG
					&& f.field !== null
					&& f.field.id == me.selectedField);
				return field_clusters.sort(this.sortFacilities);
				// }
			},
			chooseWell() {
				// if (!this.isFacilityDisabled()) {
				const me = this;
				if (typeof me.selectedCluster == 'undefined') return [];
				let wells = me.dictionariesData.facilities.filter(f => f.parentId == me.selectedCluster);
				this.wells = wells.map(item => item);
				if (this.filteredWells.length > 0) {
					wells = this.filteredWells.map(item => item);
					return wells.sort(this.sortFacilities);
				}
				if (wells.length != 0) {
					const all = {
						id: 0,
						name: 'Выбрать все скважины'
					};
					wells.sort(this.sortFacilities);
					wells.unshift(all);
					return wells;
				}
				// return wells = [];
				// } else return wells = [this.task.facilityId];
			},
			chooseBrigade() {
				const me = this;

				if (typeof me.selectedCDNG == 'undefined') {
					return [];
				}

				const CDNGname = me.unitedCDNG();

				if (typeof me.task.id != 'undefined') {
					return me.brigadesAll;
				} else {
					return me.brigadesActive;
				}

			},
			unitedCDNG() {
				const me = this;
				let CDNG = [];
				switch (true) {
					case me.selectedCDNG == 1 || me.selectedCDNG == 6:
						CDNG = me.dictionariesData.facilities.filter(f => f.id == 1 || f.id == 6);
						break;
					case me.selectedCDNG == 7609 || me.selectedCDNG == 7612 || me.selectedCDNG == 7682:
						CDNG = me.dictionariesData.facilities.filter(f => f.id == 7609 || f.id == 7612 || f.id == 7682);
						break;
					case me.selectedCDNG == 7640 || me.selectedCDNG == 7642:
						CDNG = me.dictionariesData.facilities.filter(f => f.id == 7640 || f.id == 7642);
						break;
					case me.selectedCDNG == 23 || me.selectedCDNG == 26:
						CDNG = me.dictionariesData.facilities.filter(f => f.id == 23 || f.id == 26);
						break;
					case me.selectedCDNG == 7614 || me.selectedCDNG == 7647:
						CDNG = me.dictionariesData.facilities.filter(f => f.id == 7614 || f.id == 7647);
						break;
					default:
						CDNG = me.dictionariesData.facilities.filter(f => f.id == me.selectedCDNG);
						break;
				}
				return CDNG.map(function (item) {
					return item.name;
				});
			},
			sortFacilities(a, b) {
				if (a.name < b.name) {
					return -1;
				}
				if (a.name > b.name) {
					return 1;
				}
				return 0;
			},
			showFacilitiesSearchModal() {
				if (!this.isFacilityDisabled()) {
					const me = this;

					me.$modal.show(searchFacilitiesModal,
						{
							facilities: me.dictionariesData.facilities,
							initialValue: me.task.facilityId,
							valueUpdated: (newValue) => {
								me.task.facilityId = newValue.id;
								me.selectedFacility = newValue.name;
								me.setBrigadeId(newValue);
							},
						}, {
							height: 'auto',
							width: '600px',
							clickToClose: false,
						});
				}
			},
			sendFile(data) {
				return new Promise((resolve) => {
					const response = apiFiles.post(data);
					resolve(response);
				});
			},
			returnFileId(data) {
				// eslint-disable-next-line no-shadow
				return this.sendFile(data)
					.then(data => data);
			},
			async sendFilesToServer() {
				if (!this.validateTaskFields()) {
					return;
				}

				if (this.criterionOptions.files.length > 0) {
					this.loadingMaskHandler(true);

					for (let i = 0, len = this.criterionOptions.files.length; i < len; i++) {
						const requestBody = {
							name: this.criterionOptions.files[i].file.name,
							content: this.criterionOptions.files[i].content,
						};
						// eslint-disable-next-line no-await-in-loop
						const fileId = await this.returnFileId(requestBody);
						this.setCriterionValues(this.criterionOptions.files[i].criterionId,
							this.criterionOptions.files[i].sopId, fileId.toString());
					}
					this.loadingMaskHandler(false);
				}
				this.save();
			},
			setCriterionValues(criterionId, sopId, value) {
				if (this.task.values) {
					const idExist = this.task.values.find((item, index) => {
						if (item.criterionId === criterionId) {
							this.task.values[index].index = index;
							// eslint-disable-next-line no-param-reassign
							item.index = index;
							return true;
						}
						return false;
					});

					if (!idExist) {
						this.task.values.push({
							taskId: !this.$root.isEmpty(this.editTask) ? this.editTask.id : undefined,
							sopId,
							criterionId,
							value,
						});
					} else {
						this.task.values.splice(idExist.index, 1, {
							taskId: !this.$root.isEmpty(this.editTask) ? this.editTask.id : undefined,
							sopId,
							criterionId,
							value,
						});
					}
				}
			},
			validateTaskFields() {
				let title = '';
				let message = '';
				let isError = false;

				if (!this.task.name) {
					title = 'Ошибка';
					message = 'Поле "Название" обязательно к заполнению';
					isError = true;
				}

				// if (this.isEmpty(this.task.facilityIds)) {
				// 	title = 'Ошибка';
				// 	message = 'Поле "ЦДНГ" обязательно к заполнению';
				// 	isError = true;
				// }

				if (this.selectedCDNG == undefined) {
					title = 'Ошибка';
					message = 'Поле "ЦДНГ" обязательно к заполнению';
					isError = true;
				}

				if (!this.task.taskCategoryId) {
					title = 'Ошибка';
					message = 'Поле "Категория" обязательно к заполнению';
					isError = true;
				}

				if (!this.task.soPs.length > 0) {
					title = 'Ошибка';
					message = 'Поле "Тип" обязательно к заполнению';
					isError = true;
				}

				if (isError) {
					this.$root.showModalError({
						errorMessage: {
							title,
							message,
						},
					});
					return false;
				}
				return true;
			},
			async save() {

				const me = this;
				let response;

				if (me.task.periodic === 1) {
					me.createRequestBody();
					if (me.editTask) {
						response = await apiTasks.put(me.task.id, me.task);
					} else {
						response = await apiTasks.post(me.task);
					}

					if (response.errorMessage) {
						me.$root.showModalError(response);
					} else {
						this.buttonAction('save');
						me.$emit('close');
					}
				} else {
					this.createRequestBody();
					try {
						await apiTasks.postPlanTasks(me.task);
						this.buttonAction('save');
						me.$emit('close');
					} catch (error) {
						console.warn(error);
					}
				}

        // Save Criterions
        let _list = [];
        for (let key in me.tasksCriterions) {
          let data = key.split('-');
          _list.push({
            taskId: data[0],
            sOPId: data[1],
            criterionId: data[2],
            value: me.tasksCriterions[key]
          });
        }
        if (_list.length > 0) response = await apiTasks.saveCriterions(_list);

			},
			async loadFile(id) {
				await this.$root.downloadFile(id);
			},
			// editTaskFillFacilities() {
			//   this.selectedCDNG = this.editTask.facility.parent.parent.name;
			// }
		},
	created() {

		this.setMinDateForTaskCreate();
		this.loadAllDict();

		this.$on('save', () => {
			this.sendFilesToServer();
		});

		this.createMonthDays();

		const me = this;

		if (me.date) {
			me.dateFrom = me.date;
		} else {
			me.dateFrom = new Date().toISOString()
				.substr(0, 10);
		}

		if (!me.isEmpty(me.editTask)) {

			me.setEditTask();

			if (me.editTask.brigadeId != null) {
				me.selectedBrigade = me.editTask.brigadeId;
			}

			if (me.editTask.toDoDate && me.editTask.toDoDate.length > 0) {
				me.dateFrom = me.editTask.toDoDate.substr(0, 10);
			} else {
				me.dateFrom = new Date().toISOString()
					.substr(0, 10);
			}

			if (me.editTask.soPs.length > 0) {
				me.sopToAdd = me.editTask.soPs[0].sopId;
			}
			// eslint-disable-next-line array-callback-return
			const facility = me.dictionariesData.facilities.find(item => me.task.facilityId === item.id);
			if (me.editTask.facility.parent == null) {
				me.selectedCDNG = me.editTask.facility.id;
			} else {
				if (me.editTask.facility.parent.parent == null) {
					me.selectedCDNG = me.editTask.facility.parentId;
					me.selectedField = me.editTask.facility.field.id;
					me.selectedCluster = me.editTask.facility.id;
				} else {
					me.selectedCDNG = me.editTask.facility.parent.parentId;
					me.selectedField = me.editTask.facility.field.id;
					me.selectedCluster = me.editTask.facility.parentId;
					me.selectedWell = me.editTask.facility.id;
				}
			}
			//me.selectedFacility = facility.name;
			//me.editTaskFillFacilities();
		} else if (me.date) {
			me.dateFrom = me.date;
		} else {
			me.dateFrom = new Date().toISOString().substr(0, 10);
		}
	}
};
</script>

<style lang="scss">
@import "../../assets/styles/main";

.add-task {
	position: relative;
	width: 100%;
	/*max-height: 80vh;*/
	background-color: $form-background-color;
	color: $text-color-01;
	z-index: 1000;
	overflow: auto;

	.requiredField {
		color: red;
	}

	&-header {
		margin: 0 $default-margin;
		border-bottom: solid 1px $line-color;
		position: relative;
		top: 0;
		left: 0;
		right: 0;

		span {
			text-transform: uppercase;
		}

		&-close {
			position: absolute;
			top: $default-margin;
			cursor: pointer;
		}

		button {
			@extend %button;
			margin: 0 30px;
		}
	}

	&-content {
		position: relative;
		margin: 80px $default-margin;
		max-height: 90%;
		overflow: hidden;

		&-data {
			display: flex;


			.disabled-select {
				position: absolute;
				width: 100%;
				height: 30px;
				top: 0;
				left: 0;
				background-color: rgba(255, 255, 255, 0.2);
			}

			&-field {
				div[data-value] {
					position: relative;
				}

				&-from {
					flex: 0 0 200px;
					display: flex;
					flex-direction: row;
					align-items: center;

					.date-picker {
						margin-left: 0;

						.v-input__slot {
							background-color: #16334c !important;
							width: 185px;
						}
					}

					&.specialWidth {
						margin-left: 10px;

						.date-picker {
							margin-left: 0;

							.v-input__slot {
								background-color: #16334c !important;
								width: 120px;
							}
						}
					}

					.name-field {
						flex: 0 0 174px;
						padding: 0 10px;

						&-specialWidth {
							flex: 0 0 90px;
						}
					}

				}

				&-to {
					display: flex;
					flex-direction: row;
					flex: 0 0 40px;
					flex-wrap: nowrap;
					align-items: center;

					div[data-name] {
						flex: 0 0 50px;
						text-align: right;
						padding: 0 10px;
					}

					label[data-name] {
						flex: 0 0 50px;
						text-align: right;
						padding: 0 10px;
					}

					.date-picker {
						margin-left: 0;

						.v-input__slot {
							background-color: #16334c !important;
							width: 120px;
						}
					}
				}

				&-priority {
					position: relative;
					display: flex;
					flex-direction: row;
					flex-wrap: nowrap;
					justify-content: flex-start;
					align-items: center;

					label {
						margin: 0 15px 0 15px;
					}
				}
			}
		}

		&-data.border {
			border: solid 1px $line-color;
			border-bottom: none;
			padding-top: 5px;
		}

		&-data-periodic {
			position: relative;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			border: solid 1px $line-color;
			border-top: none;
			padding-bottom: 5px;
			margin-bottom: 10px;

			&-field-checkAll {
				display: flex;
				flex-direction: row;
				justify-content: flex-end;
				align-items: center;
				width: 355px;

				input {
					margin-left: 10px;
				}
			}

			&-field-dates {
				width: 750px;
				display: flex;
				justify-content: space-between;
				padding-left: 5px;

				&.interval {
					span:first-child {
						padding-right: 15px;
					}

					span:last-child {
						padding-left: 15px;
					}
				}

				&.week {
					justify-content: space-around;
				}

				&-week {
					display: flex;
					flex-direction: row;
					align-items: center;

					label {
						margin-right: 5px;
					}

					input {
						margin-right: 5px;
					}
				}

				&-day {
					width: 50px !important;
				}

				&-month {
					display: flex;
					flex-direction: row;
					align-items: center;

					label {
						margin-right: 5px;
					}

					input {
						margin-right: 10px;
					}
				}

				& .year {
					flex-wrap: wrap;

					.monthDays {
						display: flex;
						flex-direction: row;
						justify-content: center;
						padding-top: 5px;

						& .day {
							border: 1px solid #ffffff;
							padding: 2px 4px;

							input {
								position: absolute;
								opacity: 0;
							}

							&.filled {
								background-color: #a8aeb4;
								color: #0f426b;
							}
						}
					}
				}
			}
		}

		&-data-textarea {
			width: 100%;
			display: flex;
			padding: 0 0 10px 10px;

			label[data-name] {
				width: 107px;
				margin-top: 20px;
			}

			textarea {
				width: 84%;
				height: 70px;
				margin-left: 25px;
				margin-top: 20px;
			}
		}
	}

	&-footer {
		padding: 20px;
		display: flex;
		position: absolute;
		bottom: 0;

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

div[data-field] {
	display: flex;
	flex: 0 0 355px;
	flex-direction: row;
	flex-wrap: nowrap;
	align-items: center;
	margin: 5px 0;

	div[data-name] {
		flex: 0 0 175px;
		padding: 0 10px;
	}

	label[data-name] {
		flex: 0 0 150px;
		padding: 0 10px;
	}

	div[data-value] {
		flex: 0 0 185px;

		input {
			width: 100%;
		}

		select {
			width: 100%;
		}
	}
}

</style>
