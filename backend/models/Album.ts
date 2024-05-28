import {Schema, model, Types} from 'mongoose';
import Artist from './Artist';
import User from './User';

const AlbumSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  artist: {
    type: Schema.Types.ObjectId,
    ref: 'artist',
    required: true,
    validate: {
      validator: async (id: Types.ObjectId) => Artist.findById(id),
      message: 'Artist does not exist!'
    }
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
  year: {
    type: Number,
    required: true
  },
  image: String || null,
  isPublished: {
    type: Boolean,
    required: true,
    default: false
  }
}, {versionKey: false});

const Album = model('albums', AlbumSchema);

export default Album;