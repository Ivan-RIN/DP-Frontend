import { addresses } from '../../../api/dictionaries-api';

export default
{
	name: 'Операторы',
	apiAddress: addresses.operators,
	columns:
	[
		{
			displayName: 'Идентификатор',
			visible: false,
			fieldName: 'id',
			type: 'number',
			width: '20',
			primaryKey: true,
		},
		{
			displayName: 'Login',
			visible: true,
			fieldName: 'login',
			type: 'string',
			width: '150',
			primaryKey: false,
		},
		{
			displayName: 'Имя',
			visible: true,
			fieldName: 'name',
			type: 'string',
			width: '150',
			primaryKey: false,
		},
		{
			displayName: 'e-mail',
			visible: true,
			fieldName: 'email',
			type: 'string',
			width: '150',
			primaryKey: false,
		},
		{
			displayName: 'Подразделение',
			visible: true,
			fieldName: 'deptId',
			type: 'string',
			width: '150',
			primaryKey: false,
			referenceDictionary: 'departments',
			referencePKField: 'id',
			referenceDisplayField: 'name',
		},
		{
			displayName: 'Активен',
			visible: true,
			fieldName: 'isActive',
			type: 'boolean',
			width: '15',
			primaryKey: false,
		},
	],
};
