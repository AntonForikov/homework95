import mongoose from 'mongoose';
import config from './config';
import Artist from './models/Artist';
import Album from './models/Album';
import Track from './models/Track';
import User from './models/User';

const dropCollections = async (db: mongoose.Connection, collectionName: string) => {
  try {
    await db.dropCollection(collectionName);
  } catch {
    console.log(`Collection ${collectionName} was missing, skipping drop...`);
  }
};

const collections = ['albums', 'artists', 'tracks', 'trackhistories', 'users'];

const resetDB = async () => {
  await mongoose.connect(config.mongoose.db);
  const db = mongoose.connection;

  for (const collection of collections) await dropCollections(db, collection);

  const [user1, user2] = await User.create(
    {
      email: 'user@gmail.com',
      password: 'user',
      token: crypto.randomUUID(),
      role: 'user',
      image: null,
      googleID: null,
      displayName: 'user'
    },
    {
      email: 'admin@gmail.com',
      password: 'admin',
      token: crypto.randomUUID(),
      role: 'admin',
      image: null,
      googleID: null,
      displayName: 'admin'
    },
  )

  const [artist1, artist2, artist3] = await Artist.create(
    {
      name: 'Tool',
      image: 'fixtureImages/tool_artist.jpeg',
      information: null,
      isPublished: true,
      user: user1
    },
    {
      name: 'Pantera',
      image: null,
      information: 'Some information about Pantera',
      isPublished: true,
      user: user2
    },
    {
      name: 'Red Hot Chili Peppers',
      image: null,
      information: null,
      isPublished: false,
      user: user1
    }
  );

  const [album1, album2, album3, album4, album5] = await Album.create(
    {
      title: 'aenima',
      artist: artist1,
      year: 1996,
      image: null,
      isPublished: true,
      user: user1
    },
    {
      title: '10000 Days',
      artist: artist1,
      year: 2006,
      image: null,
      isPublished: true,
      user: user1
    },
    {
      title: 'Vulgar Display of Power',
      artist: artist2,
      year: 1992,
      image: 'fixtureImages/vulgar_display_of_power.jpeg',
      isPublished: true,
      user: user2
    },
    {
      title: 'Far Beyond Driven',
      artist: artist2,
      year: 1994,
      image: null,
      isPublished: true,
      user: user2
    },
    {
      title: 'Stadium Arcadium',
      artist: artist3,
      year: 2006,
      image: null,
      isPublished: false,
      user: user1
    }
  );

  await Track.create(
    {
      title: 'Stinkfist',
      artist: artist1,
      album: album1,
      duration: '5:11',
      indexNumber: 1,
      isPublished: true,
      user: user1
    },
    {
      title: 'Eulogy',
      album: album1,
      artist: artist1,
      duration: '8:29',
      indexNumber: 2,
      isPublished: true,
      user: user1
    },
    {
      title: 'H.',
      album: album1,
      artist: artist1,
      duration: '6:07',
      indexNumber: 3,
      isPublished: true,
      user: user1
    },
    {
      title: 'Forty Six & 2',
      album: album1,
      artist: artist1,
      duration: '8:29',
      indexNumber: 5,
      isPublished: true,
      user: user1
    },
    {
      title: 'Hooker With a Penis',
      album: album1,
      artist: artist1,
      duration: '4:34',
      indexNumber: 7,
      isPublished: true,
      user: user1
    },

    {
      title: 'Vicarious',
      album: album2,
      artist: artist1,
      duration: '7:06',
      indexNumber: 1,
      isPublished: true,
      user: user2
    },
    {
      title: 'Jambi',
      album: album2,
      artist: artist1,
      duration: '7:28',
      indexNumber: 2,
      isPublished: true,
      user: user2
    },
    {
      title: 'Wings for Marie',
      album: album2,
      artist: artist1,
      duration: '6:11',
      indexNumber: 3,
      isPublished: true,
      user: user2
    },
    {
      title: '10,000 Days',
      album: album2,
      artist: artist1,
      duration: '11:13',
      indexNumber: 4,
      isPublished: true,
      user: user2
    },
    {
      title: 'The Pot',
      album: album2,
      artist: artist1,
      duration: '6:21',
      indexNumber: 5,
      isPublished: true,
      user: user2
    },

    {
      title: 'Mouth for War',
      album: album3,
      artist: artist2,
      duration: '3:57',
      indexNumber: 1,
      isPublished: true,
      user: user2
    },
    {
      title: 'A New Level',
      album: album3,
      artist: artist2,
      duration: '3:57',
      indexNumber: 2,
      isPublished: true,
      user: user2
    },
    {
      title: 'Walk',
      album: album3,
      artist: artist2,
      duration: '5:14',
      indexNumber: 3,
      isPublished: true,
      user: user2
    },
    {
      title: 'Fucking Hostile',
      album: album3,
      artist: artist2,
      duration: '2:48',
      indexNumber: 4,
      isPublished: true,
      user: user2
    },
    {
      title: 'This Love',
      album: album3,
      artist: artist2,
      duration: '6:32',
      indexNumber: 5,
      isPublished: true,
      user: user2
    },

    {
      title: 'Strength Beyond Strength',
      album: album4,
      artist: artist2,
      duration: '3:38',
      indexNumber: 1,
      isPublished: true,
      user: user2
    },
    {
      title: 'Becoming',
      album: album4,
      artist: artist2,
      duration: '3:05',
      indexNumber: 2,
      isPublished: true,
      user: user2
    },
    {
      title: '5 Minutes Alone',
      album: album4,
      artist: artist2,
      duration: '5:47',
      indexNumber: 3,
      isPublished: true,
      user: user2
    },
    {
      title: "I'm Broken",
      album: album4,
      artist: artist2,
      duration: '4:24',
      indexNumber: 4,
      isPublished: true,
      user: user2
    },
    {
      title: 'Good Friends and a Bottle of Pills',
      album: album4,
      artist: artist2,
      duration: '2:52',
      indexNumber: 5,
      isPublished: true,
      user: user2
    },
    {
      title: 'Charlie',
      album: album5,
      artist: artist3,
      duration: '4:38',
      indexNumber: 3,
      isPublished: false,
      user: user2
    },
    {
      title: 'Hey',
      album: album5,
      artist: artist3,
      duration: '5:40',
      indexNumber: 14,
      isPublished: false,
      user: user1
    },
    {
      title: 'We Believe',
      album: album5,
      artist: artist3,
      duration: '3:36',
      indexNumber: 26,
      isPublished: false,
      user: user1
    },
  );

  await db.close();
};

void resetDB();