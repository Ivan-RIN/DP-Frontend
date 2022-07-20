import { addresses } from '../../../api/dictionaries-api';

export default
{
	name: 'Критерии исполнения',
	apiAddress: addresses.performanceCriterions,
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
			displayName: 'Тип поля',
			visible: true,
			fieldName: 'criterionType',
			type: 'select',
			width: '15',
			referenceDictionary: 'performanceCriterionsTypes',
			referencePKField: 'id',
			referenceDisplayField: 'name',
			primaryKey: false,
		},
		{
			displayName: 'Параметр (ID)',
			visible: true,
			fieldName: 'measureId',
			type: 'number',
			width: '15',
			primaryKey: false,
		},
	],
};
