import React, {useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {selectLoginError, selectLoginLoading} from '../../store/user/userSlice';
import {googleLogin, login} from '../../store/user/userThunk';
import {Alert, CircularProgress} from '@mui/material';
import {GoogleLogin} from '@react-oauth/google';

const initialFields = {
  email: '',
  password: ''
};
const Login = () => {
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectLoginError);
  const loginLoading = useAppSelector(selectLoginLoading);
  const navigate = useNavigate();
  const [user, setUser] = useState(initialFields);

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const submitFormHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(login(user)).unwrap();
    navigate('/');
  };

  const googleLoginHandler = async (credential: string) => {
    await dispatch(googleLogin(credential)).unwrap();
    navigate('/');
  };

  return (
    <>
      {loginLoading
        ? <Grid container justifyContent='center' mt={2}><CircularProgress/></Grid>
        : <Container component="main" maxWidth="xs">
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
              <LockOpenIcon/>
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            {error &&
              <Alert severity="error" sx={{mt: 5, width: '100%'}}>{error.error}</Alert>
            }
            <Box sx={{pt: 2}}>
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  if (credentialResponse.credential) void googleLoginHandler(credentialResponse.credential);
                }}
                onError={() => console.log('Login error.')}
              />
            </Box>
            <Box component="form" onSubmit={submitFormHandler} sx={{mt: 1}}>
              <TextField
                margin="normal"
                fullWidth
                label="Email"
                name="email"
                value={user.email}
                onChange={changeEventHandler}
                autoFocus
              />
              <TextField
                margin="normal"
                fullWidth
                name="password"
                value={user.password}
                label="Password"
                type="password"
                onChange={changeEventHandler}
              />
              <Grid container justifyContent="space-between" alignItems="center">
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary"/>}
                  label="Remember me"
                />
                <Grid item>
                  <Link component={RouterLink} to="/register" variant="body2">
                    {'Or register?'}
                  </Link>
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{mt: 3, mb: 2}}
              >
                Sign in
              </Button>
            </Box>
          </Box>
        </Container>
      }
    </>
  );
};

export default Login;