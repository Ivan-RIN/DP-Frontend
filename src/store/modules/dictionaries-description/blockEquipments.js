import { addresses } from '../../../api/dictionaries-api';

export default
{
	apiAddress: addresses.blockEquipments,
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
			displayName: 'Инвентарный номер',
			visible: true,
			fieldName: 'inventoryNumber',
			type: 'string',
			width: '150',
			primaryKey: false,
		},
		{
			displayName: 'Дата выпуска',
			visible: true,
			fieldName: 'issueDate',
			type: 'date',
			width: '150',
			primaryKey: false,
		},
		{
			displayName: 'Межповерочное время',
			visible: true,
			fieldName: 'verificationTime',
			type: 'number',
			width: '150',
			primaryKey: false,
		},
		{
			displayName: 'Дата поверки',
			visible: true,
			fieldName: 'verificationDate',
			type: 'date',
			width: '150',
			primaryKey: false,
		},
		{
			displayName: 'object',
			visible: true,
			fieldName: 'object',
			type: 'string',
			width: '150',
			primaryKey: false,
			referenceDictionary: 'facilities',
			referencePKField: 'id',
			referenceDisplayField: 'name',
		},
	],
};
