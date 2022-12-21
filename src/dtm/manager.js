
import {User, Task, Board, Department, Organization } from '@/dtm/objects.js';

const API_URL = process.env.VUE_APP_API_URL + '/dtm-api/';

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

const _loader = new Loader();
const _manager = new Manager();

_loader.addLoad([
	{ url: 'Loader/getOrganizations', action: _manager.loadOrganizations },
	{ url: 'Loader/getDepartments', action: _manager.loadDepartments },
	{ url: 'Loader/getUsers', action: _manager.loadUsers },
	{ url: 'Loader/GetBoardBlocks', action: _manager.loadBoardBlocks },
	{ url: 'Loader/userLogin', action: _manager.userLogin, method: 'POST' },
	{ url: 'Loader/getCurrentUser', action: _manager.loadCurrentUser },
]);

_loader.addLoad([
	{ url: 'Loader/getBoardUsers', action: _manager.loadBoardUsers },
]);

_loader.addLoad([
	{ url: 'Loader/getAllTasks', action: _manager.loadTasks, method: 'POST' },
]);

function Loader() {

	let _self = this;
	let list = [];
	let errors = [];

	this.addLoad = function (requests, callback) {
		list.push({ requests, callback });
	};

	this.upload = async function (requests, callback) {

		// let count = 0;
		// let promise = new Promise((resolve, reject) => {
		//
		// 	list.forEach(async(item) => {
		//
		// 		count++;
		// 		let payload = await fetchApi(item.url, item.method || 'GET');
		// 		count--;
		//
		// 		if (payload) {
		// 			item.action(payload);
		// 		} else {
		// 			errors.push(item.url);
		// 		}
		//
		// 		if (count == 0) resolve();
		//
		// 	});
		// });

		let promises = [];
		requests.forEach((request) => {
			promises.push(this.fetchRequest(request.url, request.method || 'GET'));
		});

		let response = await Promise.all(promises);

		if (callback && typeof callback == 'function') {
			callback(response);
		}

	};

	this.uploadAll = async function () {
		for (let block of list) {
			await this.upload(block.requests, block.callback);
		}
		this.uploaded();
	};

	this.isErrors = function () {
		return Boolean(errors.length);
	};

	this.getErrors = function () {
		return errors;
	};

	this.uploaded = function () {};

	 this.getUrl = function (path) {
		return API_URL + path;
	}

	this.getRequestOption = function (method, data) {
		return {
			method: method ? method.toUpperCase() : 'GET',
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

	this.getRequestOptionForm = function (data) {

		let formData = new FormData();

		for (let name in data) {
			let value = data[name];
			if (typeof value === 'object')
				for (let item of value)
					formData.append(name, item);
			else
				formData.append(name, value);
		}

		return {
			method: 'POST',
			cache: 'no-cache',
			headers: new Headers({
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'form/multipart',
				'Cache-Control': 'no-cache'
			}),
			body: formData
		};

	}

	this.fetchRequest = async function (url, method, data) {
		let response = await fetch(new Request(this.getUrl(url), this.getRequestOption(method, data)));
		return response.ok ? await response.json() : null;
	}

	this.fetchForm = async function (url, data) {
		let response = await fetch(new Request(this.getUrl(url), this.getRequestOptionForm(data)));
		return response.ok ? await response.json() : null;
	}

	this.fetchDownloadFile = async function (_url, _name, _method = 'GET') {
		const response = await fetch(new Request(this.getUrl(_url), this.getRequestOption(_method)));
		if (response.ok) {
			let blob = await response.blob();
			const element = document.createElement('A');
			element.href = URL.createObjectURL(blob);
			element.target = '_blank';
			element.download = _name;
			document.body.appendChild(element);
			element.click();
			document.body.removeChild(element);
			return true;
		}
		return false
	}

}

function Manager() {

	let _self = this;
	let _user;
	let _organizations = {};
	let _departments = {root: [], list: {}};
	let _users = {};
	let _tasks = {};
	let _boards = {};

	this.loadCurrentUser = function (payload) {
		_user = _self.addUser(payload);
	};

	this.loadUsers = function (payload) {
		payload.forEach(user => { _self.addUser(user) });
	};

	this.loadDepartments = function (payload) {

		let list = _departments.list;
		let root = _departments.root;

		payload.forEach(item => list[item.id] = new Department(_self, item));

		for(let id in list) {
			let dep = list[id];
			if (!dep) continue;
			if (dep.data.parentId) {
				let parent = list[dep.data.parentId];
				if (parent) {
					dep.setParent(parent);
					parent.appendChild(dep);
				}
			} else {
				root.push(dep);
			}
		}

	};

	this.loadOrganizations = function (payload) {
		payload.forEach(item => _organizations[item.id] = new Organization(_self, item));
	};

	this.loadBoardBlocks = function (payload) {};

	this.loadBoardUsers = function (payload) {};

	this.loadBoards = function (payload) {
		//console.log(payload);
	};

	this.userLogin = function (payload) {
		console.log(payload);
	};

	this.loadTasks = function (payload) {
		for (let _task of payload) {
			_tasks[_task.id] = new Task(_self, _user, _task);
		}
	};

	// -----------------------------------------------

	this.getCurrentUser = function() {
		return _users;
	};

	this.getListOrganizations = function () {
		return Object.values(_organizations);
	};

	this.getListDepartments = function () {
		return Object.values(_departments.list);
	};

	this.getListUsers = function () {
		return Object.values(_users);
	};

	this.getListBoards = function () {
		return Object.values(_departments);
	};

	this.getListTasks = function () {
		return Object.values(_tasks);
	};

	// -----------------------------------------------

	this.getCurrentUser = function() {
		return _user;
	}

	this.getOrganization = function(id) {
		return _organizations[id] ? _organizations[id] : null;
	};

	this.getDepartment = function(id) {
		return _departments[id] ? _departments[id] : null;
	};

	this.getBoard = function(id) {
		return _boards[id] ? _boards[id] : null;
	};

	this.getUser = function(id) {
		if (_users[id]) return _users[id];
		return null;
	}

	this.getUserAsync = async function(id) {
		if (_users[id]) return _users[id];
		return _users[id] = await _loader.fetchRequest('User/getUser/', 'POST', { id: id })
	};

	this.addUser = function(user) {
		return _users[user.id] = new User(_self, user);
	};

	this.addDepartmen = function(dep) {
		return _departments.list[dep.id] = new Department(_self, dep);
	};

	// this.getOrganizationName = function(id, _default) {
	// 	return _organizations[id] ? _organizations[id].name : _default || '';
	// };
	//
	// this.getOrganizationShortName = function(id, _default) {
	// 	return _organizations[id] ? _organizations[id].shortName : _default || '';
	// };
	//
	// this.getDepartmentName = function(id, _default) {
	// 	return _departments[id] ? _departments[id].name : _default || '';
	// };
	//
	// this.getDepartmentShortName = function(id, _default) {
	// 	return _departments[id] ? _departments[id].abbreviation : _default || '';
	// };
	//
	// this.getUserName = function(id, _default) {
	// 	return _users[id] ? _users[id].name : _default || '';
	// };
	//
	// this.getUserShortName = function(id, _default) {
	// 	if (_users[id]) {
	// 		let parts = _users[id].name.split(' ');
	// 		if (parts.length > 2)
	// 			return `${parts[0]} ${parts[1][0]}.${parts[2][0]}.`;
	// 		if (parts.length == 2)
	// 			return `${parts[0]} ${parts[1][0]}.`;
	// 		return parts[0];
	// 	}
	// 	return _default || '';
	// };

}

const dtm = new function() {

	let init = false;

	this.manager = _manager;

	this.init = async function () {

		if (init) return;
		init = true;

		console.log('DTM: Init');

		_loader.uploadAll();
		_loader.uploaded = function () {
			if (_loader.isErrors())
				console.log(`ERROR LOAD FILES: ${_loader.getErrors()}`);
		};
	}
}

export default dtm;
