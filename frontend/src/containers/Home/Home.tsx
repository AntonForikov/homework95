import {Alert, CircularProgress, Grid, Typography} from '@mui/material';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {useEffect} from 'react';
import CardItem from '../../components/CardItem/CardItem';
import {selectCocktailList, selectCocktailLoading} from '../../store/album/cocktailSlice';
import {getCocktails} from '../../store/album/cocktailThunk';

const Home = () => {
  const cocktailList = useAppSelector(selectCocktailList);
  const loading = useAppSelector(selectCocktailLoading);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCocktails());
  }, [dispatch]);

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