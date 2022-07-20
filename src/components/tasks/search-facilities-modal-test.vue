<template>
	<div class="search-facilities">
		<div class="search-facilities-header">
			<span>Выберите объект</span>
			<div class="search-facilities-header-close" @click="close()"></div>
		</div>

		<input
			type="text"
			maxlength="50"
			@input="searchFacilities($event.target.value)">

		<v-radio-group
			class="radioGroup"
			v-model="value"
			row>
			<v-radio
				class="radioButton"
				v-for="(item, index) in resultOnPage"
				:key="index"
				dark
				:label="getFacilityName(item)"
				:value="item"
				:ripple="false">
			</v-radio>			
		</v-radio-group>
		<div class="search-facilities-control-container">
			<v-pagination
				class="facilitiesPagination"
				v-model="page"
				:length="pages"
				:total-visible="5"
				color="#1e90ea">
			</v-pagination>
			<v-btn
				class="saveBtn"
			   @click="save"
				dark
				color="#1e90ea">
				Сохранить
			</v-btn>
		</div>
	</div>

</template>

<script>
    export default {
        name: 'search-facilities-modal',
        props:
            {
                facilities: { type: Array, required: true, default: () => [] },
                initialValue: { default: undefined },
                valueUpdated: { type: Function, default: undefined },
            },
        data() {
            return {
                resultOnPage: [],
                searchResult: undefined,
				value: undefined,
				pages: undefined,
				page: 1,
				itemsOnPage: 40,
				cdngs: []
            };
        },
        watch:
            {
				searchResult(newVal) {
					this.pages = Math.round(newVal.length / this.itemsOnPage) - 1;
					this.resultOnPage = newVal.slice(0, this.itemsOnPage);
				},
				page(newVal) {
                    const start = (newVal - 1) * this.itemsOnPage;
                    const end = newVal * this.itemsOnPage;
                    this.resultOnPage = this.searchResult.slice(start, end);
                },
            },
		created() {
			this.cdngs = this.facilities.filter(fs => fs.parentId == null);
			this.resultOnPage = this.facilities.slice(0, this.itemsOnPage);
            this.searchResult = this.facilities;
			this.pages = Math.round(this.facilities.length / this.itemsOnPage) - 1;
		},
        methods:
            {
                close() {
					this.$emit('close');
                },
                save() {
                    if (this.value) {
                        this.valueUpdated(this.value);
                        this.$emit('close');
                    } else {
	                    // eslint-disable-next-line no-alert
						alert('Не выбрано ни одного значения');
                    }
                },
                searchFacilities(val) {
                    if (val.length >= 1) {
                        const result = this.facilities.filter(
							item => item.name.toLowerCase().indexOf(val.toLowerCase()) > -1,
                        );
                        this.searchResult = result.sort((a, b) => a.name.localeCompare(b.name));
                    } else {
                        this.searchResult = this.facilities;
                    }
                },
				getFacilityName(item) {
					return item.field ? `${item.name} (${item.field.name})` : item.name;
				},
            },
    };
</script>

<style scoped lang="scss">
	/*@import "../../assets/styles/main";*/

	.search-facilities {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		background-color: #0d304b;
		/*font-family: "DIN Condensed";*/

		&-header{
			text-align: center;
			margin: auto;
			padding: 10px 5px 5px;
			color: white;
			width: 100%;
			position: relative;
			span {
				font-size: 15px;
				text-transform: uppercase;
			}
			&-close{
				position: absolute;
				right: 15px;
				top: 15px;
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
		input {
			margin: 10px auto 10px auto;
			width: 50%;
			background-color: #0d304b;
			border: 1px solid #1e90ea;
			color: white;
		}
		.v-input--radio-group {
			width: 90%;
			margin: auto;
			padding-left: 50px;

			.v-input--radio-group__input {
				display: flex;
				flex-direction: column;
				flex-wrap: wrap;
				width: 80%;

				.radioButton {
					width: 140px;
					margin: 5px;
				}
			}
		}
		&-control-container {
			display: flex;
			flex-direction: row;
			justify-content: space-around;
			.saveBtn {
				background-color: #1e90ea;
				margin: 5px 40px 10px 0;
				width: 150px;
			}

			.facilitiesPagination {
				margin: 0 0 15px 10px;

				.v-pagination__item {
					background-color: #1f8ae0 !important;
				}
			}
		}

	}
</style>
