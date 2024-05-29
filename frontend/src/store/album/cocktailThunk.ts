import {createAsyncThunk} from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi';
import {CocktailFromDb, CocktailMutation} from '../../types';


// export const addAlbum = createAsyncThunk(
//   'addAlbum/post',
//   async (album: CocktailMutation) => {
//
//     const formData = new FormData();
//
//     const keys = Object.keys(album) as (keyof CocktailMutation)[];
//
//     keys.forEach(key => {
//       const value = album[key];
//       if (value !== null) formData.append(key, value);
//     });
//     await axiosApi.post('/albums', formData);
//   }
// );
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

export const publishCocktail = createAsyncThunk(
  'publishCocktail/patch',
  async (id: string) => {
    await axiosApi.patch(`/cocktails/${id}/publish`);
  }
);

export const getAlbumsForSelect = createAsyncThunk(
  'getAlbumsForSelect/get',
  async (id: string) => {
    try {
      const {data} = await axiosApi.get<CocktailFromDb[]>(`albums?artist=${id}`);
      return data;
    } catch (e) {
      return [];
    }
  }
);

export const deleteCocktail = createAsyncThunk(
  'deleteCocktail/delete',
  async (id: string) => {
    await axiosApi.delete(`/cocktails/${id}`);
  }
);