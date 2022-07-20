import { AbilityBuilder } from '@casl/ability';

function setAbilities(user) {
	const director = 1;
	const headOfDepartment = 2;
	const geologist = 3;
	const technologist = 4;
	const master = 5;
	const CRONPOmaster = 6;
	const scheduler = 7;
	const operator = 8;
	const businessAdmin = 9;
	const admin = 10;
	const leadEngineer = 11;
	const headOfSection = 12;
	const { can, rules } = AbilityBuilder.extract();

	if (user && user.roleId) {
		if (user.roleId === director
			|| user.roleId === headOfDepartment
			|| user.roleId === geologist
			|| user.roleId === technologist
			|| user.roleId === CRONPOmaster
			|| user.roleId === scheduler
			|| user.roleId === businessAdmin
			|| user.roleId === admin
			|| user.roleId === leadEngineer
			|| user.roleId === headOfSection) {
			can('read', 'Tasks');
			can('read', 'Calendar');
			can('read', 'Analytics');
			// can('read', 'ChangeHistory');
		}

		if (user.roleId === businessAdmin || user.roleId === admin) {
			can('read', 'Dictionaries');
			can('read', 'AttachFacilities');
			can('read', 'EventLog');
		}

		if (user.roleId === headOfDepartment || user.roleId === leadEngineer) {
			can('read', 'AttachFacilities');
			can('read', 'Dictionaries');
		}

		if (user.roleId === operator) {
			can('read', 'Tasks/Report');
		}

		if (user.roleId === admin) {
			can('read', 'ChangeHistory');
			can('read', 'AttachOperators');
		}

		if (user.roleId === master) {
			can('read', 'Tasks');
			can('read', 'Calendar');
			can('read', 'Analytics');
			can('read', 'AttachOperators');
		}
	}
	return rules;
}

function createAbility() {
	return AbilityBuilder.define(() => {});
}

export default {
	createAbility,
	setAbilities,
};
