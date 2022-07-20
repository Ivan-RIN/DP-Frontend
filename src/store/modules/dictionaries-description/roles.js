import { addresses } from '../../../api/dictionaries-api';

export default
{
	apiAddress: addresses.roles,
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
			displayName: 'Наименование',
			visible: true,
			fieldName: 'name',
			type: 'string',
			width: '150',
			primaryKey: false,
		},
		{
			displayName: 'Описание',
			visible: true,
			fieldName: 'description',
			type: 'string',
			width: '15',
			primaryKey: false,
		},
	],
};
