

export default {
     async errorResponseHandler(response, method) {
        const statusOk = 200;
        const statusOkCreated = 201;
        const statusOkNoContent = 204;
        const statusBadRequest = 400;
        const statusForbidden = 403;
        const statusConflict = 409;
        const statusInternalServerError = 500;

        if (response) {
            if (response.status.toString().startsWith('2')) {
                if (method === 'DELETE') {
                    return {};
                }

                if (response.status === statusOk) {
                    try {
                        return await response.json();
                    } catch (e) {
                        // console.warn(e);
                        return {
                            // errorMessage: {
                            //     statusCode: statusOk,
                            //     title: 'Ошибка',
                            //     message: 'Невозможно прочитать ответ сервера',
                            // },
                        };
                    }
                }

                if (response.status === statusOkCreated) {
                    try {
                        return await response.json();
                    } catch (e) {
                        return {};
                    }
                }

                if (response.status === statusOkNoContent) {
                    try {
                        return await response.json();
                    } catch (e) {
                        return {};
                    }
                }
            }

            if (response.status.toString().startsWith('4')) {
                if (response.status === 404) {
                    return {
                        errorMessage: {
                            statusCode: 404,
                            title: 'Ошибка',
                            message: 'Оператор еще не прикреплен к бригаде',
                        },
                    };
                }
                if (response.status === statusBadRequest) {
                    try {
                        const json = await response.json();
                        return {
                            errorMessage: {
                                error: json,
                                statusCode: statusBadRequest,
                                title: 'Ошибка',
                                message: 'Запрос выполнен неверно. Проверьте заполненные поля',
                            },
                        };
                    } catch (e) {
                        console.warn(e);
                        return {
                            errorMessage: {
                                statusCode: statusBadRequest,
                                title: 'Ошибка',
                                message: 'Запрос выполнен неверно. Проверьте заполненные поля',
                            },
                        };
                    }
                }

                if (response.status === statusForbidden) {
                    try {
                        const json = await response.json();
                        return {
                            errorMessage: {
                                error: json,
                                statusCode: statusForbidden,
                                message: 'Ваша роль не позволяет произвести данное действие',
                            },
                        };
                    } catch (e) {
                        console.warn(e);
                        return {
                            errorMessage: {
                                statusCode: statusForbidden,
                                title: 'Ошибка',
                                message: 'Ваша роль не позволяет произвести данное действие',
                            },
                        };
                    }
                }

                if (response.status === statusConflict) {
                    try {
                        return await response.json();
                    } catch (e) {
                        console.warn(e);
                        return {
                            errorMessage: {
                                statusCode: statusConflict,
                                title: 'Ошибка',
                                message: 'Невозможно прочитать ответ сервера',
                            },
                        };
                    }
                }
            }

            if (response.status.toString().startsWith('5')) {
                if (response.status === statusInternalServerError) {
                    try {
                        return await response.json();
                    } catch (e) {
                        console.warn(e);
                        return {
                            errorMessage: {
                                statusCode: statusInternalServerError,
                                message: 'Ошибка ответа сервера',
                            },
                        };
                    }
                }
            }
        }
        return Promise.reject(response);
    },
};
