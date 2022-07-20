export default {
    createURLForReportFilter(filter, PATH) {
        if (Object.keys(filter).length > 0) {
            if (filter.operator) {
                PATH = `${PATH}&executorId=${filter.operator}`;
            }

            if (filter.brigade) {
                PATH = `${PATH}&brigadeId=${filter.brigade}`;
            }

            if (filter.department) {
                PATH = `${PATH}&deptId=${filter.department}`;
            }

            if (filter.dateFrom) {
                PATH = `${PATH}&from=${filter.dateFrom}`;
            }

            if (filter.dateTo) {
                PATH = `${PATH}&to=${filter.dateTo}`;
            }

            return PATH;
        }

        return '';
    },
    createURLForTaskFilter(filter, URL) {
        if (Object.keys(filter).length > 0) {
            if (filter.brigades && filter.brigades.length > 0) {
                filter.brigades.forEach((b) => {
                    URL = `${URL}&brigades=${b.id}`;
                });
            }
            if (filter.status) {
                URL = `${URL}&state=${filter.status}`;
            }
            if (filter.dateFrom) {
                URL = `${URL}&from=${filter.dateFrom}`;
            }
            if (filter.dateTo) {
                URL = `${URL}&to=${filter.dateTo}`;
            }
            if (filter.taskCategoryId) {
                URL = `${URL}&taskCategoryId=${filter.taskCategoryId}`;
            }

            URL = `${URL}&executor=${!filter.executorStatus}`;

            URL = `${URL}&onlyExecutorTasks=${!!filter.onlyExecutorTasks}`;

            return URL;
        }

        return '';
    },
};
