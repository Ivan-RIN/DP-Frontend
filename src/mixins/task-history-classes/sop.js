/* eslint-disable */
import historyBaseClass from './historyBaseClass';

export default class SOP extends historyBaseClass {
	super(changedItem, dictionaries, taskStatus) {
		this.item = changedItem;
		this.dictionaries = dictionaries;
		this.taskStatus = taskStatus;
	}
	
	getCriterionName(arrayOfCriterions){
		let criterions = [];
		arrayOfCriterions.forEach(item => {
			let criterion = this.dictionaries.performanceCriterions.find(crit=> crit.id === item.CriterionId);
			if(criterion){
				criterions.push(criterion.name);
			}
		});
		return criterions.join(';');
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
				if (item === 'Number') {
					value = newObject[item];
				}
				if (item === 'ApproveDate') {
					value = this.getDateAndTime(newObject[item]);
				}
				if (item === 'ReviewDate') {
					value = this.getDateAndTime(newObject[item]);
				}
				if (item === 'Decription') {
					value = newObject[item];
				}
				if (item === 'Location') {
					value = newObject[item];
				}
				if (item === 'Responsible') {
					value = newObject[item];
				}
				if (item === 'Developer') {
					value = newObject[item];
				}
				if(item === 'Criterions'){
					value = this.getCriterionName(newObject[item])
				}
				if(item==='FileId'){
					value = newObject[item];
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