import {CocktailFromDb} from '../../types';
import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../../app/store';
import {getCocktails} from './cocktailThunk';

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
  extraReducers: (builder) => {
    builder.addCase(getCocktails.pending, (state) => {
      state.cocktailLoading = true;
    }).addCase(getCocktails.fulfilled, (state, {payload: coctailList}) => {
      state.cocktailLoading = false;
      state.cocktailList = coctailList;
    }).addCase(getCocktails.rejected, (state) => {
      state.cocktailLoading = false;
    });
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
  }
});

export const cocktailReducer = cocktailSlice.reducer;
export const selectCocktailList = (state: RootState) => state.cocktails.cocktailList;
export const selectCocktailLoading = (state: RootState) => state.cocktails.cocktailLoading;