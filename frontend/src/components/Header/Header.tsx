import {AppBar, Grid, Toolbar, Typography} from '@mui/material';
import {Link} from 'react-router-dom';
import {useAppSelector} from '../../app/hooks';
import {selectUser} from '../../store/user/userSlice';
import AnonymousMenu from './AnonymousMenu';
import UserMenu from './UserMenu';

const Header = () => {
  const user = useAppSelector(selectUser);
  return (
    <AppBar position='static'>
      <Toolbar>
        <Grid container justifyContent='space-between' alignItems='center'>
          <Typography variant='h5' padding={2} component={Link} to='/' sx={{color: 'inherit', textDecoration: 'none'}}>
            Spotify
          </Typography>
          <Grid>
            {user
              ? <UserMenu user={user}/>
              : <AnonymousMenu/>
            }
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;