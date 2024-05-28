import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography
} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {selectArtistList} from '../../store/artist/artistSlice';
import {getArtists} from '../../store/artist/artistThunk';
import {TrackMutation} from '../../types';
import {useNavigate} from 'react-router-dom';
import {getAlbumsForSelect} from '../../store/album/albumThunk';
import SendIcon from '@mui/icons-material/Send';
import {selectAlbumForSelect} from '../../store/album/albumSlice';
import {addTrack} from '../../store/track/truckThunk';

const initial: TrackMutation = {
  title: '',
  artist: '',
  indexNumber: '',
  duration: '',
  album: ''
};

const AddTrack = () => {
  const dispatch = useAppDispatch();
  const artists = useAppSelector(selectArtistList);
  const albums = useAppSelector(selectAlbumForSelect);
  const [track, setTrack] = useState<TrackMutation>(initial);
  const navigate = useNavigate();

  const [disabler, setDisabler] = useState(false);

  useEffect(() => {
    dispatch(getArtists());
    if (track.artist !== '') dispatch(getAlbumsForSelect(track.artist));
  }, [dispatch, track.artist]);

  const changeTrackHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setTrack((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };


  const changeArtistSelectHandler = (e: SelectChangeEvent) => {
    const {name, value} = e.target;
    setTrack((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (track.title[0] === ' ') return alert('Title can not begin from whitespace.');
    if (track.duration[0] === ' ') return alert('Duration can not begin from whitespace.');

    try {
      setDisabler(true);
      await dispatch(addTrack(track));
      setDisabler(false);
      navigate('/');
    } catch (e) {
      console.error(e);
    } finally {
      setTrack(initial);
    }
  };

  return (
    <Grid container direction="column" alignItems="center" mt={2}>
      <Typography variant="h4">Add New Track</Typography>
      <form onSubmit={onFormSubmit}>
        <Grid container direction="column" spacing={2} marginBottom={2} width={500} margin="auto">
          <Grid item xs>
            <TextField
              fullWidth
              variant="outlined"
              label="Title"
              name="title"
              value={track.title}
              onChange={changeTrackHandler}
              required
            />
          </Grid>
          <Grid item xs>
            <TextField
              fullWidth
              variant="outlined"
              label="Duration"
              name="duration"
              value={track.duration}
              onChange={changeTrackHandler}
              required
            />
          </Grid>
          <Grid item xs>
            <TextField
              type='number'
              fullWidth
              variant="outlined"
              label="Index number"
              name="indexNumber"
              value={track.indexNumber}
              onChange={changeTrackHandler}
              required
            />
          </Grid>
          <Grid item xs>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Artist</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={track.artist}
                name="artist"
                label="Artist"
                onChange={changeArtistSelectHandler}
                required
              >
                {artists.length > 0 &&
                  artists.map((item) => {
                    return <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>;
                  })}
              </Select>
            </FormControl>
          </Grid>
          {albums.length > 0 && track.artist.length > 0 &&
            <Grid item xs>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Album</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={track.album}
                  name="album"
                  label="Album"
                  onChange={changeArtistSelectHandler}
                  required
                >
                  {albums.map((item) => {
                    return <MenuItem key={item._id} value={item._id}>{item.title}</MenuItem>;
                  })}
                </Select>
              </FormControl>
            </Grid>
          }
          <Grid item xs>
            <Button type="submit" variant="contained" endIcon={<SendIcon/>} disabled={disabler}>
              Send
            </Button>
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
};

export default AddTrack;