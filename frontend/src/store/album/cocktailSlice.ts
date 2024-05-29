import {CocktailFromDb} from '../../types';
import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../../app/store';
import {getCocktails, getUserCocktails} from './cocktailThunk';

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
    builder.addCase(getUserCocktails.pending, (state) => {
      state.cocktailLoading = true;
    }).addCase(getUserCocktails.fulfilled, (state, {payload: cocktails}) => {
      state.cocktailLoading = false;
      if (cocktails) state.cocktailList = cocktails;
    }).addCase(getUserCocktails.rejected, (state) => {
      state.cocktailLoading = false;
    });
  }
});

export const cocktailReducer = cocktailSlice.reducer;
export const selectCocktailList = (state: RootState) => state.cocktails.cocktailList;
export const selectCocktailLoading = (state: RootState) => state.cocktails.cocktailLoading;