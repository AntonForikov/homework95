import Header from './components/Header/Header';
import Home from './containers/Home/Home';
import {Route, Routes} from 'react-router-dom';
import Albums from './containers/Albums/Albums';
import Tracks from './containers/Tracks/Tracks';
import Register from './containers/User/Register';
import Login from './containers/User/Login';
import Container from '@mui/material/Container';
import TrackHistory from './containers/Tracks/TrackHistory';
import AddAlbum from './containers/Albums/AddAlbum';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import {useAppSelector} from './app/hooks';
import {selectUser} from './store/user/userSlice';
import AddTrack from './containers/Tracks/AddTrack';
import AddArtist from './containers/Artist/AddArtist';
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
            <Route path='/' element={<Home/>}/>
            <Route path='/trackHistory' element={
              <ProtectedRoute isAllowed={Boolean(user)}>
                <TrackHistory />
              </ProtectedRoute>
            }/>
            <Route path='artist/:id' element={<Albums/>}/>
            <Route path='album/:albumId' element={<Tracks/>}/>
            <Route path='/newAlbum' element={
              <ProtectedRoute isAllowed={Boolean(user)}>
                <AddAlbum/>
              </ProtectedRoute>
            }/>
            <Route path='/newTrack' element={
              <ProtectedRoute isAllowed={Boolean(user)}>
                <AddTrack/>
              </ProtectedRoute>
            }/>
            <Route path='/newArtist' element={
              <ProtectedRoute isAllowed={Boolean(user)}>
                <AddArtist/>
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
