import {httpBackApi} from '@app/api/http.api';

export const getAllDigitalModelsApi = (): Promise<any> => {
    return httpBackApi.get('/digital-models/all');
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
