<template>
	<div v-if="$can('read', 'AttachFacilities')" class="attach-brigade" >
		<div class="attach-brigade-header">
			<div class="attach-brigade-header-title">Закрепление кустовых площадок по бригадам</div>
			<div class="attach-brigade-header-close" @click="close()"></div>
		</div>
		<hr class="divider">
		<div class="attach-brigade-body">
			<div class="attach-brigade-body-row">
				<div class="attach-brigade-body-row-item">
					<label
						for="attach-brigade-body-row-item-select-department"
						class="attach-brigade-body-row-item-title">Цех:</label>
					<select
						id="attach-brigade-body-row-item-select-department"
						name="department"
						class="attach-brigade-body-row-item-select"
						required
						:disabled="fieldDepartmentStatus"
						v-model="fieldDepartmentValue">
						<option :value="undefined" disabled :selected="!fieldDepartmentValue" >
							Выберите значение</option>
						<option
							v-for="(productionFacility, index) in dictionariesData.facilityDivided.productionFacility"
							v-bind:key="index"
							:value="productionFacility.id">{{productionFacility.name}}</option>
					</select>
				</div>
				<div class="attach-brigade-body-row-item">
					<label
						for="attach-brigade-body-row-item-select-facility"
						class="attach-brigade-body-row-item-title">Куст:</label>
					<div class="attach-brigade-body-row-item-container">
						<select
							id="attach-brigade-body-row-item-select-facility"
							name="facility"
							class="attach-brigade-body-row-item-select"
							:disabled="fieldFacilityStatus"
							v-model="fieldFacilityValue">
							<option v-if="!fieldFacilityValue"
								:value="undefined"
								disabled
								:selected="!fieldFacilityValue">
								Выберите значение</option>
							<option v-for="(wellCluster, index) in facilities"
							        v-bind:key="index"
							        :value="wellCluster.id">
								{{wellCluster.name}}</option>
						</select>
						<v-btn class="attach-brigade-body-row-item-add-facility"
						       @click="addFacilityToBrigade"
						       height="25"
						       width="20"
						       min-width="20"
						       min-height="20">
							<img src="../../assets/images/pin.svg" alt="Прикрепить куст">
						</v-btn>
					</div>
				</div>
			</div>


			<div class="attach-brigade-body-row">
				<div class="attach-brigade-body-row-item">
					<label
						for="attach-brigade-body-row-item-select-field"
						class="attach-brigade-body-row-item-title">Месторождение:</label>
					<input
						type="text"
						id="attach-brigade-body-row-item-select-field"
						name="field"
						class="attach-brigade-body-row-item-select"
						required
						:disabled="fieldFieldStatus"
						v-model="fieldFieldValue"
						:placeholder="fieldFieldValue">
					<div class="attach-brigade-body-row-item-content">
						<div
							v-if="facilitiesInBrigade.length > 0"
							v-for="(facilityInBrigade, index) in facilitiesInBrigade"
							@mouseover="showHint($event)"
							@mouseleave="hideHint($event)"
							class="facilityInBrigade"
							v-bind:key="index"
							:data-parent="getParent(facilityInBrigade)"
							:data-fieldname="getField(facilityInBrigade)"
						>
								{{facilityInBrigade.facility.name}}
							<span
								:data-facilityId="facilityInBrigade.facility.id"
								@click="deleteFacilityFromBrigade($event.target.dataset)"
								class="delete-facility"/>
						</div>
						<div class="attach-brigade-body-row-item-content-hint"
							 v-if="hintIsVisible">
							<div>{{hint.facility}}</div>
							<div>{{hint.productionField}}</div>
							<div>{{hint.wellCluster}}</div>
						</div>
					</div>
				</div>

				<div class="attach-brigade-body-row-item">
					<label
						for="attach-brigade-body-row-item-select-brigade"
						class="attach-brigade-body-row-item-title">Бригада:</label>
					<select
						id="attach-brigade-body-row-item-select-brigade"
						name="brigade"
						class="attach-brigade-body-row-item-select"
						v-model="fieldBrigadeValue">
						<option :value="undefined" disabled :selected="!fieldBrigadeValue" >Выберите значение</option>
						<option v-for="(brigade, index) in dictionariesData.brigades"
								v-bind:key="index"
								:value="brigade.id">
							{{brigade.name}}
						</option>
					</select>
					<div class="attach-brigade-body-row-item-content">

					</div>
				</div>
			</div>
		</div>
		<hr class="divider">
		<div class="attach-brigade-footer">
			<button class="button" @click="close()">Завершить</button>
		</div>
	</div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import apiBrigades from '../../api/BrigadeInFacilities/brigadeInFacilities';
    import globalMethods from '../../mixins/global-methods';


    export default {
      mixins: [globalMethods],
      data() {
        return {
          fieldFieldStatus: true,
          fieldDepartmentStatus: false,
          fieldFacilityStatus: true,
          fieldBrigadeStatus: true,
          // ///////////////////////////////
          fieldFieldValue: undefined,
          fieldDepartmentValue: undefined,
          fieldFacilityValue: undefined,
          fieldBrigadeValue: undefined,
          // ///////////////////////////////
          facilities: [],
          facilitiesInBrigade: [],
				  brigade: [],
				  hintIsVisible: false,
				  hintPos: {
					top: 0,
					left: 0,
				  },
				  hint: {
            facility: '',
            productionField: '',
            wellCluster: '',
          },
			  };
      },
      watch: {
        facilitiesInBrigade: {
          deep: true,
				  handler() {
            if (!this.facilitiesInBrigade.length > 0) {
              this.hintIsVisible = false;
					  }
				  },
			  },
        fieldDepartmentValue(n) {
          if (n) {
            this.fieldFacilityStatus = false;
          }
          this.facilities = this.getWellClusters(n).sort((a, b) => a.name.localeCompare(b.name));
        },
        fieldFacilityValue(n) {
          // eslint-disable-next-line array-callback-return
          this.facilities.filter((item) => {
            if (item.id === n) {
              this.fieldFieldValue = item.field.name;
            }
          });
			  },
        fieldBrigadeValue(n) {
          this.getBrigadeFacilities(n);
			  },
      },
      computed: {
        ...mapGetters('dict', ['dictionariesData']),
      },
      created() {
      },
		  mounted() {
		  },
      methods: {
        close() {
          this.$emit('close');
			  },
        save() {
          this.$emit('save');
        },
			  async getBrigadeFacilities(id) {
          const facilitiesInBrigade = await apiBrigades.get(id);
          const { productionFacility } = this.dictionariesData.facilityDivided;
          facilitiesInBrigade.map((item) => {
            // eslint-disable-next-line no-param-reassign,array-callback-return
            item.facility.parent = productionFacility.find(
              itemProd => itemProd.id === item.facility.parentId,
            );
            return item;
				  });
				  this.facilitiesInBrigade = facilitiesInBrigade;
			  },
			  async addFacilityToBrigade() {
          const response = await apiBrigades.post({
            facilityId: this.fieldFacilityValue,
            brigadeId: this.fieldBrigadeValue,
          });

          if (response.errorMessage) {
						this.$root.showModalError(response);
          } else {
						this.getBrigadeFacilities(this.fieldBrigadeValue);
					}
			  },
        async deleteFacilityFromBrigade(facility) {
          const response = await apiBrigades.delete(this.fieldBrigadeValue, facility.facilityid);
          if (response.errorMessage) {
            this.$root.showModalError(response);
          } else {
            this.getBrigadeFacilities(this.fieldBrigadeValue);
          }
        },
        getWellClusters(id) {
          return this.dictionariesData.facilityDivided.wellCluster.filter(item => item.parentId === id);
        },
        getParent(data) {
          if (!this.isEmpty(data.facility.parent)) {
            return data.facility.parent.name;
          }
          return '';
        },
        getField(data) {
          if (!this.isEmpty(data.facility.field)) {
            return data.facility.field.name;
          }
          return '';
        },
        showHint(event) {
          if (!this.hintIsVisible && event.target.className.indexOf('facilityInBrigade') > -1) {
            this.hintIsVisible = true;
            this.hintPos.top = 150;
            this.hintPos.left = 0;
            this.hint.wellCluster = event.target.dataset.parent;
            this.hint.productionField = event.target.dataset.fieldname;
            this.hint.facility = event.target.textContent;
          }
			  },
        hideHint(event) {
          if (!event.target.className.indexOf('facilityInBrigade') > -1) {
					  this.hintIsVisible = false;
          }
        },
      },
    };
