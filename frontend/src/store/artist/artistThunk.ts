import {createAsyncThunk} from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi';
import {ArtistFromDb, ArtistMutation} from '../../types';

export const addArtist = createAsyncThunk(
  'addArtist/post',
  async (artist: ArtistMutation) => {
    const formData = new FormData();

    const keys = Object.keys(artist) as (keyof ArtistMutation)[];
    keys.forEach(key => {
      const value = artist[key];
      if (value !== null) formData.append(key, value);
    });

    await axiosApi.post('/artists', formData);
  }
);
export const getArtists = createAsyncThunk(
  'getArtists/get',
  async () => {
    try {
      const {data} = await axiosApi.get<ArtistFromDb[]>('/artists');
      return data;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
);

export const deleteArtist = createAsyncThunk(
  'deleteArtist/delete',
  async (id: string) => {
    await axiosApi.delete(`/artists/${id}`);
  }
);