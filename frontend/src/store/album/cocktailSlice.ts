import {CocktailFromDb} from '../../types';
import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../../app/store';
import {getCocktailById, getCocktails, getOnModerate, getUserCocktails} from './cocktailThunk';

interface CocktailState {
  cocktail: CocktailFromDb | null;
  cocktailList: CocktailFromDb[];
  cocktailLoading: boolean;
  onModerate: boolean
}

const initialState: CocktailState = {
  cocktailList: [],
  cocktailLoading: false,
  cocktail: null,
  onModerate: false
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
    builder.addCase(getUserCocktails.pending, (state) => {
      state.cocktailLoading = true;
    }).addCase(getUserCocktails.fulfilled, (state, {payload: cocktails}) => {
      state.cocktailLoading = false;
      if (cocktails) state.cocktailList = cocktails;
    }).addCase(getUserCocktails.rejected, (state) => {
      state.cocktailLoading = false;
    });
    builder.addCase(getCocktailById.pending, (state) => {
      state.cocktailLoading = true;
    }).addCase(getCocktailById.fulfilled, (state, {payload: cocktail}) => {
      state.cocktailLoading = false;
      if (cocktail) state.cocktail = cocktail;
    }).addCase(getCocktailById.rejected, (state) => {
      state.cocktailLoading = false;
    });
    builder.addCase(getOnModerate.fulfilled, (state, {payload: onModerate}) => {
      state.onModerate = onModerate;
    });
  }
});

export const cocktailReducer = cocktailSlice.reducer;
export const selectCocktailList = (state: RootState) => state.cocktails.cocktailList;
export const selectCocktailLoading = (state: RootState) => state.cocktails.cocktailLoading;
export const selectCocktail = (state: RootState) => state.cocktails.cocktail;
export const selectOnModerate = (state: RootState) => state.cocktails.onModerate;
