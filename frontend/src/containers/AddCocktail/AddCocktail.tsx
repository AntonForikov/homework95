import {
  Button,
  Grid, IconButton,
  TextField,
  Typography
} from '@mui/material';
import React, {useRef, useState} from 'react';
import {useAppDispatch} from '../../app/hooks';
import {useNavigate} from 'react-router-dom';
import FileInput from '../../components/InputFile/FileInput';
import SendIcon from '@mui/icons-material/Send';
import {CocktailWithoutIng, Ingredient} from '../../types';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import {addCocktail} from '../../store/album/cocktailThunk';

const initial: CocktailWithoutIng = {
  name: '',
  image: null,
  receipt: ''
};

const AddAlbum = () => {
  const dispatch = useAppDispatch();
  const [cocktail, setCocktail] = useState<CocktailWithoutIng>(initial);
  const [ingredients, setIngredients] = useState<Ingredient[]>([{title: '', quantity: ''}]);
  const [fileName, setFileName] = useState('');
  const resetButtonRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [disabler, setDisabler] = useState(false);
  const resetFileInput = () => {
    if (resetButtonRef.current) {
      resetButtonRef.current.click();
    }
  };

  const changeCocktailHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setCocktail((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const fileInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, files} = e.target;

    if (files) {
      setCocktail(prevState => ({
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

  const addIngredient = () => {
    setIngredients((prevState) => [...prevState, {title: '', quantity: ''}]);
  };

  const changeIngredient = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const {name, value} = e.target;

    const newIngredients = ingredients.map((item, idx) => {
      if (idx === index) return {...item, [name]: value};
      return item;
    });
    setIngredients(newIngredients);
  };

  const deleteIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, idx) => idx !== index);
    setIngredients(newIngredients);
  };

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cocktail.name[0] === ' ' || cocktail.receipt[0] === ' ') return alert('Cocktail name and receipt can not begin from whitespace.');
    const cocktailData = {
      ...cocktail,
      ingredients
    };

    try {
      setDisabler(true);
      await dispatch(addCocktail(cocktailData));
      setDisabler(false);
      navigate('/');
    } catch (e) {
      console.error(e);
    } finally {
      resetFileInput();
      setCocktail(initial);
      setFileName('');
    }
  };

  return (
    <Grid container direction="column" alignItems="center" mt={2}>
      <Typography variant="h4">Add New Cocktail</Typography>
      <form onSubmit={onFormSubmit}>
        <Grid container direction="column" spacing={2} marginBottom={2} width={700} margin="auto">
          <Grid item xs>
            <TextField
              multiline
              fullWidth
              variant="outlined"
              label="Name"
              name="name"
              value={cocktail.name}
              onChange={changeCocktailHandler}
              required
            />
          </Grid>
          <Grid item xs>
            <TextField
              fullWidth
              variant="outlined"
              label="Receipt"
              name="receipt"
              value={cocktail.receipt}
              onChange={changeCocktailHandler}
              required
            />
          </Grid>
          <Typography variant="h6" textAlign="center" pt={2}>Ingredients</Typography>
          {ingredients.map((ingredient, index) => {
            return <Box display="flex" justifyContent="space-between" py={2} ml={2} key={index} position="relative">
              <TextField
                sx={{width: '77%'}}
                variant="outlined"
                label="Title"
                name="title"
                value={ingredient.title}
                onChange={(e) => changeIngredient(e, index)}
                required
              />
              <TextField
                sx={{width: '20%'}}
                type="number"
                inputProps={{min: 1}}
                variant="outlined"
                label="Quantity"
                name="quantity"
                value={ingredient.quantity}
                onChange={(e) => changeIngredient(e, index)}
                required
              />
              {index !== 0 &&
                <IconButton
                  onClick={() => deleteIngredient(index)}
                  sx={{color: 'red', position: 'absolute', right: '-45px', bottom: '25px', cursor: 'pointer'}}
                >
                  <CloseIcon/>
                </IconButton>
              }
            </Box>;
          })}
          <Button
            variant="contained"
            color="success"
            sx={{alignSelf: 'start', ml: 2}}
            onClick={() => addIngredient()}
          >
            Add Ingredient
          </Button>
          <Grid item xs>
            <FileInput
              onChange={fileInputChangeHandler}
              fileName={fileName}
              name="image"
              label="Image"
            />
          </Grid>
          <Grid item xs>
          </Grid>
          <Grid item xs>
            <Button type="submit" variant="contained" endIcon={<SendIcon/>} disabled={disabler}>
              Send
            </Button>
          </Grid>
        </Grid>
        <input
          style={{display: 'none'}}
          ref={resetButtonRef}
          type="reset"
        />
      </form>
    </Grid>
  );
};

export default AddAlbum;