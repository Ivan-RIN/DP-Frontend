import { addresses } from '../../../api/dictionaries-api';

export default
{
	name: 'Техника',
	apiAddress: addresses.mechanism,
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
			displayName: 'Модель',
			visible: true,
			fieldName: 'model',
			type: 'string',
			width: '150',
			primaryKey: false,
		},
		{
			displayName: 'Государственный номер',
			visible: true,
			fieldName: 'govNumber',
			type: 'string',
			width: '15',
			primaryKey: false,
		},
		{
			displayName: 'Гаражный номер',
			visible: true,
			fieldName: 'garageNumber',
			type: 'string',
			width: '15',
			primaryKey: false,
		},
		{
			displayName: 'Дата выпуска',
			visible: true,
			fieldName: 'issueDate',
			type: 'date',
			width: '15',
			primaryKey: false,
		},
		{
			displayName: 'Примечание',
			visible: true,
			fieldName: 'description',
			type: 'string',
			width: '15',
			primaryKey: false,
		},
	],
};
