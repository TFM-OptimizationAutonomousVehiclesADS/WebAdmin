import {httpBackApi} from '@app/api/http.api';

export const getRealSystemInfo = (): Promise<any> => {
    return httpBackApi.get('/real-system/info');
};

export const startRealSystemApi = (): Promise<any> => {
    return httpBackApi.post('/real-system/start/');
};

export const stopRealSystemApi = (): Promise<any> => {
    return httpBackApi.post('/real-system/stop/');
};

export const deleteRealSystemApi = (): Promise<any> => {
    return httpBackApi.post('/real-system/delete/');
};

export const getRealSystemActualModelApi = (): Promise<any> => {
    return httpBackApi.get('/real-system/query/', {params: {query: "/actual_evaluation_dict"}});
};

export const postReplaceModelRealSystem = (digital_model_id: string): Promise<any> => {
    return httpBackApi.post('/real-system/replace-model/' + digital_model_id);
};


export const getRealSystemAllFederativeAlertsApi = (): Promise<any> => {
    return httpBackApi.get('/alerts/federative/all');
};