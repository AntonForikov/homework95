export interface ArtistFromDb {
  _id: string;
  name: string;
  image: string | null;
  isPublished: boolean;
  user: string;
}

export interface AlbumFromDb {
  _id: string;
  title: string;
  artist: string;
  year: string;
  image: string | null;
  trackQuantity: string;
  user: string;
  isPublished: boolean
}

export interface TrackFromDb {
  _id: string;
  title: string;
  album: {
    _id: string,
    title: string,
    artist: {
      _id: string,
      name: string
    }
  };
  duration: string;
  indexNumber: string;
  isPublished: boolean;
  user: string;
}

export interface TrackHistory {
  _id: string;
  user: string;
  track: {
    _id: string;
    title: string;

  };
  artist: {
    _id: string;
    name: string;
  };
  date: string
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

export interface AlbumMutation {
  title: string,
  image: File | null,
  artist: string,
  year: string
}

export interface ArtistMutation {
  name: string,
  information: string
  image: File | null,
}

export interface TrackMutation {
  title: string,
  artist: string,
  indexNumber: string,
  duration: string
  album: string
}

export interface GlobalError {
  error: string;
}