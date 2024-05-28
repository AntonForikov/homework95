import express from 'express';
import {deleteImage, imagesUpload} from '../multer';
import Album from '../models/Album';
import {AlbumWithTrackQuantity} from '../types';
import mongoose from 'mongoose';
import {ObjectId} from 'mongodb';
import Track from '../models/Track';
import auth, {Auth} from '../middleware/auth';
import permit from '../middleware/permit';

const albumRouter = express.Router();

albumRouter.post('/', auth, imagesUpload.single('image'), async (req: Auth, res, next) => {
  try {
    const {title, artist, year} = req.body;
    const albumData = {
      title: title,
      artist: artist,
      year: year,
      image: req.file ? req.file.filename : null,
      user: req.user?._id
    }

    const album = new Album(albumData);
    await album.save();

    return res.send(album);
  } catch (e) {
    if (req.file?.filename) deleteImage(req.file?.filename);
    if (e instanceof mongoose.Error.ValidationError) return res.status(422).send(e);
    next(e);
  }
});

albumRouter.get('/', async (req, res, next) => {
  const {artist} = req.query;

  if(typeof artist === 'string') {
    try {
      let _id: ObjectId;
      try {
        _id = new ObjectId(artist);
      } catch {
        return res.status(404).send({error: 'Artist query is not ObjectId.'});
      }

      const albums = await Album.find({artist: _id}).sort({year: -1});
      if (albums.length === 0) return res.status(404).send({error: 'There is no album with such artist ID.'});

      const result: AlbumWithTrackQuantity[] = [];

      for (const album of albums) {
        const albumTracks = await Track.find({album: album._id});
        result.push({
          _id: album._id,
          title: album.title,
          artist: album.artist,
          year: album.year,
          image: album.image,
          isPublished: album.isPublished,
          trackQuantity: albumTracks.length,
          user: album.user
        });
      }

      return res.send(result);
    } catch (e) {
      next(e);
    }
  }

  try {
    const albums = await Album.find().sort({year: -1});
    return res.send(albums);
  } catch (e) {
    next(e);
  }
});

albumRouter.get('/:_id', async (req, res, next) => {
  try {
    const {_id} = req.params;
    const targetAlbum = await Album.find({_id}).populate('artistId', 'name information image');
    return res.send(targetAlbum);
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) return res.status(404).send({error: 'No such album'});
    next(e);
  }
});

albumRouter.patch('/:id/togglePublished', auth, permit(['admin']), async (req, res,next) => {
  try {
    const {id} = req.params;
    let _id: ObjectId;
    try {
      _id = new ObjectId(id);
    } catch {
      return res.status(404).send({error: 'Album id is not an ObjectId.'});
    }

    const targetAlbum = await Album.findById(_id);

    if (!targetAlbum) return res.status(400).send({error: 'There is no such album.'});

    targetAlbum.isPublished = !targetAlbum.isPublished;
    await targetAlbum.save();
    return res.send(targetAlbum)
  } catch (e) {
    next(e);
  }
});

albumRouter.delete('/:id', auth, async (req: Auth, res, next) => {
  try {
    const {id} = req.params;
    let _id: ObjectId;
    try {
      _id = new ObjectId(id);
    } catch {
      return res.status(404).send({error: 'Album id is not an ObjectId.'});
    }

    const targetAlbum = await Album.findById(_id);
    if (!targetAlbum) return res.status(400).send({error: 'There is no album to delete'});

    if (req.user?._id.toString() === targetAlbum.user.toString() && req.user?.role === 'user') {
      await Album.deleteOne(_id);
      await Track.deleteMany({album: _id});
      return res.send({success: "Album and it's tracks has been deleted."});
    }

    if (req.user?.role !== 'admin') return res.status(403).send({error: 'Not authorized'});

    await Album.deleteOne(_id);
    await Track.deleteMany({album: _id});

    return res.send({success: "Album and it's tracks has been deleted."});
  } catch (e) {
    next(e);
  }
});

export default albumRouter;