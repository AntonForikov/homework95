import {createAsyncThunk} from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi';
import {CocktailFromDb, CocktailMutation, Grade} from '../../types';


export const addCocktail = createAsyncThunk(
  'addCocktail/post',
  async (cocktail: CocktailMutation) => {

    const formData = new FormData();

    const keys = Object.keys(cocktail) as (keyof CocktailMutation)[];

    keys.forEach(key => {
      const value = cocktail[key];
      if (key === 'ingredients') formData.append(key, JSON.stringify(value));
      if (value !== null && key !== 'ingredients') formData.append(key, value);
    });
    await axiosApi.post('/cocktails', formData);
  }
);
export const getCocktails = createAsyncThunk(
  'getCocktails/get',
  async () => {
    try {
      const {data} = await axiosApi.get<CocktailFromDb[]>(`/cocktails`);
      return data;
    } catch (e) {
      return [];
    }
  }
);

export const getUserCocktails = createAsyncThunk(
  'getUserCocktails/get',
  async (id: string) => {
    try {
      const {data} = await axiosApi.get<CocktailFromDb[]>(`/cocktails?user=${id}`);
      return data;
    } catch (e) {
      return [];
    }
  }
);

export const getCocktailById = createAsyncThunk(
  'getCocktailById/get',
  async (id: string) => {
    try {
      const {data} = await axiosApi.get<CocktailFromDb>(`/cocktails/${id}`);
      return data;
    } catch (e) {
      console.error(e);
    }
  }
);

export const getOnModerate = createAsyncThunk(
  'getOnModerate/get',
  async () => {
    try {
      const {data} = await axiosApi.get('/cocktails?onModerate=true');
      return data;
    } catch (e) {
      console.error(e);
    }
  }
);

export const publishCocktail = createAsyncThunk(
  'publishCocktail/patch',
  async (id: string) => {
    await axiosApi.patch(`/cocktails/${id}/publish`);
  }
);

export const gradeCocktail = createAsyncThunk(
  'gradeCocktail/patch',
  async (grade: Grade) => {
    await axiosApi.put(`/cocktails/grade/${grade.id}`,{grade: grade.grade});
  }
);

export const deleteCocktail = createAsyncThunk(
  'deleteCocktail/delete',
  async (id: string) => {
    await axiosApi.delete(`/cocktails/${id}`);
  }
);