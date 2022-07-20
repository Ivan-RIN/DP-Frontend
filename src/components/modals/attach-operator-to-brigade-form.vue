<template>
	<div v-if="$can('read', 'AttachOperators')" class="attach-operator">
		<div class="attach-operator-header">
			<div class="attach-operator-header-title">Закрепление операторов за бригадами</div>
			<div class="attach-operator-header-close" @click="close()"></div>
		</div>
		<hr class="divider">
		<div class="attach-operator-body">
			<div class="attach-operator-body-row">
				<div class="attach-operator-body-row-item">
					<label style="margin: 0 0 10px 130px">Оператор:</label>
					<select
						class="attach-operator-body-row-item-select"
						v-model="fieldOperatorsValue">
						<option :value="undefined" disabled :selected="!fieldOperatorsValue">
							Выберите значение</option>
						<option
							v-for="(operators, index) in dictionariesData.operators"
							v-bind:key="index"
							:value="operators.id">
              {{operators.name}}
            </option>
					</select>
				</div>
				<div class="attach-operator-body-row-item">
					<label style="margin: 0 0 10px 130px">Бригада:</label>
					<div class="attach-operator-body-row-item-container">
            <select
                class="attach-operator-body-row-item-select"
                :disabled="fieldBrigadesStatus"
                v-model="fieldBrigadesValue">
              <option :value="undefined" disabled :selected="!fieldBrigadesValue">Выберите значение</option>
              <option
                  v-for="(brigade, index) in filterBrigades()"
                  v-bind:key="index"
                  :value="brigade.id">
                {{brigade.name}}
              </option>
            </select>
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
              <v-btn class="attach-operator-body-row-item-add-operator"
                     @click="addOperatorToBrigade"
                     height="25"
                     width="20"
                     min-width="20"
                     min-height="20"
                     v-bind="attrs"
                     v-on="on">
                <img src="../../assets/images/pin.svg" alt="Прикрепить оператора">
              </v-btn>
              </template>
              <span>Нажмите, чтобы закрепить оператора за бригадой</span>
            </v-tooltip>
					</div>
				</div>
<!--        <div class="attach-operator-body-row-item-content">-->
<!--				</div>-->
			</div>
      <div class="attach-operator-body-message">
        <span v-html="message"></span><br>
      </div>
		</div>
		<hr class="divider">
		<div class="attach-operator-footer">
			<button class="button" @click="close()">Завершить</button>
		</div>
	</div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import apiOperators from '../../api/OperatorInBrigades/operatorInBrigades';
    import globalMethods from '../../mixins/global-methods';
    // import operatorInBrigades from "../../api/OperatorInBrigades/operatorInBrigades";

    export default {
      name: 'attach-operator-to-brigade-form',
      mixins: [globalMethods],
      data() {
        return {
          fieldBrigadesStatus: true,
          fieldOperatorsValue: undefined,
          fieldBrigadesValue: undefined,
          selectedOperator: undefined,
          selectedBrigade: undefined,
          operatorInBrigade: {
            operatorId: undefined,
            brigadeId: undefined,
          },
          responseBrigade: undefined,
          defaultMessage: 'Сначала выберите оператора, потом бригаду',
          message: '',
          attached: false,
			  };
      },
      watch: {
        fieldOperatorsValue() {
          this.fieldBrigadesStatus = false;
          this.selectedOperator = this.dictionariesData.operators.find(op => op.id === this.fieldOperatorsValue);
          if (this.fieldBrigadesValue !== undefined) {
            this.setMessage();
          }
          this.operatorInBrigade.operatorId = this.selectedOperator.id;
          this.checkOperator();
        },
        fieldBrigadesValue() {
          this.selectedBrigade = this.dictionariesData.brigades.find(br => br.id === this.fieldBrigadesValue);
          this.operatorInBrigade.brigadeId = this.selectedBrigade.id;
          if (this.responseBrigade === this.fieldBrigadesValue) {
            this.attached = true;
          }
          this.setMessage();
        },
      },
      computed: {
        ...mapGetters('dict', ['dictionariesData']),
      },
      created() {
        this.message = this.defaultMessage;
        this.filterBrigades();
      },
      methods: {
        filterBrigades() {
          const CDNGs = [];
          this.dictionariesData.facilityDivided.productionFacility.forEach(pf => CDNGs.push(pf.name));
          const brigades = this.dictionariesData.brigades.filter(b => CDNGs.some(s => b.name.includes(`(${s})`)));
          return brigades.sort(this.sortBrigades);
        },
        sortBrigades(a, b) {
          if (a.deptId < b.deptId) {
            return -1;
          }
          if (a.deptId > b.deptId) {
            return 1;
          }
          return 0;
        },
        setMessage() {
          if (this.attached) {
            this.message = `Оператор <span style="color: chartreuse">
                          ${this.selectedOperator.name.trim().toString()}</span> уже закреплен
                          <br>за бригадой <span style="color: chartreuse">
                          ${this.selectedBrigade.name.trim().toString()}</span>`;
          } else {
            this.message = `Вы собираетесь закрепить оператора <span style="color: deepskyblue">
                          ${this.selectedOperator.name.trim().toString()}</span>
                          <br>за бригадой <span style="color: deepskyblue">
                          ${this.selectedBrigade.name.trim().toString()}</span> ?`;
          }
          this.attached = false;
        },
        close() {
          this.$emit('close');
			  },
        async addOperatorToBrigade() {
          if (!this.fieldOperatorsValue || !this.fieldBrigadesValue) {
            this.$root.showModalError({
              errorMessage: {
                title: 'Ошибка',
                message: 'Должны быть выбраны оператор и бригада',
              },
            });
          } else {
            const response = await apiOperators.post(this.operatorInBrigade);
            if (response === 'Operator already attached') {
              this.$root.showModalError({
                errorMessage: {
                  title: 'Закрепить оператора не удалось',
                  message: 'Оператор уже закреплен за бригадой',
                },
              });
            } else if (response === 'Successfully attached') {
              this.$root.showModalError({
                errorMessage: {
                  title: 'Успешно',
                  message: 'Оператор успешно закреплен за бригадой',
                  icon: 'okLogo',
                },
              });
              this.attached = true;
              this.responseBrigade = this.selectedBrigade.id;
              this.setMessage();
            }
          }
        },
        async checkOperator() {
          const response = await apiOperators.getOperator(this.fieldOperatorsValue);
          if (response === 'Not found') {
            return;
          } else {
            // const operator = this.dictionariesData.operators.find(op => op.id === response.operatorId);
            // const brigade = this.dictionariesData.brigades.find(br => br.id === response.brigadeId);
            this.responseBrigade = response.brigadeId;
            this.fieldBrigadesValue = response.brigadeId;
            this.attached = true;
          }
        },
      },
    };
</script>

<style scoped lang="scss">
	@import "../../assets/styles/main";

	.attach-operator{
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
					&-container{
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						align-items: center;
					}
					&-select {
						width: 90%;
					}
					&-add-operator.v-btn {
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
      &-message {
        text-align: center;
        padding-top: 20px;
        font-size: 1.2em;
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
