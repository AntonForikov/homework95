import express from 'express';
import {deleteImage, imagesUpload} from '../multer';
import Cocktail from '../models/Cocktail';
import mongoose from 'mongoose';
import {ObjectId} from 'mongodb';
import auth, {Auth} from '../middleware/auth';
import permit from '../middleware/permit';

const cocktailRouter = express.Router();

cocktailRouter.post('/', auth, imagesUpload.single('image'), async (req: Auth, res, next) => {
  try {
    const {name, receipt, ingredients} = req.body;

    const cocktailData = {
      user: req.user?._id,
      name: name,
      receipt: receipt,
      image: req.file ? req.file.filename : null,
      ingredients: ingredients
    };

    const cocktail = new Cocktail(cocktailData);
    await cocktail.save();

    return res.send(cocktail);
  } catch (e) {
    if (req.file?.filename) deleteImage(req.file?.filename);
    if (e instanceof mongoose.Error.ValidationError) return res.status(422).send(e);
    next(e);
  }
});

// cocktailRouter.get('/', async (req, res, next) => {
//   const {artist} = req.query;
//
//   if(typeof artist === 'string') {
//     try {
//       let _id: ObjectId;
//       try {
//         _id = new ObjectId(artist);
//       } catch {
//         return res.status(404).send({error: 'Artist query is not ObjectId.'});
//       }
//
//       const albums = await Cocktail.find({artist: _id}).sort({year: -1});
//       if (albums.length === 0) return res.status(404).send({error: 'There is no album with such artist ID.'});
//
//       const result: AlbumWithTrackQuantity[] = [];
//
//       for (const album of albums) {
//         const albumTracks = await Track.find({album: album._id});
//         result.push({
//           _id: album._id,
//           title: album.title,
//           artist: album.artist,
//           year: album.year,
//           image: album.image,
//           isPublished: album.isPublished,
//           trackQuantity: albumTracks.length,
//           user: album.user
//         });
//       }
//
//       return res.send(result);
//     } catch (e) {
//       next(e);
//     }
//   }
//
//   try {
//     const albums = await Cocktail.find().sort({year: -1});
//     return res.send(albums);
//   } catch (e) {
//     next(e);
//   }
// });
//
// cocktailRouter.get('/:_id', async (req, res, next) => {
//   try {
//     const {_id} = req.params;
//     const targetAlbum = await Cocktail.find({_id}).populate('artistId', 'name information image');
//     return res.send(targetAlbum);
//   } catch (e) {
//     if (e instanceof mongoose.Error.CastError) return res.status(404).send({error: 'No such album'});
//     next(e);
//   }
// });
//
// cocktailRouter.patch('/:id/togglePublished', auth, permit(['admin']), async (req, res,next) => {
//   try {
//     const {id} = req.params;
//     let _id: ObjectId;
//     try {
//       _id = new ObjectId(id);
//     } catch {
//       return res.status(404).send({error: 'Cocktail id is not an ObjectId.'});
//     }
//
//     const targetAlbum = await Cocktail.findById(_id);
//
//     if (!targetAlbum) return res.status(400).send({error: 'There is no such album.'});
//
//     targetAlbum.isPublished = !targetAlbum.isPublished;
//     await targetAlbum.save();
//     return res.send(targetAlbum)
//   } catch (e) {
//     next(e);
//   }
// });
//
// cocktailRouter.delete('/:id', auth, async (req: Auth, res, next) => {
//   try {
//     const {id} = req.params;
//     let _id: ObjectId;
//     try {
//       _id = new ObjectId(id);
//     } catch {
//       return res.status(404).send({error: 'Cocktail id is not an ObjectId.'});
//     }
//
//     const targetAlbum = await Cocktail.findById(_id);
//     if (!targetAlbum) return res.status(400).send({error: 'There is no album to delete'});
//
//     if (req.user?._id.toString() === targetAlbum.user.toString() && req.user?.role === 'user') {
//       await Cocktail.deleteOne(_id);
//       await Track.deleteMany({album: _id});
//       return res.send({success: "Cocktail and it's tracks has been deleted."});
//     }
//
//     if (req.user?.role !== 'admin') return res.status(403).send({error: 'Not authorized'});
//
//     await Cocktail.deleteOne(_id);
//     await Track.deleteMany({album: _id});
//
//     return res.send({success: "Cocktail and it's tracks has been deleted."});
//   } catch (e) {
//     next(e);
//   }
// });

export default cocktailRouter;