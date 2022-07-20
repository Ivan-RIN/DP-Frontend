import { addresses } from '../../../api/dictionaries-api';

export default
{
	apiAddress: addresses.departments,
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
				displayName: 'Подразделение родитель идентификатор',
				visible: true,
				fieldName: 'parentId',
				type: 'string',
				width: '15',
				primaryKey: false,
				referenceDictionary: 'departments',
				referencePKField: 'id',
				referenceDisplayField: 'name',
			},
		],
};
