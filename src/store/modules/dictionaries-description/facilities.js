import { addresses } from '../../../api/dictionaries-api';

export default
{
	name: 'Фонд скважин',
	apiAddress: addresses.facilities,
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
			displayName: 'Родитель',
			visible: true,
			fieldName: 'facilities',
			type: 'number',
			width: '15',
			primaryKey: false,
			referenceDictionary: 'facilities',
			referencePKField: 'id',
			referenceDisplayField: 'name',
		},
		{
			displayName: 'Тип',
			visible: false,
			fieldName: 'type',
			type: 'number',
			width: '20',
			primaryKey: false,
		},
	],
};
