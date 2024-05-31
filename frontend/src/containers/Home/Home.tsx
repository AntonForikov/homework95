import {Alert, CircularProgress, Grid, Typography} from '@mui/material';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import React, {useCallback, useEffect} from 'react';
import CardItem from '../../components/CardItem/CardItem';
import {selectCocktailList, selectCocktailLoading} from '../../store/album/cocktailSlice';
import {getCocktails, getUserCocktails} from '../../store/album/cocktailThunk';
import {selectUser} from '../../store/user/userSlice';

interface Props{
  userCocktails?: boolean
}
const Home: React.FC<Props> = ({userCocktails= false}) => {
  const cocktailList = useAppSelector(selectCocktailList);
  const loading = useAppSelector(selectCocktailLoading);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const getCocktailsInfo = useCallback(async () => {
    dispatch(getCocktails());
  }, [dispatch]);

  useEffect(() => {
    if (userCocktails && user) {
      dispatch(getUserCocktails(user?._id));
    } else {
      void getCocktailsInfo();
    }
  }, [dispatch, userCocktails, user, getCocktailsInfo]);

  return (
    <>
      <Grid container justifyContent="center" alignItems="center"  gap={3}>
        <Grid container justifyContent="center"  marginTop={3}><Typography variant="h4">Cocktails</Typography></Grid>
        {loading
          ? <CircularProgress/>
          : !loading && cocktailList.length < 1
            ? <Alert severity="warning">There is no cocktails in database</Alert>
            : cocktailList.map((cocktail) => {
              return (<CardItem
                  key={cocktail._id}
                  id={cocktail._id}
                  name={cocktail.name}
                  image={cocktail.image}
                  isPublished={cocktail.isPublished}
                />
              );
            })
        }
      </Grid>
    </>

  );
};

export default Home;