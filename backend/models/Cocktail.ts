import {Schema, model, Types} from 'mongoose';
import User from './User';

const CocktailSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    validate: {
      validator: async (id: Types.ObjectId) => User.findById(id),
      message: 'User does not exist!'
    }
  },
  name: {
    type: String,
    required: true
  },
  receipt: {
    type: String,
    required: true
  },
  image: String || null,
  isPublished: {
    type: Boolean,
    required: true,
    default: false
  },
  ingredients: {
    type: [{
      title: String,
      quantity: String
    }],
    required: true,
    _id: false
  },
  grades: {
    type: [{
      user: Schema.Types.ObjectId,
      grade: Number
    }] || null,
    default: null
  },

}, {versionKey: false});

const Cocktail = model('Cocktail', CocktailSchema);

export default Cocktail;