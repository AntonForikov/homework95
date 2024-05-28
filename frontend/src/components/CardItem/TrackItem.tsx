import React from 'react';
import Box from '@mui/material/Box';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import {Grid, Paper, Typography} from '@mui/material';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {selectUser} from '../../store/user/userSlice';
import axiosApi from '../../axiosApi';
import DoneIcon from '@mui/icons-material/Done';
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import Button from '@mui/material/Button';
import {getTracks} from '../../store/track/truckThunk';

interface Props {
  trackId: string;
  indexNumber: string;
  title: string;
  duration: string;
  artistId: string;
  isPublished: boolean;
  createdUser: string;
  albumId?: string;
}

const TrackItem: React.FC<Props> = ({trackId, indexNumber, title, duration, artistId, albumId, isPublished, createdUser}) => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const sendTrack = async () => {
    if (!user) {
      alert('Please login before listen tracks.');
    } else {
      await axiosApi.post(`/trackHistory`, {
        track: trackId,
        artist: artistId
      }, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });
    }
  };

  const onPublish = async () => {
    await axiosApi.patch(`tracks/${trackId}/togglePublished`);
    if(albumId) dispatch(getTracks(albumId));
  };

  const onDelete = async () => {
    await axiosApi.delete(`tracks/${trackId}`);
    if(albumId) dispatch(getTracks(albumId));
  };

  return (
    <Paper
      elevation={3}
      key={trackId}
      sx={{padding: 2, marginY: 1, display: 'flex', justifyContent: 'space-between'}}
    >
      <Box sx={{display: 'flex', alignItems: 'center'}}>
        {indexNumber}. {title}
        <PlayCircleOutlineIcon
          sx={{cursor: 'pointer', marginLeft: 1}}
          onClick={sendTrack}
        />
      </Box>
      <Box>
        <Grid container alignItems="center" padding={1}>
          {
            user?.role === 'admin' &&
            <>
              <Button color="error" onClick={onDelete}>Delete</Button>
              <Button color="success" onClick={onPublish}>{!isPublished ? 'Publish' : 'Unpublish'}</Button>
            </>
          }
          {
            user?._id === createdUser && user?.role !== 'admin' &&
            <Button color="error" onClick={onDelete}>Delete</Button>
          }
          {isPublished
            ? <><Typography color="green" marginRight={1}>Published</Typography> <DoneIcon color="success" sx={{marginRight: 1}}/>{duration}</>
            : <><Typography color="red" marginRight={1}>Unpublished</Typography><UnpublishedIcon color="error" sx={{marginRight: 1}}/>{duration}</>
          }
        </Grid>
      </Box>
    </Paper>
  );
};

export default TrackItem;