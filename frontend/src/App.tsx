import Header from './components/Header/Header';
import Home from './containers/Home/Home';
import {Route, Routes} from 'react-router-dom';
import Register from './containers/User/Register';
import Login from './containers/User/Login';
import Container from '@mui/material/Container';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import {useAppSelector} from './app/hooks';
import {selectUser} from './store/user/userSlice';
import AddCocktail from './containers/AddCocktail/AddCocktail';
import Cocktail from './containers/Cocktail/Cocktail';
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
                <Cocktail/>
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
