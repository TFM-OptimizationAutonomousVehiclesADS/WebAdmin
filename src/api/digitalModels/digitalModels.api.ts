import {httpBackApi} from '@app/api/http.api';

export const getAllDigitalModelsApi = (): Promise<any> => {
    return httpBackApi.get('/digital-models/all');
};

export const getDigitalModelByIdApi = (idDigitalModel: str): Promise<any> => {
    return httpBackApi.get('/digital-models/info/' + idDigitalModel);
};

export const startDigitalModelApi = (idDigitalModel: string): Promise<any> => {
    return httpBackApi.post('/digital-models/start/' + idDigitalModel);
};

export const stopDigitalModelApi = (idDigitalModel: string): Promise<any> => {
    return httpBackApi.post('/digital-models/stop/' + idDigitalModel);
};

export const deleteDigitalModelApi = (idDigitalModel: string): Promise<any> => {
    return httpBackApi.post('/digital-models/delete/' + idDigitalModel);
};

export const newDigitalModelApi = (data): Promise<any> => {
    return httpBackApi.post('/digital-models/new', data, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

export const getLogsSamplesByIdDigitalModelApi = (idDigitalModel: string): Promise<any> => {
    return httpBackApi.get('/digital-models/query/' + idDigitalModel, {params: {query: "/all_logs_samples"}});
};

export const getLogsSamplesByIdDigitalModelApiAndRange = (idDigitalModel: string, rangeDatetime): Promise<any> => {
    if (rangeDatetime && rangeDatetime[0] && rangeDatetime[1]) {
        const startDatetime = rangeDatetime[0].format("DD-MM-YYYYTHH:mm");
        const endDatetime = rangeDatetime[1].format("DD-MM-YYYYTHH:mm");
        return httpBackApi.get('/digital-models/query/' + idDigitalModel, {params: {query: "/logs_samples/" + startDatetime + "/" + endDatetime}});
    }
    return httpBackApi.get('/digital-models/query/' + idDigitalModel, {params: {query: "/all_logs_samples"}});
};

export const getLogsAnomaliesByIdDigitalModelApi = (idDigitalModel: string): Promise<any> => {
    return httpBackApi.get('/digital-models/query/' + idDigitalModel, {params: {query: "/all_last_anomalies"}});
};

export const getLogsAnomaliesByIdDigitalModelApiAndRange = (idDigitalModel: string, rangeDatetime): Promise<any> => {
    if (rangeDatetime && rangeDatetime[0] && rangeDatetime[1]) {
        const startDatetime = rangeDatetime[0].format("DD-MM-YYYYTHH:mm");
        const endDatetime = rangeDatetime[1].format("DD-MM-YYYYTHH:mm");
        return httpBackApi.get('/digital-models/query/' + idDigitalModel, {params: {query: "/last_anomalies/" + startDatetime + "/" + endDatetime}});
    }
    return httpBackApi.get('/digital-models/query/' + idDigitalModel, {params: {query: "/all_last_anomalies"}});
};

export const getLogsRetrainingEvaluationByIdDigitalModelApi = (idDigitalModel: string): Promise<any> => {
    return httpBackApi.get('/digital-models/query/' + idDigitalModel, {params: {query: "/all_logs_retraining_evaluation"}});
};

export const getLogsRetrainingEvaluationByIdDigitalModelApiAndRange = (idDigitalModel: string, rangeDatetime): Promise<any> => {
    if (rangeDatetime && rangeDatetime[0] && rangeDatetime[1]) {
        const startDatetime = rangeDatetime[0].format("DD-MM-YYYYTHH:mm");
        const endDatetime = rangeDatetime[1].format("DD-MM-YYYYTHH:mm");
        return httpBackApi.get('/digital-models/query/' + idDigitalModel, {params: {query: "/logs_retraining_evaluation/" + startDatetime + "/" + endDatetime}});
    }
    return httpBackApi.get('/digital-models/query/' + idDigitalModel, {params: {query: "/all_logs_retraining_evaluation"}});
};

export const getDigitalModelActualModelByIdApi = (idDigitalModel: string): Promise<any> => {
    return httpBackApi.get('/digital-models/query/' + idDigitalModel, {params: {query: "/actual_evaluation_dict"}});
};

export const predictSampleDigitalModelSingleApi = (idDigitalModel: string, sampleData): Promise<any> => {
    return httpBackApi.post('/digital-models/predict/' + idDigitalModel + "/single", sampleData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

export const predictSampleDigitalModelMultipleApi = (idDigitalModel: string, sampleData): Promise<any> => {
    return httpBackApi.post('/digital-models/predict/' + idDigitalModel + "/multiple", sampleData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};