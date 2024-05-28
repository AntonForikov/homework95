import {AlbumFromDb, ArtistFromDb} from '../../types';
import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../../app/store';
import {getAlbumArtist, getAlbums, getAlbumsForSelect} from './albumThunk';

interface AlbumState {
  artist: ArtistFromDb | null;
  albumList: AlbumFromDb[];
  albumLoading: boolean;
  albumsForSelect: AlbumFromDb[]
}

const initialState: AlbumState = {
  artist: null,
  albumList: [],
  albumLoading: false,
  albumsForSelect: []
};

const albumSlice = createSlice({
  name: 'albums',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAlbums.pending, (state) => {
      state.albumLoading = true;
    }).addCase(getAlbums.fulfilled, (state, {payload: artistList}) => {
      state.albumLoading = false;
      if (artistList) state.albumList = artistList;
    }).addCase(getAlbums.rejected, (state) => {
      state.albumLoading = false;
    });
    builder.addCase(getAlbumArtist.pending, (state) => {
      state.albumLoading = true;
    }).addCase(getAlbumArtist.fulfilled, (state, {payload: artist}) => {
      state.albumLoading = false;
      if (artist) state.artist = artist;
    }).addCase(getAlbumArtist.rejected, (state) => {
      state.albumLoading = false;
    });
    builder.addCase(getAlbumsForSelect.fulfilled, (state, {payload: albums}) => {
      if (albums) state.albumsForSelect = albums;
    });
  }
});

export const albumReducer = albumSlice.reducer;
export const selectAlbumList = (state: RootState) => state.albums.albumList;
export const selectAlbumForSelect = (state: RootState) => state.albums.albumsForSelect;
export const selectAlbumLoading = (state: RootState) => state.albums.albumLoading;
export const selectAlbumArtist = (state: RootState) => state.albums.artist;