</script>

<style scoped lang="scss">
	@import "../../assets/styles/main";

	.attach-brigade{
		display: flex;
		flex-direction: column;
		background-color: #0E4268;
		color: white;
		height: 100%;
		justify-content: center;
		padding: 0 20px 0 20px;
		.divider {
			border-color: #10548a;
		}
		&-header{
			padding: 10px;
			height: 10%;
			text-transform: uppercase;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			&-close
			{
				position: relative;
				height: 18px;
				width: 18px;
				cursor: pointer;
				&:after{
					content: "";
					background-image: url("../../assets/images/cross.svg");
					background-repeat: no-repeat;
					position: absolute;
					top: 0;
					right: 0;
					height: 24px;
					width: 24px;
				}
			}
		}
		&-body {
			display: flex;
			flex-direction: column;
			height: 80%;
			&-row {
				display: flex;
				flex-direction: row;
				justify-content: space-around;
				margin: 10px;
				&-item {
					display: flex;
					flex-direction: column;
					justify-content: left;
					width: 50%;
					&--container{
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						align-items: center;
					}
					&-select {
						width: 90%;
					}
					&-content {
						position: relative;
						display: flex;
						flex-direction: row;
						flex-wrap: wrap;
						padding-top: 10px;
						&-hint{
							background-color: #a8aeb4;
							position: absolute;
							top: 20px;
							right: -150px;
							z-index: 999;
							width: 150px;
							height: 100px;
							font-size: 11px;
							padding: 10px 0 0 10px;
							color: #0d304b;
							border-radius: 5px;
							div {
								margin-bottom: 10px;
							}
						}
						.facilityInBrigade {
							position: relative;
							width: 110px;
							border: 1px solid #105e8f;
							background-color: #105e8f;
							border-radius: 10px;
							font-size: 12px;
							padding: 0 10px 0 10px;
							margin: 0 3px 3px 0;
							.delete-facility {
								position: absolute;
								right: 0;
								top: 0;
								cursor: pointer;

								&:after {
									content: "";
									background-image: url("../../assets/images/cross.svg");
									background-repeat: no-repeat;
									position: absolute;
									top: -5px;
									right: 0;
									height: 24px;
									width: 24px;
								}
							}
						}
					}
					&-add-facility.v-btn {
						position: relative;
						color: white;
						background-color: #2296f3 !important;
						margin-left: 5px;
						margin-top: -2px;
						img{
							width: 10px;
							height: auto;
						}
					}
				}
			}
		}
		&-footer{
			display: flex;
			height: 10%;
			padding: 10px;
			text-align: right;
			justify-content: flex-end;
			align-items: center;
			.v-btn {
				color: white;
				background-color: #2296f3 !important;
				margin-left: 5px;
				text-transform: none;
			}
		}
	}


</style>
