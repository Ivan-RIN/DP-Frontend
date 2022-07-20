import middleware from './middlewares/error-response-handler';

const API_URL = process.env.VUE_APP_API_URL;

export default {
    apiUrl(path) {
        return API_URL + path;
    },
    getHeaders() {
        return new Headers({
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Cache-Control': 'no-cache',
        });
    },
    getRequestOption(methodRequest, data) {
        const options = {
                method: methodRequest.toUpperCase(),
                mode: 'cors',
                cache: 'no-cache',
                headers: this.getHeaders(),
            };
        // need for debug-mode without auth
        if (process.env.VUE_APP_CREDENTAILS === true) {
            options.credentials = 'include';
        }
        if (data !== undefined) {
            options.body = JSON.stringify(data);
        }

        return options;
    },
    fetchRequest(url, method, data) {
        return new Request(this.apiUrl(url), this.getRequestOption(method, data));
    },
    async fetchApi(url, method, data) {
        try {
            // console.log('fetchApi', url, method, data);
            const response = await fetch(this.fetchRequest(url, method, data));
            // console.log(`fetchApi response url ${url}`, response);

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
};
