import express from 'express';
import {ObjectId} from 'mongodb';
import {TrackHistoryWithoutId} from '../types';
import TrackHistory from '../models/TrackHistory';
import mongoose from 'mongoose';
import auth, {Auth} from '../middleware/auth';

const trackHistoryRoute = express.Router();

trackHistoryRoute.post('/', auth, async (req: Auth, res, next) => {
  try {
    const {track, artist} = req.body;

    let trackId: ObjectId;
    let artistId: ObjectId;
    try {
      trackId = new ObjectId(track);
      artistId = new ObjectId(artist);
    } catch (e) {
      return res.status(404).send({error: "'track' or 'artist' in not an ObjectId."});
    }

    const trackHistoryData: TrackHistoryWithoutId = {
      user: req.user?._id,
      track: trackId,
      artist: artistId,
      date: new Date()
    };

    const trackHistory = new TrackHistory(trackHistoryData);
    await trackHistory.save();

    return res.send(trackHistory);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) return res.status(422).send(e);
    next(e);
  }
});

trackHistoryRoute.get('/', auth, async (req: Auth, res, next) => {
  try {
    const targetTracks = await TrackHistory
      .find({user: req.user?._id})
      .sort({date: -1})
      .populate({path: 'artist', select: 'name'})
      .populate({path: 'track', select: 'title'});

    return res.send(targetTracks);
  } catch (e) {
    next(e);
  }
});
export default trackHistoryRoute;