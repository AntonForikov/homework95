import {Button} from '@mui/material';
import {NavLink} from 'react-router-dom';

const AnonymousMenu = () => {
  return (
    <>
      <Button component={NavLink} to='/login' sx={{color: 'inherit'}}>
        login
      </Button>
      <Button component={NavLink} to='/register' sx={{color: 'inherit'}}>
        Sign Up
      </Button>
    </>
  );
};

export default AnonymousMenu;