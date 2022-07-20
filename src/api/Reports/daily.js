
import api from '../baseAPI';
import utils from '../api-utils';

const PATH = 'reports';

export default {
    async getExecutedTasks(filter) {
        const address = utils.createURLForReportFilter(filter, `${PATH}/executed_tasks?`);
        return api.get(address);
    },
    async getReport(date) {
        let ad = `${PATH}/daily?`;

        if (date) {
            ad = `${ad}date=${date}`;
        }
        return api.getFile(ad, date);
    },
    async getFilteredList(filter) {
        let ad = `${PATH}/tasks?`;
        ad = utils.createURLForTaskFilter(filter, ad);

        return api.getFile(ad, `с ${filter.dateFrom} по ${filter.dateTo}`);
    },
};
