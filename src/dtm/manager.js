
const API_URL = process.env.VUE_APP_API_URL;

function getUrl(path) {
	return API_URL + '/dtm-api/' + path;
}

function getRequestOption(method, data) {
	return {
		method: method,
		cache: 'no-cache',
		headers: new Headers({
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Cache-Control': 'no-cache'
		}),
		body: data == undefined ? undefined : JSON.stringify(data)
	}
}

function getRequestOptionForm(data) {
	let options = {
		method: 'POST',
		cache: 'no-cache',
		headers: new Headers({
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'form/multipart',
			'Cache-Control': 'no-cache'
		}),
		body: new FormData()
	};
	for (let name in data) {
		let value = data[name];
		if (typeof value === 'object')
			for (let item of value) options.body.append(name, item);
		else options.body.append(name, value);
	}
	return options;
}

async function fetchApi (url, method, data) {
	method = method ? method.toUpperCase() : 'GET';
	const options = method == 'FORM' ? getRequestOptionForm(data) : getRequestOption(method, data);
	let response = await fetch(new Request(getUrl(url), options));
	return response.ok ? await response.json() : null;
}

async function fetchApiDownloadFile(url, method, name) {
	try {
		let data;
		method = method ? method.toUpperCase() : 'GET';
		fetch(new Request(getUrl(url), getRequestOption(method, data)))
			.then(response => response.blob())
			.then((blob) => {
				const element = document.createElement('A');
				element.href = URL.createObjectURL(blob);
				element.target = '_blank';
				element.download = name;
				document.body.appendChild(element);
				element.click();
				document.body.removeChild(element);
			})
			.catch((error) => {
				return Promise.reject(error);
			});
		return data;
	} catch (error) {
		return Promise.reject(error);
	}
}

function Loader() {

	let list = [];
	let errors = [];
	let count = 0;

	this.start = function () {

		let self = this;
		count = list.length;

		list.forEach(async(item) => {

			let payload = await fetchApi(item.url, item.method || 'GET');

			if (payload) {
				item.action(payload);
			} else {
				errors.push(item.url);
			}

			count--;

			if (count == 0) {
				self.uploaded();
			}

		})
	};

	this.uploaded = function () {};

	this.isErrors = function () {
		return Boolean(errors.length);
	}

	this.getErrors = function () {
		return errors;
	};

	this.append = function (url, action) {
		list.push({
			url: url,
			action: action
		})
	};

	this.load = function (items) {
		list.push(...items);
	}

}

function Board() {}

function Task(data) {

	this.data = data;

	const _statuses = ['Неизвестный', 'В работе', 'В архиве', 'Удален'];
	const _states = ['Неизвестный', 'Планируется', 'Отклонено', 'Отложено', 'Утверждено', 'В работе', 'Выполнено', 'Просрочено', 'Отменено'];
	const _priorities = ['Неизвестный', 'Низкий', 'Обычный', 'Средний', 'Высокий', 'Критический'];

	this.getStatus = function () {
		let id = this.data.status;
		return id < _statuses.length ? _statuses[id] : _statuses[0];
	};

	this.getState = function() {
		let id = this.data.state;
		return id < _states.length ? _states[id] : _states[0];
	};

	this.getPriority = function() {
		let id = this.data.priority;
		return id < _priorities.length ? _priorities[id] : _priorities[0];
	};

	this.getStartDate = function () {
		return this.convertDate(this.data.startDate);
	};

	this.getEndDate = function () {
		return this.convertDate(this.data.endDate);
	};

	this.checkOverdue = function () {
		let endDate = new Date(this.data.endDate);
		let currentDate = new Date();
		currentDate.setHours(0);
		currentDate.setMinutes(0);
		currentDate.setSeconds(0, 0);
		return currentDate > endDate;
	};

	this.convertDate = function(date, _default) {
		if (date)
			return date.split('T')[0].split('-').reverse().join('.');
		return _default || '';
	};

	this.convertDatetime = function(date, _default) {
		if (date) {
			let part = date.split('T');
			if (part.length == 2)
				return part[0].split('-').reverse().join('.') + ' ' + part[1].split('.')[0];
		}
		return _default || '';
	};

}

