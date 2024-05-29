import Header from './components/Header/Header';
import Home from './containers/Home/Home';
import {Route, Routes} from 'react-router-dom';
// import Albums from './containers/AddCocktail/Albums';
// import Tracks from './containers/Tracks/Tracks';
import Register from './containers/User/Register';
import Login from './containers/User/Login';
import Container from '@mui/material/Container';
// import TrackHistory from './containers/Tracks/TrackHistory';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import {useAppSelector} from './app/hooks';
import {selectUser} from './store/user/userSlice';
import AddCocktail from './containers/AddCocktail/AddCocktail';
// import AddTrack from './containers/Tracks/AddTrack';
// import AddArtist from './containers/Artist/AddArtist';
function App() {
  const user = useAppSelector(selectUser);
  return (
    <>
      <header>
        <Header/>
      </header>
      <main>
        <Container maxWidth='xl'>
          <Routes>
            <Route path='/' element={
              <ProtectedRoute isAllowed={Boolean(user)}>
                <Home />
              </ProtectedRoute>
            }/>
            <Route path='/:id' element={
              <ProtectedRoute isAllowed={Boolean(user)}>
                <h1>here</h1>
              </ProtectedRoute>
            }/>
            <Route path='/newCocktail' element={
              <ProtectedRoute isAllowed={Boolean(user)}>
                <AddCocktail />
              </ProtectedRoute>
            }/>
            <Route path='/myCocktails' element={
              <ProtectedRoute isAllowed={Boolean(user)}>
                <Home userCocktails/>
              </ProtectedRoute>
            }/>
            <Route path='/register' element={<Register />}/>
            <Route path='/login' element={<Login />}/>
            <Route path="*" element={<h1>Not found</h1>}/>
          </Routes>
        </Container>
      </main>
    </>
  );
}

export default App;
