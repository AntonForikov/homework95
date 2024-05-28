import {TrackFromDb, TrackHistory} from '../../types';
import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../../app/store';
import {getTracks, getUserTracksHistory} from './truckThunk';

interface TrackState {
  albumInfo: {
    title: string;
    artist: string
  }
  trackList: TrackFromDb[],
  trackLoading: boolean,
  trackHistoryList: TrackHistory[];
  trackHistoryLoading: boolean
}

const initialState: TrackState = {
  albumInfo: {
    title: '',
    artist: ''
  },
  trackList: [],
  trackLoading: false,
  trackHistoryList: [],
  trackHistoryLoading:false
};

const trackSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTracks.pending, (state) => {
      state.trackLoading = true;
    }).addCase(getTracks.fulfilled, (state, {payload: trackList}) => {
      state.trackLoading = false;
      if (trackList.length > 0) {
        state.trackList = trackList;
        state.albumInfo.artist = trackList[0].album.artist.name;
        state.albumInfo.title = trackList[0].album.title;
      }
    }).addCase(getTracks.rejected, (state) => {
      state.trackList = [];
      state.trackLoading = false;
    });

    builder.addCase(getUserTracksHistory.pending, (state) => {
      state.trackHistoryLoading = true;
    }).addCase(getUserTracksHistory.fulfilled, (state, {payload: trackHistoryList}) => {
      state.trackHistoryLoading = false;
      if (trackHistoryList) state.trackHistoryList = trackHistoryList;
    }).addCase(getUserTracksHistory.rejected, (state) => {
      state.trackHistoryLoading = false;
    });
  }
});

export const trackReducer = trackSlice.reducer;
export const selectTrackList = (state: RootState) => state.tracks.trackList;
export const selectTrackLoading = (state: RootState) => state.tracks.trackLoading;
export const selectAlbumInfo = (state: RootState) => state.tracks.albumInfo;
export const selectTrackHistoryList = (state: RootState) => state.tracks.trackHistoryList;
export const selectTrackHistoryLoading = (state: RootState) => state.tracks.trackLoading;