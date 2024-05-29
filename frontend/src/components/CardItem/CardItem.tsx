import {
  Card,
  CardMedia,
  Grid,
  styled, Typography,
} from '@mui/material';
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import no_image_available from '../../../assets/no_image_available.png';
import React from 'react';
import {apiUrl} from '../../constants';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {selectUser} from '../../store/user/userSlice';
import Button from '@mui/material/Button';
import {deleteCocktail, getCocktails, publishCocktail} from '../../store/album/cocktailThunk';
import Box from '@mui/material/Box';

interface Props {
  id: string,
  name: string,
  image: string | null| undefined,
  isPublished: boolean
}

const ImageCardMedia = styled(CardMedia)({
  height: 0,
  paddingTop: '56.25%'
});

const CardItem: React.FC<Props> = ({
  id,
  name,
  image,
  isPublished,
}) => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  let cardImage = no_image_available;

  if (image) cardImage = `${apiUrl}/${image}`;
  const onCardClick = () => {

  };

  const onPublish = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await dispatch(publishCocktail(id));
    dispatch(getCocktails());
  };

  const onDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmation = confirm('Are you sure?');
    if (confirmation) {
      await dispatch(deleteCocktail(id));
      dispatch(getCocktails());
    }
  };

  return (
    <Grid item xs md={3} lg={3} sx={{cursor: 'pointer'}} onClick={onCardClick}>
      <Card>
        <Grid container justifyContent='space-between' alignItems='center' p={1}>
          <Typography variant='h6'>{name}</Typography>
          {!isPublished &&
            <Box display='flex'>
              <><Typography color="red" marginRight={1}>Unpublished</Typography><UnpublishedIcon color="error"/></>
            </Box>
          }
        </Grid>
        <ImageCardMedia image={cardImage} title={name}/>
        <Grid container justifyContent="space-around">
          {
            user?.role === 'admin' &&
            <>
              <Button color="error" onClick={onDelete}>Delete</Button>
              {!isPublished && <Button color="success" onClick={onPublish}>Publish</Button>}
            </>
          }
        </Grid>
      </Card>
    </Grid>
  );
};

export default CardItem;