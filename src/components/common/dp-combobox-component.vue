<template>
	<!--<select v-model="value" @input="inputChange($event.target.value)">-->
	<select :class="{'select-component': !value}"
	        :value="value"
	        @change="inputChange($event.target.value)"
	        :multiple="multiple"
	        :disabled="isDisabled">
		<option class="grey-option" :value="undefined" disabled :selected="!value">{{placeholderProps}}</option>
        <option v-if="isAll" :value="0">Все</option>
		<option
				v-for="(option, index) in this.options"
				:key="index"
				:value="option[valueField]"
				:selected="selectedItem(option[valueField])">{{option[textField]}}</option>
	</select>
</template>

<script>
	export default {
		name: 'dp-combobox-component',
		props:
			{
				// eslint-disable-next-line vue/require-valid-default-prop
				options: { type: Array, required: true, default() { return []; } },
				textField: { type: String, default: 'name' },
				valueField: { type: String, default: 'id' },
				placeholderProps: { type: String, default: 'Выберите значение' },
				value: undefined,
				multiple: { type: Boolean, default: false },
				isDisabled: { type: Boolean, default: false },
                isAll: { type: Boolean, default: false }
			},
		data() {
			return {
				model: this.value,
			};
		},
		methods:
			{
				inputChange(value) {
					this.$emit('input', value);
				},
				selectedItem(itemOption) {
					if (!this.value) {
						return false;
					}

					if (this.multiple) {
						return this.value && this.value.findIndex(e => itemOption[this.valueField] === e) >= 0;
					}

					return itemOption[this.valueField] === this.value;
				},
			},
	};
</script>

<style lang="scss">
	@import "../../assets/styles/main";

	.select-component {
		color: darkgrey !important;
	}

</style>
