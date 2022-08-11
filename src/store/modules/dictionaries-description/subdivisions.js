import { addresses } from '../../../api/dictionaries-api';

export default
{
	apiAddress: addresses.subdivisions,
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
			displayName: 'Идентификатор родителя',
			visible: true,
			fieldName: 'parentId',
			type: 'number',
			width: '150',
			primaryKey: false,
		},
		{
			displayName: 'Краткое наименование',
			visible: true,
			fieldName: 'deptId',
			type: 'string',
			width: '15',
			primaryKey: false,
		},
		{
			displayName: 'Полное наименование',
        	visible: true,
			fieldName: 'order',
        	type: 'string',
        	width: '15',
        	primaryKey: false,
		},
	],
};
