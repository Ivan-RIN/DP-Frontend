import { addresses } from '../../../api/dictionaries-api';

export default {
    name: 'Должности',
    apiAddress: addresses.posts,
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
        ],
};
