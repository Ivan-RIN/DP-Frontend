
function getShortName(name) {
	let parts = name.split(' ');
	if (parts.length > 2) {
		return `${parts[0]} ${parts[1][0]}.${parts[2][0]}.`;
	}
	if (parts.length == 2) {
		return `${parts[0]} ${parts[1][0]}.`;
	}
	return parts[0];
}

function User(_manager, data) {

	let _self = this;

	let _changes = { id: data.id };

	this.data = data;
	this.isDeveloper = false;
	this.isAdministrator = false;
	this.isModerator = false;
	this.isUser = true;
	this.data.shortName = getShortName(this.data.name);

	this.getName = function (short = false) {
		return short ? this.data.shortName : this.data.name;
	};

	this.setName = function (name) {
		if (this.data.name == name) return true;
		if (name.length < 2) return false;
		_changes.name = name;
		return true;
	};

	this.getDepartment = function () {
		return _manager.getDepartment(data.departmentId);
	};

	this.save = async function () {
		if (Object.keys(_changes).length) {
			 let res = await _manager.api('User/Save', 'POST', _changes);
			_changes = { id: data.id };
			return res;
		}
		return true;
	};

}

// --------------------------------------------

function Department(_manager, data) {

	this.data = data;

	let _parent = null;
	let _childs = [];

	this.setParent = function (parent) {
		_parent = parent;
	};

	this.appendChild = function (child) {
		_childs.push(child);
	};

	this.getChilds = function () {
		return _childs;
	};

	this.getName = function (short = false) {
		return short ? this.data.abbreviation : this.data.name;
	};

	this.getShortName = function () {
		return this.data.abbreviation;
	};

	this.getSupervisor = function (_default = null) {
		let user = _manager.getUser(data.supervisorId);
		return user ? user : _default;
	};

	this.getSupervisorName = function (short = false, _default = '') {
		let user = _manager.getUser(data.supervisorId);
		return user ? user.getName(short) : _default;
	};
}

// --------------------------------------------

function Organization(_manager, data) {

	this.data = data;

	this.getName = function () {
		return this.data.fullName;
	};

	this.getShortName = function () {
		return this.data.shortName;
	};
}

// --------------------------------------------

function Board(_manager, _board) {

	let _user = _manager.getCurrentUser();

	let _tasks = [];

	this.addTask = function (_task) {
		_tasks.push(_task);
	}

	this.getTasks = function () {
		return _tasks;
	}

	this.getName = function () {
		return _board.name;
	}

}


// --------------------------------------------

function Task(_manager, _user, _task) {

	const _statuses = ['Неизвестный', 'В работе', 'В архиве', 'Удален'];
	const _states = ['Неизвестный', 'Планируется', 'Отклонено', 'Отложено', 'Утверждено', 'В работе', 'Выполнено', 'Просрочено', 'На согласовании', 'Отменено'];
	const _priorities = ['Неизвестный', 'Низкий', 'Обычный', 'Средний', 'Высокий', 'Критический'];

	let _changes = { id: _task.id };

	_task.createDate = new Date(_task.createDate);
	_task.dataStart = _task.dataStart ? new Date(_task.dataStart) : null;
	_task.dataEnd = _task.dataEnd ? new Date(_task.dataEnd) : null;
	_task.executionDate = _task.executionDate ? new Date(_task.executionDate) : null;

	this.data = _task;
	this.board = _manager.getBoard(_task.boardId);
	this.hasInitiator = _task.initiatorId && _task.initiatorId > 0;
	this.hasExecutor =  _task.executorId && _task.executorId != _task.initiatorId;
	this.isInitiator =  _task.initiatorId && _task.initiatorId == _user.id;
	this.isExecutor =   _task.executorId && _task.executorId == _user.id;

	this.getName = function () {
		return _task.name;
	};

	this.getStatus = function () {
		let id = this.data.status;
		return id < _statuses.length ? _statuses[id] : _statuses[0];
	};

	this.getState = function () {
		let id = this.data.state;
		return id < _states.length ? _states[id] : _states[0];
	};

	this.getPriority = function () {
		let id = this.data.priority;
		return id < _priorities.length ? _priorities[id] : _priorities[0];
	};

	this.getStartDate = function (_default = '') {
		return _task.startDate ? this.data.startDate.toLocaleDateString() : _default;
	};

	this.getStartDatetime = function (_default = '') {
		return _task.startDate ? this.data.startDate.toLocaleDateString() + ' ' + _task.startDate.toLocaleTimeString() : _default;
	};

	this.getEndDate = function (_default = '') {
		return _task.endDate ? _task.endDate.toLocaleDateString() : _default;
	};

	this.getExecutionDate = function (_default = '') {
		return _task.executionDate ? _task.executionDate.toLocaleDateString() : _default;
	}

	this.checkOverdue = function () {
		return _task.endDate && new Date() > _task.endDate;
	};

	this.getInitiator = function () {
		return _manager.getUser(_task.initiatorId);
	};

	this.getExecutor = function () {
		return _manager.getUser(_task.executorId);
	};

	this.setName = function (name) {
		if (_task.name == name) return true;
		if (name.length < 3) return false;
		_changes.name = name;
		return true;
	}

	this.setDescription= function (desc) {
		if (_task.description != desc)
			_changes.description = desc;
		return true;
	}

	// формат: YYYY-MM-DDT
	this.getEndDate = function(str) {
		let date = new Date(str);
		if (!date) return false;
		if (date != _task.endDate)
			_changes.endDate = date;
		return true;
	}

	this.setInitiator = function(id) {
		let user = _manager.getUser(id);
		if (!user) return false;
		if (id != _task.initiatorId)
			_changes.initiatorId = id;
		return true;
	};

	this.setExecutor = function(id) {
		let user = _manager.getUser(id);
		if (!user) return false;
		if (id != _task.executorId)
			_changes.executorId = id;
		return true;
	};

	this.setProgress = function(value) {
		if (value < 0 || value > 100) return false;
		if (value != _task.progress)
			_changes.progress = value;
		return true;
	}

	this.setProgressComment = function(comment) {
		_changes.comment = comment;
	};

	this.setStatus = function(value) {
		if (value < 1 || value > _statuses.length) return false;
		_changes.status = value;
		return true;
	};

	this.setState = function(value) {
		if (value < 1 || value > _states.length) return false;
		_changes.state = value;
		return true;
	};

	this.setPriority = function(value) {
		if (value < 1 || value > _priorities.length) return false;
		_changes.priority = value;
		return true;
	};

	this.setParent = function(id) {
		_changes.parentTaskId = id;
		return true;
	};

	this.__convertDate = function (date, _default) {
		if (date) {
			return date.split('T')[0].split('-')
				.reverse()
				.join('.');
		}
		return _default || '';
	};

	this.__convertDatetime = function (date, _default) {
		if (date) {
			let part = date.split('T');
			if (part.length == 2) {
				return part[0].split('-')
					.reverse()
					.join('.') + ' ' + part[1].split('.')[0];
			}
		}
		return _default || '';
	};
}

export {
	User,
	Task,
	Board,
	Department,
	Organization
};
