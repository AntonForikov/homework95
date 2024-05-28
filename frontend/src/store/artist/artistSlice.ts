import {ArtistFromDb} from '../../types';
import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../../app/store';
import {getArtists} from './artistThunk';

interface ArtistState {
  artistList: ArtistFromDb[],
  artistLoading: boolean,
}

const initialState: ArtistState = {
  artistList: [],
  artistLoading: false,
};

const artistSlice = createSlice({
  name: 'artists',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getArtists.pending, (state) => {
      state.artistLoading = true;
    }).addCase(getArtists.fulfilled, (state, {payload: artistList}) => {
      state.artistLoading = false;
      if (artistList) state.artistList = artistList;
    }).addCase(getArtists.rejected, (state) => {
      state.artistLoading = false;
    });
  }
});

export const artistReducer = artistSlice.reducer;
export const selectArtistList = (state: RootState) => state.artists.artistList;
export const selectArtistLoading = (state: RootState) => state.artists.artistLoading;