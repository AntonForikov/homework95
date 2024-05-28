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
import React, {useEffect, useRef, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {selectArtistList} from '../../store/artist/artistSlice';
import {getArtists} from '../../store/artist/artistThunk';
import {AlbumMutation} from '../../types';
import {useNavigate} from 'react-router-dom';
import {addAlbum} from '../../store/album/albumThunk';
import FileInput from '../../components/InputFile/FileInput';
import SendIcon from '@mui/icons-material/Send';

const initial: AlbumMutation = {
  title: '',
  image: null,
  artist: '',
  year: ''
};

const AddAlbum = () => {
  const dispatch = useAppDispatch();
  const artists = useAppSelector(selectArtistList);
  const [album, setAlbum] = useState<AlbumMutation>(initial);
  const [fileName, setFileName] = useState('');
  const resetButtonRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [disabler, setDisabler] = useState(false);

  useEffect(() => {
    dispatch(getArtists());
  }, [dispatch]);

  const resetFileInput = () => {
    if (resetButtonRef.current) {
      resetButtonRef.current.click();
    }
  };

  const changeAlbumHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setAlbum((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const changeSelectHandler = (e: SelectChangeEvent) => {
    const {name, value} = e.target;
    setAlbum((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const fileInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, files} = e.target;

    if (files) {
      setAlbum(prevState => ({
        ...prevState,
        [name]: files[0]
      }));
    }
    if (files && files[0]) {
      setFileName(files[0].name);
    } else {
      setFileName('');
    }
  };

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (album.title[0] === ' ') return alert('Title can not begin from whitespace.');

    try {
      setDisabler(true);
      await dispatch(addAlbum(album));
      setDisabler(false);
      navigate('/');
    } catch (e) {
      console.error(e);
    } finally {
      resetFileInput();
      setAlbum(initial);
      setFileName('');
    }

  };

  return (
    <Grid container direction="column" alignItems="center" mt={2}>
      <Typography variant="h4">Add New Album</Typography>
      <form onSubmit={onFormSubmit}>
        <Grid container direction="column" spacing={2} marginBottom={2} width={500} margin="auto">
          <Grid item xs>
            <TextField
              fullWidth
              variant="outlined"
              label="Title"
              name="title"
              value={album.title}
              onChange={changeAlbumHandler}
              required
            />
          </Grid>
          <Grid item xs>
            <TextField
              type="number"
              fullWidth
              variant="outlined"
              label="Year"
              name="year"
              value={album.year}
              onChange={changeAlbumHandler}
              required
            />
          </Grid>
          <Grid item xs>
            <FileInput
              onChange={fileInputChangeHandler}
              fileName={fileName}
              name="image"
              label="Image"
            />
          </Grid>
          <Grid item xs>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Artist</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={album.artist}
                name="artist"
                label="Artist"
                onChange={changeSelectHandler}
                required
              >
                {artists.length > 0 &&
                  artists.map((item) => {
                    return <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>;
                  })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs>
            <Button type="submit" variant="contained" endIcon={<SendIcon/>} disabled={disabler}>
              Send
            </Button>
          </Grid>
        </Grid>
        <input
          style={{display: 'none'}}
          ref={resetButtonRef}
          type="reset"
        />
      </form>
    </Grid>
  );
};

export default AddAlbum;