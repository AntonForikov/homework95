import express from 'express';
import artistRouter from './routes/artist';
import mongoose from 'mongoose';
import config from './config';
import albumRouter from './routes/album';
import trackRouter from './routes/track';
import userRouter from './routes/user';
import trackHistoryRoute from './routes/trackHistory';
import cors from 'cors';

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors({origin: ['http://localhost:5173']}));
app.use(express.static('public'));
app.use('/artists', artistRouter);
app.use('/albums', albumRouter);
app.use('/tracks', trackRouter);
app.use('/users', userRouter);
app.use('/trackHistory', trackHistoryRoute);

const run = async () => {
  await mongoose.connect(config.mongoose.db);

  app.listen(port, () => {
    console.log(`Server running on ${port} port.`);
  });

  process.on('exit', () => {
    mongoose.disconnect();
  });
};

void run();