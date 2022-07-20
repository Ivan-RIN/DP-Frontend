<template>
    <div class="reports-filter">
        <div class="reports-filter-item">
            <label for="reports-filter-item-operator">Оператор</label>
            <select name="operator" id="reports-filter-item-operator" v-model="operator">
                <option :value="undefined" disabled :selected="!operator">Выберите значение</option>
                <option v-for="(operator, index) in filteredCollection.operators"
                        v-bind:key="index"
                        :value="operator.id">
                    {{ operator.name }}
                </option>
            </select>
            <div class="reports-filter-item-clear-field"
                 @click="clearField($event.target)"
                 data-fieldName="operator">
            </div>
        </div>
        <div class="reports-filter-item">
            <label for="reports-filter-item-brigade">Бригада</label>
            <select name="operator" id="reports-filter-item-brigade" v-model="brigade">
                <option :value="undefined" disabled :selected="!brigade">Выберите значение</option>
                <option v-for="(brigade, index) in filteredCollection.brigades"
                        v-bind:key="index"
                        :value="brigade.id">
                    {{ brigade.name}}
                </option>
            </select>
            <div class="reports-filter-item-clear-field"
                 @click="clearField($event.target)"
                 data-fieldName="brigade">
            </div>
        </div>
        <div class="reports-filter-item">
            <label for="reports-filter-item-department">Цех</label>
            <select name="operator" id="reports-filter-item-department" v-model="department">
                <option :value="undefined" disabled :selected="!department">Выберите значение</option>
                <option v-for="(department, index) in filteredCollection.departments"
                        v-bind:key="index"
                        :value="department.id">
                    {{ department.name}}
                </option>
            </select>
            <div class="reports-filter-item-clear-field"
                 @click="clearField($event.target)"
                 data-fieldName="department">
            </div>
        </div>
        <div class="reports-filter-date-container">
            <div class="reports-filter-date-container-items">
                <div class="reports-filter-date-container-item">
                    <DatePickerComponent v-model="dateFrom"
                        :date="dateFrom">
                    </DatePickerComponent>
                </div>
                <div class="reports-filter-date-container-item">
                    <DatePickerComponent v-model="dateTo">
                    </DatePickerComponent>
                </div>
            </div>
            <div class="reports-filter-date-container-periods">
                <div :class="['reports-filter-date-container-periods-period', {'active': isMonthsClicked }]"
                     @click="setThreeMonthsPeriod">3 месяца</div>
                <div :class="['reports-filter-date-container-periods-period', {'active': isYearClicked }]"
                     @click="setHalfYearPeriod">Полгода</div>
            </div>
        </div>
        <div class="reports-filter-buttons-container">
            <div class="reports-filter-buttons-container-search">
                <button class="button" @click="search">Сформировать</button>
                <div class="reports-filter-buttons-container-search-clear-filter" @click="clearFields">
                    Сбросить все
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	import { mapActions, mapGetters } from 'vuex';
	import DatePickerComponent from '../common/date-picker-component.vue';

	export default {
        name: 'reportFilterComponent',
        components: { DatePickerComponent },
        created() {
            const me = this;

	        me.sortAndCollectDictData();
	        me.firstDayOfMonth = me.monthFirstDay(new Date()).toISOString().substring(0, 10);
	        me.dateFrom = me.firstDayOfMonth;
	        me.dateTo = new Date().toISOString().substring(0, 10);
	        me.search({
                dateFrom: me.dateFrom,
		        dateTo: me.dateTo,
	        });
        },
        data() {
            return {
                operator: undefined,
                brigade: undefined,
                department: undefined,
                dateFrom: undefined,
                dateTo: undefined,
                isMonthsClicked: false,
                isYearClicked: false,
                firstDayOfMonth: undefined,
                filteredCollection: {
	                operators: [],
	                departments: [],
	                btigades: [],
                },
            };
        },
        watch: {
            operator(n) {
                this.$store.commit('reports/setReportFilterOperator', n);
            },
            brigade(n) {
                this.$store.commit('reports/setReportFilterBrigade', n);
            },
            department(n) {
                this.$store.commit('reports/setReportFilterDepartment', n);
            },
            dateFrom(n) {
                this.$store.commit('reports/setReportFilterDateFrom', n);
            },
            dateTo(n) {
                this.$store.commit('reports/setReportFilterDateTo', n);
            },
        },
        computed: {
            ...mapGetters('dict', ['dictionariesData']),
        },
        methods: {
	        ...mapActions('reports', ['setFilterDefault']),
	        monthFirstDay(d) {
		        d.setDate(1);
		        return d;
	        },
            sortAndCollectDictData() {
                const filter = this.filteredCollection;
                const dict = this.dictionariesData;
	            filter.operators = dict.operators.sort((a, b) => a.name.localeCompare(b.name));
	            filter.brigades = dict.brigades.sort((a, b) => a.name.localeCompare(b.name));
	            filter.departments = dict.departments.sort((a, b) => a.name.localeCompare(b.name));
            },
            clearField(target) {
                this[target.dataset.fieldname] = undefined;
            },
	        setThreeMonthsPeriod() {
		        const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
		        const date = this.getDate();
		        const year = date[0].toString();
		        const month = months[date[1] - 5];
		        const day = date[2];
		        this.dateFrom = new Date(year, month, day).toISOString().substring(0, 10);
		        this.isMonthsClicked = true;
		        this.isYearClicked = false;
            },
	        setHalfYearPeriod() {
                const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
		        const date = this.getDate();
		        const year = date[0].toString();
		        const month = months[date[1] - 8];
		        const day = date[2];
		        this.dateFrom = new Date(year, month, day).toISOString().substring(0, 10);
		        this.isMonthsClicked = false;
		        this.isYearClicked = true;
            },
            getDate() {
	            const date = new Date().toISOString().substring(0, 10);
	            return date.split('-').map(item => parseInt(item, 10));
            },
            search(filter) {
                this.$emit('reportSearch', filter);
            },
            clearFields() {
	            this.setFilterDefault();
                this.$store.commit('reports/setReportFilterDateFrom', this.firstDayOfMonth);
                this.$store.commit('reports/setReportFilterDateTo', new Date().toISOString().substring(0, 10));
                this.operator = undefined;
                this.department = undefined;
                this.brigade = undefined;
                this.dateFrom = this.firstDayOfMonth;
                this.dateTo = new Date().toISOString().substring(0, 10);
	            this.isMonthsClicked = false;
                this.isYearClicked = false;
	            this.search({
		            dateFrom: this.dateFrom,
		            dateTo: this.dateTo,
	            });
            },
        },
    };
