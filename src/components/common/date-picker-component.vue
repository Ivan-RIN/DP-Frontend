<template>
	<div class="date-picker" data-app>
		<v-menu
			class="data-picker-menu"
			v-model="menu"
			:close-on-content-click="false"
			dark
			min-width="100px"
			color="#10548a"
			offset-x
			:attach="attachQuery"
		>
			<template v-slot:activator="{ on }">
				<v-text-field
						class="date-picker-textField"
						v-model="dateFormatted"
						:height="30"
						:hide-details="true"
						dark
						readonly
						v-on="on"
				>
					<template v-slot:append>
						<img src="../../assets/images/cal.svg" alt="">
					</template>
				</v-text-field>
			</template>
			<v-date-picker
					v-model="value"
					@input="setDate"
					:min="minDate"
					header-color="#10548a"
					:first-day-of-week="1"
					locale="ru-RU"
					no-title>
			</v-date-picker>
		</v-menu>
	</div>
</template>

<script>
    export default {
        name: 'date-picker-component',
		props: {
            date: {
                default: new Date().toISOString().substr(0, 10),
            },
			minDate: {
                default: undefined,
            },
			attachQuery: {
                default: '.date-picker',
			},
		},
        data(vm) {
            return {
                dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
                menu: false,
				value: undefined,
            };
        },
        watch: {
            date() {
                this.value = this.date;
			},
            value() {
                this.dateFormatted = this.formatDate(this.value);
            },
        },
		created() {
			this.value = this.date;
		},
        methods: {
            formatDate(date) {
                if (!date) return null;

                const [year, month, day] = date.split('-');
                return `${day}.${month}.${year}`;
            },
			setDate() {
                this.menu = !this.menu;
                this.$emit('setDateFromPicker', this.value);
                this.$emit('input', this.value);
			},
        },
    };
</script>

<style lang="scss">
	.date-picker
	{
		height: 30px;
		display: flex;
		flex-direction: row;
		align-content: center;
		width: 120px;
		margin: 0 5px 0 5px;
		padding-top: 0;
		&-textField {
			padding-top: 0 !important;
			margin-top:  0 !important;
			width: 120px;
			.v-input__control{
				width: 120px;
			}

			.v-input__slot {
				border: 1px solid #10548a;
				border-radius: 5px;
				padding: 5px;
				height: 30px;
				width: 120px;

				&:before {
					border: none !important;
				}
				&:after {
					border: none !important;
				}

				.v-text-field__slot input {
					height: 30px;
					min-height: 10px;
					font-size: 12px;
					border: none !important;
					background-color: transparent !important;
				}
				.v-input__append-inner {
					padding: 1px;
					margin: 0;
					cursor: pointer;
					img {
						position: relative;
						top: -4px;
						left: 5px;
					}
				}
			}
		}
		.v-menu__content{
			border: 1px solid #10548a;
			.v-date-picker-table {
				background-color: #042740;
				th{
					padding: 0;
				}
			}
			.v-date-picker-header {
				padding: 0 16px 0 16px;
				background-color: #0d304b;
			}
			.v-date-picker-years {
				background-color: #0d304b;
			}
		}
	}
</style>
