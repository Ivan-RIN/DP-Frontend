
import middleware from './middlewares/error-response-handler';

const API_URL = process.env.VUE_APP_API_URL;

export default {
    dtm: false,
    apiUrl(path) {
        return this.dtm ? API_URL + '/dtm/' + path : API_URL + '/api/' + path;
    },
    getHeaders() {
        return new Headers({
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
        });
    },
    getRequestOption(methodRequest, data, files) {

        const options = {
            cache: 'no-cache',
        };

        if (methodRequest == 'FORM') {

            options.method = 'POST';
            options.headers = new Headers();
            options.body = new FormData();

            for(let name in data) {
                if (name == 'files') {
                    for (let i = 0; i < data.files.length; i ++) {
                        if (data.files[i].allowed)
                            options.body.append('files', data.files[i]);
                    }
                } else {
                    options.body.append(name, data[name]);
                }
            }

        } else {

            options.method = methodRequest.toUpperCase();
            options.headers = this.getHeaders();

            if (data !== undefined) {
                options.body = JSON.stringify(data);
            }
        }

        // need for debug-mode without auth
        if (process.env.VUE_APP_CREDENTAILS === true) {
            options.credentials = 'include';
        }

        return options;
    },
    fetchRequest(url, method, data, file) {
        return new Request(this.apiUrl(url), this.getRequestOption(method, data, file));
    },
    async fetchApi(url, method, data) {
        try {
            const response = await fetch(this.fetchRequest(url, method, data));
            return await middleware.errorResponseHandler(response, method);
        } catch (error) {
            return Promise.reject(error);
        }
    },
    async fetchApiFile(url, method, name) {
        try {
            let data;
            fetch(this.fetchRequest(url, method, data))
                .then(res => res.blob())
                .then((res) => {
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(res);
                    a.target = '_blank';
                    a.download = `Отчет ${name}.xlsx`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                });
            return data;
        } catch (error) {
            return Promise.reject(error);
        }
    },
    async fetchApiDownloadFile(url, method, name) {
        try {
            let data;
            fetch(this.fetchRequest(url, method, data))
                .then(res => res.blob())
                .then((res) => {
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(res);
                    a.target = '_blank';
                    a.download = name;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                });
            return data;
        } catch (error) {
            return Promise.reject(error);
        }
    },
    async fetchApiForm(url, data) {
        try {
            const response = await fetch(this.fetchRequest(url, 'FORM', data));
            return await middleware.errorResponseHandler(response, 'POST');
        } catch (error) {
            return Promise.reject(error);
        }
    }
};
