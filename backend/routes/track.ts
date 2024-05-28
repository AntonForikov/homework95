import express from 'express';
import {AlbumFromDB, TrackFromDb} from '../types';
import mongoose from 'mongoose';
import {ObjectId} from 'mongodb';
import Track from '../models/Track';
import Album from '../models/Album';
import auth, {Auth} from '../middleware/auth';
import permit from '../middleware/permit';
import track from '../models/Track';

const trackRouter = express.Router();

trackRouter.post('/', auth, async (req: Auth, res, next) => {
  try {
    const {title, album, duration, indexNumber, artist} = req.body;


    const trackData = {
      title: title,
      album: album,
      duration: duration,
      indexNumber: indexNumber,
      artist: artist,
      user: req.user?._id
    }

    const track = new Track(trackData);
    await track.save();

    return res.send(track);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) return res.status(422).send(e);
    if (e instanceof mongoose.Error) return res.status(422).send(e);
    next(e);
  }
});

trackRouter.get('/', async (req, res, next) => {
  const {album: albumId, artist: artistId} = req.query;

  if (artistId && typeof (artistId) === 'string') {
    try {
      let artistObjectId: ObjectId;
      try {
        artistObjectId = new ObjectId(artistId);
      } catch {
        return res.status(404).send({error: 'Artist is not an ObjectId.'});
      }

      const albumsWithTargetArtist: AlbumFromDB[]  = await Album.find({artist: artistObjectId}, {_id: 1}).sort({indexNumber: 1});
      if (albumsWithTargetArtist.length === 0) return res.status(404).send({error: 'No tracks found of this artist.'});

      const albumIds = albumsWithTargetArtist.reduce((idList, albumDoc) => {
        return [...idList, albumDoc._id];
      }, <ObjectId[]>[]);

      const tracks: TrackFromDb[] = await Track.find({album: {$in: albumIds}});

      return res.send(tracks);
    } catch (e) {
      next(e);
    }
  }

  if(albumId && typeof (albumId) === 'string') {
    try {
      let _id: ObjectId;
      try {
        _id = new ObjectId(albumId);
      } catch {
        return res.status(404).send({error: 'Album query is not an ObjectId.'});
      }

      const populationSchema = {
        path: 'album',
        select: 'title _id',
        populate: {
          path: 'artist',
          select: 'name _id',
        }
      }

      const tracks = await Track.find({album: _id}).sort({indexNumber: 1}).populate(populationSchema);
      if (tracks.length === 0) return res.status(404).send({error: 'There is no tracks with such album.'});
      return res.send(tracks);
    } catch (e) {
      next(e);
    }
  }

  try {
    const tracks = await Track.find().sort({indexNumber: 1});
    return res.send(tracks);
  } catch (e) {
    next(e);
  }
});

trackRouter.patch('/:id/togglePublished', auth, permit(['admin']), async (req, res,next) => {
  try {
    const {id} = req.params;
    let _id: ObjectId;
    try {
      _id = new ObjectId(id);
    } catch {
      return res.status(404).send({error: 'Track id is not an ObjectId.'});
    }

    const targetTrack = await Track.findById(_id);

    if (!targetTrack) return res.status(400).send({error: 'There is no such track.'});

    targetTrack.isPublished = !targetTrack.isPublished;
    await targetTrack.save();
    return res.send(targetTrack)
  } catch (e) {
    next(e);
  }
});

trackRouter.delete('/:id', auth, async (req: Auth, res, next) => {
  try {
    const {id} = req.params;
    let _id: ObjectId;
    try {
      _id = new ObjectId(id);
    } catch {
      return res.status(404).send({error: 'Track id is not an ObjectId.'});
    }

    const targetTrack = await Track.findById(_id);
    if (!targetTrack) return res.status(400).send({error: 'There is no track to delete'})

    if (req.user?._id.toString() === targetTrack.user.toString() && req.user?.role === 'user') {
      await Track.deleteOne(_id);
      return res.send({success: 'Track has been deleted.!!!!!'});
    }

    if (req.user?.role !== 'admin') return res.status(403).send({error: 'Not authorized'});

    await track.deleteOne(_id);

    return res.send({success: 'Track has been deleted.'});
  } catch (e) {
    next(e);
  }
});

export default trackRouter;