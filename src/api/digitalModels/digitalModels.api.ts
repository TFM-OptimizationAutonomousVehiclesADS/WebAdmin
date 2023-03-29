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

export const getLogsAnomaliesByIdDigitalModelApi = (idDigitalModel: string): Promise<any> => {
    return httpBackApi.get('/digital-models/query/' + idDigitalModel, {params: {query: "/all_last_anomalies"}});
};

export const getLogsRetrainingEvaluationByIdDigitalModelApi = (idDigitalModel: string): Promise<any> => {
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