</script>


<style lang="scss">
    @import "../../assets/styles/main";

    .reports-filter {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-content: center;
        background-color: #0d304b;
        border-radius: 5px;
        margin: 20px 0;
        padding: 15px 20px 15px 20px;
        &-item {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            &-clear-field {
                position: relative;
                &:after {
                    content: "";
                    background-image: url("../../assets/images/cross.svg");
                    background-repeat: no-repeat;
                    position: absolute;
                    top: 2px;
                    right: -30px;
                    height: 24px;
                    width: 25px;
                }
            }
            label {
                margin-top: 5px;
                margin-right: 10px;
            }
            select {
                width: 170px;
            }
        }
        &-date-container{
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            &-items {
                display: flex;
                flex-direction: row;
            }
            &-periods {
                display: flex;
                flex-direction: row;
                justify-content: space-around;
                &-period {
                    border-bottom: 1px dashed #0E4268;
                    border-radius: 5px;
                    margin-top: 4px;
                    padding: 1px 7px;
                    cursor: pointer;
                    font-size: 14px;
                    color: #2296f3;

                    &:nth-child(2) {
                        margin-left: 10px;
                    }

                    &.active {
                        background-color: #0E4268;
                        border: 1px solid #0E4268;
                    }
                }
            }
        }
        &-buttons-container{
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            align-items: flex-start;
            padding-top: 5px;

            &-search {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                margin-left: 20px;
                .button {
                    height: 26px;
                }

                &-clear-filter{
                    width: 100%;
                    text-align: center;
                    font-size: 14px;
                    margin: 10px 0 0 10px;
                    cursor: pointer;
                    position: relative;
                    color: #2296f3;
                    text-decoration: underline;
                    &:after{
                        content: "";
                        background-image: url("../../assets/images/cross.svg");
                        background-repeat: no-repeat;
                        position: absolute;
                        top: -3px;
                        left: -10px;
                        height: 24px;
                        width: 24px;
                    }
                }
            }
        }
    }
</style>
