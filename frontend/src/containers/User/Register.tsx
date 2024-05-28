import React, {useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {selectRegisterError, selectRegisterLoading} from '../../store/user/userSlice';
import {register} from '../../store/user/userThunk';
import {CircularProgress} from '@mui/material';
import FileInput from '../../components/InputFile/FileInput';

const initialFields = {
  email: '',
  password: '',
  displayName: '',
  image: '',
};
const Register = () => {
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectRegisterError);
  const registerLoading = useAppSelector(selectRegisterLoading);
  const navigate = useNavigate();
  const [user, setUser] = useState(initialFields);
  const [fileName, setFileName] = useState('');

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const submitFormHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user.displayName[0] === ' ' || user.email[0] === ' ') {
      alert('Display name and email can not begin from whitespace.');
    } else {
      await dispatch(register(user)).unwrap();
      navigate('/');
    }
  };

  const getFieldError = (fieldName: string) => {
    try {
      return error?.errors[fieldName].message;
    } catch {
      return undefined;
    }
  };

  const fileInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, files} = e.target;

    if (files) {
      setUser(prevState => ({
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

  return (
    <>
      {registerLoading
        ? <Grid container justifyContent='center' mt={2}><CircularProgress/></Grid>
        : <Container component='main' maxWidth='xs'>
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
              <LockOutlinedIcon/>
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" onSubmit={submitFormHandler} sx={{mt: 1}}>
              <TextField
                type='email'
                margin="normal"
                fullWidth
                label="Email"
                name="email"
                value={user.email}
                onChange={changeEventHandler}
                autoFocus
                error={Boolean(getFieldError('email'))}
                helperText={getFieldError('email')}
              />
              <TextField
                margin="normal"
                fullWidth
                name="password"
                value={user.password}
                label="Password"
                type="password"
                onChange={changeEventHandler}
                error={Boolean(getFieldError('password'))}
                helperText={getFieldError('password')}
              />
              <TextField
                margin="normal"
                fullWidth
                name="displayName"
                value={user.displayName}
                label="Display Name"
                onChange={changeEventHandler}
                error={Boolean(getFieldError('displayName'))}
                helperText={getFieldError('displayName')}
              />
              <Grid item xs>
                <FileInput
                  onChange={fileInputChangeHandler}
                  fileName={fileName}
                  name="image"
                  label="Image"
                />
              </Grid>
              <Grid container justifyContent="space-between" alignItems="center">
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary"/>}
                  label="Remember me"
                />
                <Grid item>
                  <Link component={RouterLink} to='/login' variant="body2">
                    {'Already have an account?'}
                  </Link>
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{mt: 3, mb: 2}}
              >
                Sign Up
              </Button>
            </Box>
          </Box>
        </Container>
      }
    </>

  );
};

export default Register;