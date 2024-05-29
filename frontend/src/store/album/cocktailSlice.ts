import {CocktailFromDb} from '../../types';
import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../../app/store';

interface CocktailState {
  cocktailList: CocktailFromDb[];
  cocktailLoading: boolean;
}

const initialState: CocktailState = {
  cocktailList: [],
  cocktailLoading: false,
};

const cocktailSlice = createSlice({
  name: 'cocktails',
  initialState,
  reducers: {},
  // extraReducers: (builder) => {
  //   builder.addCase(getAlbums.pending, (state) => {
  //     state.albumLoading = true;
  //   }).addCase(getAlbums.fulfilled, (state, {payload: artistList}) => {
  //     state.albumLoading = false;
  //     if (artistList) state.albumList = artistList;
  //   }).addCase(getAlbums.rejected, (state) => {
  //     state.albumLoading = false;
  //   });
  //   builder.addCase(getAlbumArtist.pending, (state) => {
  //     state.albumLoading = true;
  //   }).addCase(getAlbumArtist.fulfilled, (state, {payload: artist}) => {
  //     state.albumLoading = false;
  //     if (artist) state.artist = artist;
  //   }).addCase(getAlbumArtist.rejected, (state) => {
  //     state.albumLoading = false;
  //   });
  //   builder.addCase(getAlbumsForSelect.fulfilled, (state, {payload: albums}) => {
  //     if (albums) state.albumsForSelect = albums;
  //   });
  // }
});

export const cocktailReducer = cocktailSlice.reducer;
export const selectCocktailList = (state: RootState) => state.cocktails.cocktailList;
export const selectCocktailLoading = (state: RootState) => state.cocktails.cocktailLoading;