import {useParams} from 'react-router-dom';
import {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {selectCocktail} from '../../store/album/cocktailSlice';
import {getCocktailById} from '../../store/album/cocktailThunk';
import Grid from '@mui/material/Grid';
import no_image_available from '../../../assets/no_image_available.png';
import {apiUrl} from '../../constants';
import Typography from '@mui/material/Typography';
import StarIcon from '@mui/icons-material/Star';
import {IconButton} from '@mui/material';
import axiosApi from '../../axiosApi';
import {selectUser} from '../../store/user/userSlice';

const Cocktail = () => {
  const {id} = useParams();
  const cocktail = useAppSelector(selectCocktail);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) dispatch(getCocktailById(id));
  }, [dispatch, id]);

  let cardImage = no_image_available;
  if (cocktail?.image) cardImage = `${apiUrl}/${cocktail.image}`;

  const rating = [1, 2, 3, 4, 5];

  const gradeCocktail = async (grade: number) => {
    await axiosApi.put(`cocktails/grade/${id}`, {grade});
    if (id) dispatch(getCocktailById(id));
  };

  const ratingCounter = () => {
    const sum = cocktail?.grades.reduce((acc, grade) => {
      return acc + parseInt(grade.grade);
    }, 0);
    if (sum && cocktail) return Math.round(sum / cocktail.grades.length * 10) / 10;
  };

  const myGrade = () => {
    const targetGrade = cocktail?.grades.find((grade) => grade.user === user?._id);
    if (targetGrade) return targetGrade.grade;
  };

  return (<>
    <Grid container pt={2}>
      <Grid item mr={3}>
        <img src={cardImage} alt={cocktail?.name} width={350}/>
      </Grid>
      <Grid item>
        <Typography variant="h5" fontWeight={550}>{cocktail?.name}</Typography>
        <Typography variant="h6" fontWeight={525}>Rating: {ratingCounter()} ({cocktail?.grades.length} votes)</Typography>
        <Typography variant="h6" fontWeight={525}>Ingredients:</Typography>
        <ul>
          {cocktail?.ingredients.map(ingredient => {
            return <li>{ingredient.title} {ingredient.quantity}</li>;
          })}
        </ul>
      </Grid>
    </Grid>
    <Grid container>
      <Grid item>
        <Typography variant="h6" fontWeight={525}>Receipt:</Typography>
        <Typography>{cocktail?.receipt}</Typography>
      </Grid>
    </Grid>
    <Typography variant='h6' fontWeight={525}>My Grade: {myGrade()}</Typography>
    <Grid container>
      <Typography variant="h6">Rate: {rating.map(grade => {
        return <IconButton onClick={() => gradeCocktail(grade)}>
          <StarIcon fontSize="small" sx={{color: '#ffc400'}}></StarIcon>
        </IconButton>;
      })}
      </Typography>
    </Grid>
  </>);
};

export default Cocktail;