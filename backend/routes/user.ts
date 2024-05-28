import express from 'express';
import User from '../models/User';
import mongoose, {mongo} from 'mongoose';
import {OAuth2Client} from 'google-auth-library';
import config from '../config';
import {deleteImage, imagesUpload} from '../multer';

const userRouter = express.Router();
const client = new OAuth2Client(config.google.clientId);

userRouter.post('/', imagesUpload.single('image'), async (req, res, next) => {
  try {
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      displayName: req.body.displayName,
      image: req.file ? req.file.filename : null,
      googleID: null
    });
    user.generateToken();
    await user.save();

    return res.send({message: 'Registered successfully', user});
  } catch (e) {
    if (req.file?.filename) deleteImage(req.file?.filename);
    if (e instanceof mongoose.Error.ValidationError) return res.status(422).send(e);
    if (e instanceof mongo.MongoServerError && e.code === 11000) return res.status(422).send({error: '"email" should be an unique value.'});
    next(e);
  }
});

userRouter.post('/sessions', async (req, res, next) => {
  try {
    const user = await User.findOne({email: req.body.email});

    if (!user) return res.status(404).send({error: "Email and password doesn't match."});

    const isMatch = await user.checkPassword(req.body.password);
    if (!isMatch) return res.status(404).send({error: "Email and password doesn't match."});
    user.generateToken();
    await user.save();

    return res.send({message: 'Email and password matched.', user});
  } catch (e) {
    next(e);
  }
});

userRouter.post('/google', async (req, res, next) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.credentials,
      audience: config.google.clientId
    });

    const payload = ticket.getPayload();

    if (!payload) return res.status(400).send({error: 'Google login failed.'});

    const email = payload['email'];
    const id = payload['sub'];
    const displayName = payload['name'];
    const image = payload['picture'];

    if (!email) return res.status(400).send({error: 'Email is required.'});

    let user = await User.findOne({googleID: id});

    if (!user) {
      user = new User ({
        email,
        password: crypto.randomUUID(),
        googleID: id,
        displayName,
        image
      });
    }

    user.generateToken();
    await user.save();

    return res.send({message: 'Logged in via google', user});
  } catch (e) {
    console.log(e);
    next(e);
  }
})

userRouter.delete('/sessions', async (req, res, next) => {
  try {
    const tokenData = req.get('Authorization');
    const successMessage = {message: 'Successfully logout'};

    if (!tokenData) return res.status(401).send({error: 'No token provided'});

    const [_, token] = tokenData.split(' ');
    const user = await User.findOne({token});

    if (!user) return res.send(successMessage);

    user.generateToken();
    await user.save();

    return res.send(successMessage);
  } catch (e) {
    return next(e);
  }
});

export default userRouter;