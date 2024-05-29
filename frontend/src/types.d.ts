export interface CocktailWithoutIng {
  name: string,
  image: File | null,
  receipt: string,
}

export interface CocktailMutation extends CocktailWithoutIng {
  ingredients: Ingredient[]
}

export interface Ingredient {title: string, quantity: string}

export interface CocktailFromDb {
  _id: ObjectId;
  user: ObjectId;
  name: string;
  receipt: string;
  image?: string | null | undefined;
  isPublished: boolean;
  ingredients: Ingredient[];
  grades: [{user: ObjectId, grade: string}]
}

export interface UserFromDb {
  _id: string;
  email: string;
  token: string;
  role: string;
  displayName: string
  image: string
}

export interface RegisterResponse {
  user: UserFromDb;
  message: string
}

export interface ValidationError {
  errors: {
    [key: string]: {
      name: string;
      message: string;
    }
  },
  message: string;
  name: string;
  _message: string;
}

export interface RegisterMutation {
  email: string;
  password: string;
  displayName: string
}

export interface LoginMutation {
  email: string;
  password: string;
}

export interface GlobalError {
  error: string;
}