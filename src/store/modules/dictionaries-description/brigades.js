import { addresses } from '../../../api/dictionaries-api';

export default
{
	apiAddress: addresses.brigades,
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
			displayName: 'Наименование бригады',
			visible: true,
			fieldName: 'name',
			type: 'string',
			width: '150',
			primaryKey: false,
		},
		{
			displayName: 'Организационная структура',
			visible: true,
			fieldName: 'deptId',
			type: 'number',
			width: '15',
			primaryKey: false,
			referenceDictionary: 'departments',
			referencePKField: 'id',
			referenceDisplayField: 'name',
		},
		{
			displayName: 'Активен',
        	visible: true,
        	fieldName: 'isactive',
        	type: 'boolean',
        	width: '15',
        	primaryKey: false,
		},
	],
};
