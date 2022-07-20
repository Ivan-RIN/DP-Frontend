export default class HistoryBaseClass {
	constructor(changedItem, dictionaries, taskStatus) {
		this.item = changedItem;
		this.dictionaries = dictionaries;
		this.taskStatus = taskStatus;
	}

	getEditor() {
		return (this.item.modifiedBy && this.item.modifiedBy.name) ? this.item.modifiedBy.name : 'Неизвестен';
	}

	getDateAndTime() {
		return this.item.date.split('.')[0].replace('T', ' / ');
	}

	getItemId() {
		return this.item.objectId;
	}

	getName(id, dictName) {
		const dictItem = this.dictionaries[dictName].find(item => item.id === id);
		if (dictName === 'mechanism') {
			return (dictItem && dictItem.model) ? dictItem.model : 'Неизвестно';
		}
		return (dictItem && dictItem.name) ? dictItem.name : 'Неизвестно';
	}

	checkUserAction() {
		return `${this.dictionaries.userActions[this.item.action]} для ${this.item.objectType}`;
	}
}
