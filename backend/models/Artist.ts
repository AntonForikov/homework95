import {Schema, model, Types} from 'mongoose';
import User from './User';

const ArtistSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  image: String || null,
  information: String || null,
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

const Artist = model('artist', ArtistSchema);

export default Artist;