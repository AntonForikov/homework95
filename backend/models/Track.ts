import {Schema, model, Types} from 'mongoose';
import Album from './Album';
import {ObjectId} from 'mongodb';
import User from './User';
import Artist from './Artist';

const TrackSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  album: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'albums',
    validate: {
      validator: async (id: ObjectId) => Album.findById(id),
      message: 'Album does not exist'
    }
  },
  artist: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'artist',
    validate: {
      validator: async (id: ObjectId) => Artist.findById(id),
      message: 'Artist does not exist'
    }
  },
  duration: {
    type: String,
    required: true
  },
  indexNumber: {
    type: Number,
    required: true,
  },
  isPublished: {
    type: Boolean,
    required: true,
    default: false
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    validate: {
      validator: async (id: Types.ObjectId) => User.findById(id),
      message: 'User does not exist!'
    }
  },
}, {versionKey: false});

const Track = model('tracks', TrackSchema);

export default Track;