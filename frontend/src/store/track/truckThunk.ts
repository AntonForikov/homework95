import {createAsyncThunk} from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi';
import {TrackFromDb, TrackHistory, TrackMutation} from '../../types';

export const addTrack = createAsyncThunk(
  'addTrack/post',
  async (track: TrackMutation) => {
    try {
      axiosApi.post('/tracks', track);
    } catch (e) {
      console.error(e);
    }
  }
);

export const getTracks = createAsyncThunk(
  'getTracks/get',
  async (id: string) => {
    const {data} = await axiosApi.get<TrackFromDb[]>(`/tracks?album=${id}`);
    if (!data) return [];
    return data;
  }
);

export const getUserTracksHistory = createAsyncThunk(
  'getUserTracksHistory/get',
  async (token: string) => {
    try {
      const {data} = await axiosApi.get<TrackHistory[]>('/trackHistory', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return data;
    } catch (e) {
      console.log(e);
    }
  }
);