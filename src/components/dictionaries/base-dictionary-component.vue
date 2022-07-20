<template>
	<div class="base-dictionary">
		<div class="base-dictionary-header">
			<div class="base-dictionary-header-title">СПРАВОЧНИК&nbsp;/&nbsp;{{currDict.name}}</div>
			<div
					class="base-dictionary-header-add"
					@click="openAddDictForm()"
			>
				<div>✚</div>
				Добавить</div>
		</div>
		<div class="line"></div>
		<div class="base-dictionary-content">
			<table>
				<thead>
					<tr>
						<template v-for="(column, index) in currDict.description.columns">
							<template v-if="column.visible">
								<th v-bind:key="index">
									{{column.displayName}}
								</th>
							</template>
						</template>
					</tr>
					<tr>
						<template v-for="(column, index) in currDict.description.columns">
							<template v-if="column.visible">
								<th v-bind:key="index">
									<div><input type="text" @input="filter($event.target.value, column)"/>
										<search-icon class="search"/>
									</div>
								</th>
							</template>
						</template>
					</tr>
				</thead>
				<tbody>
					<template v-for="(dictItem, index) in dictDataFilter">
						<tr v-bind:key="index" class="dict-row" v-on:click="openAddDictForm(dictItem)">
							<template v-for="(column, indexColumn) in currDict.description.columns">
								<template v-if="column.visible">
									<td v-bind:key="indexColumn">
										{{ getItem(column, dictItem) }}
									</td>
								</template>
							</template>
						</tr>
					</template>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex';
	import addBaseDictionary from './add-base-dictionary-component.vue';
	import searchIcon from '../common/search-icon-component.vue';
	import api from '../../api/dictionaries-api';

	export default {
		name: 'base-dictionary-component',
		data() {
			return {
				currentDictionary: {},
				dictData: [],
				dictDataFilter: [],
				filterData: {},
			};
		},
		components: { searchIcon },
		props:
		[
			'currentDictionaryId',
		],
		computed:
		{
			...mapGetters('dict', ['dictionaryList', 'dictionariesData']),
			currDict() {
				let dict = this.dictionaryList.find(d => d.id === this.currentDictionaryId);
				if (!dict) {
					dict = {};
				}
				return dict;
			},
		},
		watch:
		{
			currDict() {
				this.loadData();
			},
		},
		methods:
		{
			...mapActions('dict', ['loadAllDict']),
			openAddDictForm(item = null) {
				const props = {
						currDict: this.currDict,
						dictItem: item,
					};
				const event = {
						closed: () => {
							this.loadData();
						},
					};
				this.$modal.show(addBaseDictionary, props, { height: 'auto' }, event);
			},
			async loadData() {
				this.dictData = await api.get(this.currDict.description.apiAddress);
				this.filteringData();
			},
			getItem(column, dictItem) {
				if (column.referenceDictionary) {
					return this.referenceData(dictItem, column);
				}

				if (column.fieldName === 'criterions' && dictItem[column.fieldName]
						&& dictItem[column.fieldName].length > 0) {
					let dataStr = '';

					dictItem[column.fieldName].forEach((item) => {
						if (item.criterion && item.criterion.name) {
							dataStr += `${ item.criterion.name }, `;
						}
					});
					return dataStr;
				}
				return dictItem[column.fieldName];
			},
			filter(value, column) {
				if (column) {
					this.filterData[column.fieldName] = value;
				}
				this.filteringData();
			},

			filteringData() {
				this.dictDataFilter = this.dictData.filter((e) => {
					for (let i = 0; i < this.currDict.description.columns.length; i++) {
						const d = this.currDict.description.columns[i];
						if (this.filterData[d.fieldName]) {
							const field = this.filterData[d.fieldName].toString().toUpperCase();
							if (!e[d.fieldName]) return false;
							if (e[d.fieldName].toString().toUpperCase().indexOf(field) < 0) {
								return false;
							}
						}
					}
					return true;
				});
			},

			referenceData(dictItem, column) {
				const dictonary = this.dictionariesData[column.referenceDictionary];

				const dictFieldValue = dictItem[column.fieldName]
						? dictItem[column.fieldName] : dictItem[column.fieldName];
				// TODO Fix not strict eqeqeq
				// eslint-disable-next-line eqeqeq
				const item = dictonary.find(x => x[column.referencePKField] == dictFieldValue);
				if (!item) return '';

				return item[column.referenceDisplayField];
			},
		},
		mounted() {
			this.loadAllDict();
			this.loadData();
		},
	};
</script>

<style scoped lang="scss">
	@import "../../assets/styles/main";

	table, th, td {
		border: 0 solid white;
		border-spacing:0;
	}

	.base-dictionary
	{
		position: relative;

		&-header
		{
			position: relative;
			height: 60px;
			&-title {
			    padding-top: 10px;
				font-size: 1.17em;
				font-weight: bold;
			}

			&-add
			{
				@extend %button-add;
				position: absolute;
				right: 0;
				bottom: 0;
			}
		}

		&-content
		{
			overflow-x: auto;
			width: 100%;
			padding-bottom: 20px;

			table
			{
				width: 100%;

				thead
				{
					tr:nth-child(2)
					{
						background-color: $content-background-color;
						overflow: hidden;
						border-radius: 5px;
						th
						{
							padding: 8px;
							position: relative;
							input
							{
								height: 20px;
								font-size: 10px;
								padding: 0 0 0 8px;
								cursor: pointer;
								width: 98%;
							}
							.search{
								position: absolute;
								width: 15px;
								height: 15px;
								right: 15px;
								top: 10px;
							}
						}

						th:first-child
						{
							border-radius: 5px 0 0 0;
						}
						th:last-child
						{
							border-radius: 0 5px 0 0;
						}
					}
				}
				tbody
				{
					tr
					{
						background-color: $content-background-color;
						padding: 0 20px;
						td
						{
							min-width: 100px;
							padding: 8px;
							border-bottom: solid 1px $line-color;
						}
					}

					tr:last-child
					{
						overflow: hidden;
						border-radius: 5px;
						td:first-child
						{
							border-radius: 0 0 0 5px;
						}
						td:last-child
						{
							border-radius: 0 0 5px 0;
						}
						td
						{
							border-bottom: solid 0;
						}
					}
				}
			}
		}
	}

	.dict-row
	{
		cursor: pointer;
	}
</style>
