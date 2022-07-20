import { addresses } from '../../../api/dictionaries-api';

export default
{
	name: 'Оборотный фонд',
	apiAddress: addresses.revolvingFonds,
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
			displayName: 'Тип оборудования',
			visible: true,
			fieldName: 'type',
			type: 'string',
			width: '150',
			primaryKey: false,
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
			displayName: 'Серийный номер',
			visible: true,
			fieldName: 'sn',
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
			displayName: 'Объект',
			visible: true,
			fieldName: 'object',
			type: 'string',
			width: '150',
			primaryKey: false,
		},
	],
};
