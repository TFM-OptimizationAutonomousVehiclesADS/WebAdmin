import { httpApi } from '@app/api/http.api';
import {httpBackApi} from '@app/api/http.api';
// import './mocks/auth.api.mock';
import { UserModel } from '@app/domain/UserModel';

export interface AuthData {
  username: string;
  password: string;
}

export interface SignUpRequest {
  username: string;
  password1: string;
  password2: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface SecurityCodePayload {
  code: string;
}

export interface NewPasswordData {
  newPassword: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  username: string;
  loginAt: string;
  createdAt: string;
}

export const login = (loginPayload: LoginRequest): Promise<LoginResponse> => {
  let formData = new FormData();    //formdata object
  formData.append("username", loginPayload.username)
  formData.append("password", loginPayload.password)
  return httpBackApi.post<LoginResponse>('/users/login', formData).then(({ data }) => data);
}


export const signUp = (signUpData: SignUpRequest): Promise<undefined> => {
  let formData = new FormData();    //formdata object
  formData.append('username', signUpData.username);
  formData.append('password1', signUpData.password1);
  formData.append('password2', signUpData.password2);
  return httpBackApi.post<undefined>('/users/register', formData)
    .then(({ data }) => data);
}

export const resetPassword = (resetPasswordPayload: ResetPasswordRequest): Promise<undefined> =>
  httpApi.post<undefined>('forgotPassword', { ...resetPasswordPayload }).then(({ data }) => data);

export const verifySecurityCode = (securityCodePayload: SecurityCodePayload): Promise<undefined> =>
  httpApi.post<undefined>('verifySecurityCode', { ...securityCodePayload }).then(({ data }) => data);

export const setNewPassword = (newPasswordData: NewPasswordData): Promise<undefined> =>
  httpApi.post<undefined>('setNewPassword', { ...newPasswordData }).then(({ data }) => data);
