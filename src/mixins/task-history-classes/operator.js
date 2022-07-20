/* eslint-disable */
import historyBaseClass from './historyBaseClass';

export default class Brigades extends historyBaseClass {
	super(changedItem, dictionaries, taskStatus) {
		this.item = changedItem;
		this.dictionaries = dictionaries;
		this.taskStatus = taskStatus;
	}
	
	getChanges() {
		const newObject = JSON.parse(this.item.newObject);
		let values = [];
		
		values.push({
			title: '',
			value: this.checkUserAction()
		});
		
		if(this.item.changedProperties && this.item.changedProperties.length > 0) {
			
			for (let i = 0, len = this.item.changedProperties.length; i < len; i++ ) {
				let item = this.item.changedProperties[i];
				let value = newObject[item];
				
				if (item === 'Id') {
					value = newObject[item];
				}
				if (item === 'Name') {
					value = newObject[item];
				}
				if (item === 'Email') {
					value = newObject[item];
				}
				if (item === 'Login') {
					value = newObject[item];
				}
				if (item === 'IsActive') {
					value = newObject[item] ? 'Пользователь активен': 'Пользователь не активен';
				}
				if (value !== 'null' && value != null && value !== 'undefined') {
					values.push({
						title: item,
						value: value
					});
				}
			}
			return values;
		}
		
		return values;
	}
	
	getResult() {
		return {
			id: this.getItemId(),
			date: this.getDateAndTime(),
			editor: this.getEditor(),
			changes: this.getChanges(),
		};
	}
};