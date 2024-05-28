import {
  Card, CardContent,
  CardHeader,
  CardMedia,
  Grid,
  styled, Typography,
} from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import no_image_available from '../../../assets/no_image_available.png';
import React from 'react';
import {apiUrl} from '../../constants';
import {useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {selectUser} from '../../store/user/userSlice';
import Button from '@mui/material/Button';
import axiosApi from '../../axiosApi';
import {deleteArtist, getArtists} from '../../store/artist/artistThunk';
import {deleteAlbum, getAlbumArtist, getAlbums} from '../../store/album/albumThunk';

interface Props {
  id: string,
  title: string,
  image: string | null,
  releaseYear?: string,
  trackQuantity?: string,
  artistCard?: boolean,
  albumCard?: boolean,
  isPublished: boolean
  paramId?: string
  createdUser?: string
}

const ImageCardMedia = styled(CardMedia)({
  height: 0,
  paddingTop: '56.25%'
});

const CardItem: React.FC<Props> = ({
  id,
  title,
  image,
  trackQuantity,
  releaseYear,
  artistCard = false,
  albumCard = false,
  paramId,
  isPublished,
  createdUser
}) => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  let cardImage = no_image_available;

  if (image) cardImage = `${apiUrl}/${image}`;
  const onCardClick = () => {
    if (artistCard) navigate(`/artist/${id}`);
    if (albumCard) navigate(`/album/${id}`);
  };

  const onPublish = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (artistCard) {
      await axiosApi.patch(`/artists/${id}/togglePublished`);
      dispatch(getArtists());
    }
    if (albumCard) {
      await axiosApi.patch(`/albums/${id}/togglePublished`);
      if (paramId) {
        await dispatch(getAlbumArtist(paramId));
        await dispatch(getAlbums(paramId));
      }
    }
  };

  const onDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmation = confirm('Are you sure?');
    if (confirmation) {
      if (artistCard) {
        await dispatch(deleteArtist(id));
        dispatch(getArtists());
      }
      if (albumCard) {
        await dispatch(deleteAlbum(id));
        if (paramId) {
          await dispatch(getAlbumArtist(paramId));
          await dispatch(getAlbums(paramId));
        }
      }
    }

  };

  return (
    <Grid item xs md={3} lg={3} sx={{cursor: 'pointer'}} onClick={onCardClick}>
      <Card>
        <Grid container justifyContent="flex-end" padding={1}>
          {isPublished
            ? <><Typography color="green" marginRight={1}>Published</Typography> <DoneIcon color="success"/></>
            : <><Typography color="red" marginRight={1}>Unpublished</Typography><UnpublishedIcon color="error"/></>
          }
        </Grid>
        <CardHeader title={title} sx={{textAlign: 'center'}}/>
        <ImageCardMedia image={cardImage} title={title}/>
        {albumCard &&
          <CardContent>
            <Typography>
              Release: {releaseYear}
            </Typography>
            <Typography>
              Track quantity: {trackQuantity}
            </Typography>
          </CardContent>
        }
        <Grid container justifyContent="space-around">
          {
            user?.role === 'admin' &&
            <>
              <Button color="error" onClick={onDelete}>Delete</Button>
              <Button color="success" onClick={onPublish}>{!isPublished ? 'Publish' : 'Unpublish'}</Button>
            </>
          }
          {
            user?._id === createdUser && user?.role !== 'admin' &&
            <Button color="error" onClick={onDelete}>Delete</Button>
          }
        </Grid>
      </Card>
    </Grid>
  );
};

export default CardItem;