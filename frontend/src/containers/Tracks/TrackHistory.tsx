import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {selectUser} from '../../store/user/userSlice';
import {useNavigate} from 'react-router-dom';
import React, {useEffect} from 'react';
import {getUserTracksHistory} from '../../store/track/truckThunk';
import Box from '@mui/material/Box';
import {Alert, CircularProgress, Paper} from '@mui/material';
import {selectTrackHistoryList, selectTrackHistoryLoading} from '../../store/track/trackSlice';
import { format } from "date-fns";


const TrackHistory: React.FC = () => {
  const user = useAppSelector(selectUser);
  const trackHistoryList = useAppSelector(selectTrackHistoryList);
  const trackHistoryLoading = useAppSelector(selectTrackHistoryLoading);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();


  useEffect(() => {
    if (user?.token) dispatch(getUserTracksHistory(user?.token));
  }, [dispatch, user?.token, navigate, user]);

  return (
    <>
      {trackHistoryLoading
        ? <CircularProgress />
        : trackHistoryList.length === 0 && !trackHistoryLoading
          ? <Alert severity='warning' sx={{marginTop: 2}}>Your track history is empty</Alert>
          : trackHistoryList.map((trackHistory) => {
            return <Paper
              elevation={3}
              key={trackHistory._id}
              sx={{padding: 2, marginY: 1, display: 'flex', justifyContent: 'space-between'}}
            >
              <Box sx={{display: 'flex', alignItems: 'center'}}>
                {trackHistory.artist.name} - {trackHistory.track.title}
              </Box>
              <Box>Listen at: {
                format(new Date(trackHistory.date), 'dd-MM-yyyy, hh:mm:ss')
              }</Box>
            </Paper>;
        })
      }
    </>
  );
};

export default TrackHistory;