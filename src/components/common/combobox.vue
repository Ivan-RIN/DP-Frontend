<template>
	<div class="combobox">
		<v-menu offset-y attach=".combobox">
			<template v-slot:activator="{ on }">
				<v-btn
					class="combobox-btn"
					v-on="on"
					:height="30"
				>
					<div v-if="color !== 'transparent'" data-status :style="{'background-color': color }"></div>
					{{value}}
				</v-btn>
			</template>
			<v-list class="combobox-list"
					:dense="true"
					dark>
				<v-list-item
						v-for="(item, index) in options"
						:key="index"
						@click="selectItem($event.target.dataset)"
						:data-value="item.id"
				>
					<v-list-item-title :data-value="item.id">
						<div data-status :data-value="item.id" :style="{'background-color': item.color}"></div>
						{{ item.name }}
					</v-list-item-title>
				</v-list-item>
			</v-list>
		</v-menu>
	</div>
</template>
<script>
	export default {
	    name: 'combobox-component',
		props: {
	        options: { type: Array },
		},
	    data() {
	        return {
	            defaultValue: 'Выберите значение',
                defaultColor: 'transparent',
                value: undefined,
				color: undefined,
			};
		},

		created() {
	        this.value = this.defaultValue;
	        this.color = this.defaultColor;
        },
		methods: {
	        setDefault() {
				this.value = this.defaultValue;
				this.color = this.defaultColor;
			},
            selectItem(val) {
                this.options.some((item) => {
                    if (item.id.toString() === val.value) {
                        this.value = item.name;
                        this.color = item.color;						
                        return true;
					}
				});
                this.$emit('input', val.value);
			},
		},
    };
</script>
<style scoped lang="scss">
	@import "../../assets/styles/main";
	.combobox{
		margin: 0 5px 0 5px;
		font-family: 'DIN-Pro-regular',serif;
		text-decoration: none !important;
		transform: none !important;

		&-btn {
			background-color: #0d304b !important;
			border: 1px solid #10548a;
			color: white;
			text-transform: none;
			width: 170px;
			font-size: 12px;
			text-align: right;
			letter-spacing: normal;
		}
		div[data-status]
		{
			border-radius: 50%;
			width: 12px;
			height: 12px;
			margin-right: 5px;
			background-color: white;
		}
		&-list{
			background-color: #0d304b !important;
			border: 1px solid #1f8ae0;
			border-radius: 4px;
			.v-list-item{
				position: relative;
				margin: 0 0 0 25px;
				padding: 0;
				min-height: 26px;
				.v-list-item-title{
					position: relative;
					font-size: 12px !important;
					font-weight: 400 !important;
					line-height: normal !important;
					margin-left: 10px;
					width: auto;
				}
				div[data-status]
				{
					position: absolute;
					top: 8px;
					left: -17px;
					border-radius: 50%;
					width: 12px;
					height: 12px;
					background-color: white;
				}
			}
		}

	}

</style>
