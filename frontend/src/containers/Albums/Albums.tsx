import {Alert, CircularProgress, Grid, Typography} from '@mui/material';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {useCallback, useEffect} from 'react';
import CardItem from '../../components/CardItem/CardItem';
import {getAlbumArtist, getAlbums} from '../../store/album/albumThunk';
import {selectAlbumArtist, selectAlbumList, selectAlbumLoading} from '../../store/album/albumSlice';
import {useParams} from 'react-router-dom';
import {selectUser} from '../../store/user/userSlice';


const Albums = () => {
  const {id} = useParams();
  const albumList = useAppSelector(selectAlbumList);
  const album = useAppSelector(selectAlbumArtist);
  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectAlbumLoading);
  const dispatch = useAppDispatch();

  const getArtist = useCallback(async () => {
    if (id) {
      await dispatch(getAlbumArtist(id));
      await dispatch(getAlbums(id));
    }
  }, [dispatch, id]);

  useEffect( () => {
    void getArtist();
  }, [getArtist]);

  return (
    <>
      <Grid container justifyContent="center" alignItems="center" gap={3}>
        <Grid container justifyContent='center' marginTop={3}><Typography variant="h4">{album?.name}</Typography></Grid>
        {loading
          ? <CircularProgress/>
          : !loading && albumList.length < 1
            ? <Alert severity="warning">There is no albums with such artist in database</Alert>
            : albumList.map((album) => {
              return (album.isPublished || user?._id === album.user
                  ? <CardItem
                    key={album._id}
                    id={album._id}
                    title={album.title}
                    image={album.image}
                    trackQuantity={album.trackQuantity}
                    releaseYear={album.year}
                    isPublished={album.isPublished}
                    paramId={id}
                    createdUser={album.user}
                    albumCard
                  />
                  : user?.role === 'admin'
                  && <CardItem
                    key={album._id}
                    id={album._id}
                    title={album.title}
                    image={album.image}
                    trackQuantity={album.trackQuantity}
                    releaseYear={album.year}
                    paramId={id}
                    createdUser={album.user}
                    isPublished={album.isPublished}
                    albumCard
                  />
              );
            })
        }
      </Grid>
    </>

  );
};

export default Albums;