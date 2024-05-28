import {
  Button,
  Grid,
  TextField,
  Typography
} from '@mui/material';
import React, {useEffect, useRef, useState} from 'react';
import {useAppDispatch} from '../../app/hooks';
import {addArtist, getArtists} from '../../store/artist/artistThunk';
import {ArtistMutation} from '../../types';
import {useNavigate} from 'react-router-dom';
import FileInput from '../../components/InputFile/FileInput';
import SendIcon from '@mui/icons-material/Send';

const initial: ArtistMutation = {
  name: '',
  image: null,
  information: ''
};

const AddArtist = () => {
  const dispatch = useAppDispatch();
  const [artist, setArtist] = useState<ArtistMutation>(initial);
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
    setArtist((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const fileInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, files} = e.target;

    if (files) {
      setArtist(prevState => ({
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
    if (artist.name[0] === ' ') return alert('Name can not begin from whitespace.');
    if (artist.information[0] === ' ') return alert('Information can not begin from whitespace.');
    try {
      setDisabler(true);
      await dispatch(addArtist(artist));
      navigate('/');
    } catch (e) {
      console.error(e);
    } finally {
      resetFileInput();
      setArtist(initial);
      setFileName('');
      setDisabler(false);
    }
  };

  return (
    <Grid container direction="column" alignItems="center" mt={2}>
      <Typography variant="h4">Add New Artist</Typography>
      <form onSubmit={onFormSubmit}>
        <Grid container direction="column" spacing={2} marginBottom={2} width={500} margin="auto">
          <Grid item xs>
            <TextField
              fullWidth
              variant="outlined"
              label="Name"
              name="name"
              value={artist.name}
              onChange={changeAlbumHandler}
              required
            />
          </Grid>
          <Grid item xs>
            <TextField
              fullWidth
              variant="outlined"
              label="Information"
              name="information"
              value={artist.information}
              onChange={changeAlbumHandler}
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

export default AddArtist;