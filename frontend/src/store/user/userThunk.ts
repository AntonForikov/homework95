import {createAsyncThunk} from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi';
import {
  RegisterResponse,
  RegisterMutation,
  ValidationError,
  UserFromDb,
  LoginMutation,
  GlobalError,
} from '../../types';
import {isAxiosError} from 'axios';
import {RootState} from '../../app/store';
import {unsetUser} from './userSlice';
export const register = createAsyncThunk<UserFromDb, RegisterMutation, {rejectValue: ValidationError}>(
  'register/post',
  async (registerMutation, {rejectWithValue}) => {
    try {
      const formData = new FormData();
      const keys = Object.keys(registerMutation) as (keyof RegisterMutation)[];
      keys.forEach(key => {
        const value = registerMutation[key];
        if (value !== null) formData.append(key, value);
      });

      const {data} = await axiosApi.post<RegisterResponse>(`/users`, formData);
      return data.user;
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 422) {
        return rejectWithValue(e.response.data);
      }
      throw e;
    }
  }
);

export const login = createAsyncThunk<UserFromDb, LoginMutation, {rejectValue: GlobalError}>(
  'login/post',
  async (loginMutation, {rejectWithValue}) => {
    try {
      const {data} = await axiosApi.post<RegisterResponse>('/users/sessions', loginMutation);
      return data.user;
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 404) {
        return rejectWithValue(e.response.data);
      }
      throw e;
    }
  }
);

export const googleLogin = createAsyncThunk<UserFromDb, string, {rejectValue: GlobalError}>(
  'googleLogin/post',
  async (credentials, {rejectWithValue}) => {
    try {
      const {data} = await axiosApi.post<RegisterResponse>('/users/google', {credentials});
      return data.user;
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 404) {
        return rejectWithValue(e.response.data);
      }
      throw e;
    }
  }
);

export const logout = createAsyncThunk<void, undefined, {state: RootState}>(
  'logout/user',
  async (_, {getState, dispatch}) => {
    const token = getState().users.user?.token;
    await axiosApi.delete('/users/sessions', {headers: {Authorization: `Bearer ${token}`}});
    dispatch(unsetUser());
  }
);