function Manager() {

	let _user;
	let _organizations = {};
	let _departments = {};
	let _users = {};
	let _boards = {};

	this.loadCurrentUser = function (payload) {
		_user = new User(payload);
	};

	this.loadOrganizations = function (payload) {
		payload.forEach(item => _organizations[item.id] = new Organization(item));
	};

	this.loadDepartments = function (payload) {
		payload.forEach(item => _departments[item.id] = new Department(item));
	};

	this.loadUsers = function (payload) {
		payload.forEach(item => _users[item.id] = new User(item));
	};

	this.loadBoardBlocks = function (payload) {};

	this.loadBoardUsers = function (payload) {};

	this.loadBoards = function (payload) {
		console.log(payload);
	};

	this.userLogin = function (payload) {
		console.log(payload);
	};

	this.loadTasks = function (payload) {
		console.log(payload);
	};

	// -----------------------------------------------

	this.getListOrganizations = function () {
		return Object.values(_organizations);
	};

	this.getListDepartments = function () {
		return Object.values(_departments);
	};

	this.getListUsers = function () {
		return Object.values(_users);
	};

	this.getListBoards = function () {
		return Object.values(_departments);
	};

	// -----------------------------------------------

	this.getCurrentUser = function() {
		return _users;
	};

	this.getOrganization = function(id) {
		return _organizations[id] ? _organizations[id] : null;
	};

	this.getDepartment = function(id) {
		return _departments[id] ? _departments[id] : null;
	};

	this.getUser = function(id) {
		return _users[id] ? _users[id] : null;
	};

	this.getOrganizationName = function(id, _default) {
		return _organizations[id] ? _organizations[id].name : _default || '';
	};

	this.getOrganizationShortName = function(id, _default) {
		return _organizations[id] ? _organizations[id].shortName : _default || '';
	};

	this.getDepartmentName = function(id, _default) {
		return _departments[id] ? _departments[id].name : _default || '';
	};

	this.getDepartmentShortName = function(id, _default) {
		return _departments[id] ? _departments[id].abbreviation : _default || '';
	};

	this.getUserName = function(id, _default) {
		return _users[id] ? _users[id].name : _default || '';
	};

	this.getUserShortName = function(id, _default) {
		if (_users[id]) {
			let parts = _users[id].name.split(' ');
			if (parts.length > 2)
				return `${parts[0]} ${parts[1][0]}.${parts[2][0]}.`;
			if (parts.length == 2)
				return `${parts[0]} ${parts[1][0]}.`;
			return parts[0];
		}
		return _default || '';
	};
}

function Organization(data) {
	this.data = data;
}

Organization.prototype.getName = function() {
	return this.data.fullName;
};

Organization.prototype.getShortName = function() {
	return this.data.shortName;
}

function Department(data) {
	this.data = data;
}

Department.prototype.getName = function() {
	return this.data.name;
};

Department.prototype.getShortName = function() {
	return this.data.abbreviation;
}

function User(data) {
	this.data = data;
}

User.prototype.getName = function() {
	return this.data.name;
};

User.prototype.getShortName = function() {
	let parts = this.data.name.split(' ');
	if (parts.length > 2)
		return `${parts[0]} ${parts[1][0]}.${parts[2][0]}.`;
	if (parts.length == 2)
		return `${parts[0]} ${parts[1][0]}.`;
	return parts[0];
};

User.prototype.getDepartment = function() {
	return _manager.getDepartment(this.data.departmentId)
};

const _loader = new Loader();
const _manager = new Manager();

_loader.load([
	{ url: 'Loader/getOrganizations', action: _manager.loadOrganizations },
	{ url: 'Loader/getDepartments', action: _manager.loadDepartments },
	{ url: 'Loader/getUsers', action: _manager.loadUsers },
	{ url: 'Loader/GetBoardBlocks', action: _manager.loadBoardBlocks },
	{ url: 'Loader/getBoardUsers', action: _manager.loadBoardUsers },
	{ url: '_Loader/getBoards', action: _manager.loadBoards },
	{ method: 'POST', url: 'Loader/userLogin', action: _manager.userLogin },
	{ url: 'Loader/getCurrentUser', action: _manager.loadCurrentUser },
	{ method: 'POST', url: 'Loader/GetTasks', action: _manager.loadTasks },
]);

const dtm = new function() {

	let init = false;

	this.init = async function () {

		if (init) return;
		init = true;

		console.log('DTM: Init');

		_loader.start();
		_loader.uploaded = function () {
			console.log('Uploaded');
			//console.log(self.manager.getListUsers());
			if (_loader.isErrors())
				console.log(`ERROR LOAD FILES: ${_loader.getErrors()}`);
		};
	}
}

export default dtm;
