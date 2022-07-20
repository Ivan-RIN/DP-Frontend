/* eslint-disable */
import historyBaseClass from './historyBaseClass';

export default class Task extends historyBaseClass {
	super(changedItem, dictionaries, taskStatus) {
		this.item = changedItem;
		this.dictionaries = dictionaries;
		this.taskStatus = taskStatus;
	}

	// getTitle(changedProp) {
	// 	const propertyTitles = {
	// 		Name: 'Название: ',
	// 		Comment: 'Комментарий: ',
	// 		Values: 'Критерии исполнения: ',
	// 		Priority: 'Приоритет: ',
	// 		TaskCategoryId: 'Категория: ',
	// 		BrigadeId: 'Бригада: ',
	// 		Shift: 'Смена: ',
	// 		ToDoDate: 'Дата исполнения: ',
	// 		State: 'Статус: ',
	// 		ExecutorId: 'Ответственный: ',
	// 		ExecutionDate: 'Дата выполнения: ',
	// 	};
	// 	return propertyTitles[changedProp];
	// }

	getBrigadeName(id) {
		const brigade = this.dictionaries.brigades.find(item => item.id === id);
		return brigade ? brigade.name : '';
	}
	
	getStateName(id) {
		const status = this.taskStatus.find(item => item.id === id);
		return `<div class="status" style="background-color:${status.color}"></div>${status.name}`;
	}
	
	getExecutorName(id) {
		const executor = this.dictionaries.operators.find(item => item.id === id);
		return executor.name;
	}
	
	compareValues(newVal, oldVal) {
		// eslint-disable-next-line array-callback-return,consistent-return
		const diff = [];
		if(oldVal.length <=0){
			return newVal;
		}
		newVal.forEach((item) => {
			let addTo = oldVal.find(oldItem => {
				if(oldItem.CriterionId === item.CriterionId){
					return oldItem.Value === item.Value;
				}
			});
			if(!addTo){
				diff.push(item);
			}
		});
		return diff;
	}
	
	getValues(newValues, oldValues) {
		const diff = this.compareValues(newValues, oldValues);
		const performanceCriterions = this.dictionaries.performanceCriterions;
		let criterionValues = '';
		
		if (diff.length > 0) {
			for (let i = 0, len = diff.length; i < len; i++) {
				if (diff[i]) {
					const criterion = performanceCriterions.find((item) => {
						return item.id === diff[i].CriterionId;
					});
					criterionValues = `${ criterionValues } ${ criterion.name } - ${ diff[i].Value }`;
					if (i < len) {
						criterionValues = `${ criterionValues }<br>`;
					}
				}
			}
		}
		return criterionValues;
	}
	
	getTaskCategory(id) {
		let category;
		if(this.dictionaries && this.dictionaries.taskCategories){
			category = this.dictionaries.taskCategories.find(item =>item.id == id);
		}
		return (category && category.name) ? category.name : `Неизвестная ошибка при чтении категории работ ${id}`;
	}
	
	getChanges() {
		const newObject = JSON.parse(this.item.newObject);
		const oldObject = JSON.parse(this.item.oldObject);
		let values = [];
		
		values.push({
			title: '',
			value: this.checkUserAction()
		});

		if(this.item.changedProperties && this.item.changedProperties.length > 0) {
			
			for (let i = 0, len = this.item.changedProperties.length; i < len; i++ ) {
				let item = this.item.changedProperties[i];
				let value;
				if(newObject[item]) {
					if ( item === 'BrigadeId' ) {
						value = this.getBrigadeName( newObject[ item ] );
					}
					if ( item === 'State' ) {
						value = this.getStateName( newObject[ item ] );
					}
					if ( item === 'ToDoDate' ) {
						value = newObject[ item ].substr( 0, 10 );
					}
					if ( item === 'ExecutionDate' ) {
						value = newObject[ item ].substr( 0, 10 );
					}
					if ( item === 'ExecutorId' ) {
						value = this.getExecutorName( newObject[ item ] );
					}
					if ( item === 'Values' ) {
						value = this.getValues( newObject[ item ], oldObject[ item ] );
					}
					if ( item === 'TaskCategoryId' ) {
						value = this.getTaskCategory( newObject[ item ] );
					}
					if (item === 'MechanismId') {
						value = this.getName(newObject[item], 'mechanism');
					}
					if (item === 'BlockEquipmentId') {
						value = this.getName(newObject[item], 'blockEquipments');
					}
					
					
					if ( !value ) {
						value = (newObject[ item ] && newObject[ item ].Name) ? newObject[ item ].Name : newObject[ item ];
					}
				}
				
				if (value !== 'null' && value != null) {
					values.push({
						title: item,
						value: value
					});
				}
			}
			return values;
		}
		
		values.push({
			title: '',
			value: 'Без изменений'
		});
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