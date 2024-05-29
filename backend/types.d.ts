import {Model} from 'mongoose';
import {ObjectId} from 'mongodb';

export interface CocktailFromDB {
  _id: ObjectId;
  user: ObjectId;
  name: string;
  receipt: string;
  image?: string | null;
  isPublished: boolean;
  ingredients: [{title: string, quantity: string}];
  grades: [{user: ObjectId, grade: string}]
}

export type CocktailWithoutId = Omit<CocktailFromDB, '_id'>;

export interface UserFields {
  email: string;
  password: string;
  token: string;
  role: string;
  displayName: string,
  googleID?: string
  image?: string
}

export interface UserFromDb extends UserFields {
  _id: ObjectId
}

export interface UserMethods {
  checkPassword(password: string): Promise<boolean>;
  generateToken(): void;
}

export type UserModel = Model<UserFields, {}, UserMethods>;