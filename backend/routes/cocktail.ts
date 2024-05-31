import express from 'express';
import {deleteImage, imagesUpload} from '../multer';
import Cocktail from '../models/Cocktail';
import mongoose from 'mongoose';
import auth, {Auth} from '../middleware/auth';
import permit from '../middleware/permit';
import {ObjectId} from 'mongodb';

const cocktailRouter = express.Router();

cocktailRouter.post('/', auth, imagesUpload.single('image'), async (req: Auth, res, next) => {
  try {
    const {name, receipt, ingredients} = req.body;

    const cocktailData = {
      user: req.user?._id,
      name: name,
      receipt: receipt,
      image: req.file ? req.file.filename : null,
      ingredients: JSON.parse(ingredients)
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

cocktailRouter.get('/', auth, async (req: Auth, res, next) => {
  const {user} = req.query;

  try {
    if (req.user?.role === 'admin' && !user) {
      const allAlbums = await Cocktail.find();
      return res.send(allAlbums);
    }

    if (typeof user === 'string') {
      const userCocktails = await Cocktail.find({user});
      return res.send(userCocktails)
    }

    const publishedAlbums = await Cocktail.find({isPublished: true});
    return res.send(publishedAlbums);
  } catch (e) {
    next(e);
  }
});

cocktailRouter.get('/:_id', auth, async (req: Auth, res, next) => {
  try {
    const {_id} = req.params;
    const targetCocktail = await Cocktail.findById({_id});
    return res.send(targetCocktail);
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) return res.status(404).send({error: 'No such album'});
    next(e);
  }
});

cocktailRouter.patch('/:id/publish', auth, permit(['admin']), async (req, res, next) => {
  try {
    const {id} = req.params;
    let _id: ObjectId;
    try {
      _id = new ObjectId(id);
    } catch {
      return res.status(404).send({error: 'Cocktail id is not an ObjectId.'});
    }

    const targetCocktail = await Cocktail.findById(_id);

    if (!targetCocktail) return res.status(400).send({error: 'There is no such cocktail.'});

    targetCocktail.isPublished = true;
    await targetCocktail.save();
    return res.send(targetCocktail)
  } catch (e) {
    next(e);
  }
});

cocktailRouter.put('/grade/:id', auth, async (req: Auth, res, next) => {
  try {
    const {grade} = req.body;
    const {id} = req.params;
    const targetCocktail = await Cocktail.findById(id);
    if (!targetCocktail) return res.status(404).send({error: 'There is no such cocktail in DB.'});

    const gradeExist = targetCocktail.grades.find((grd) => {
      return grd.user?.toString() === req.user?._id.toString();
    });

    if (gradeExist) {
      targetCocktail.grades.map((gradeObj) => {
        if (gradeObj.user?.toString() === req.user?._id.toString()) {
          return gradeObj.grade = grade;
        } else {
          return gradeObj;
        }
      });
    } else {
      targetCocktail.grades.push({user: req.user?._id, grade})
    }

    await targetCocktail.save();

    return res.send(targetCocktail);
  } catch (e) {
    next(e);
  }
});

cocktailRouter.delete('/:id', auth, permit(['admin']), async (req: Auth, res, next) => {
  try {
    const {id} = req.params;
    let _id: ObjectId;
    try {
      _id = new ObjectId(id);
    } catch {
      return res.status(404).send({error: 'Cocktail id is not an ObjectId.'});
    }

    const targetCocktail = await Cocktail.findById(_id);
    if (!targetCocktail) return res.status(400).send({error: 'There is no cocktail to delete'});

    await Cocktail.deleteOne(_id);

    return res.send({success: 'Cocktail has been deleted.'});
  } catch (e) {
    next(e);
  }
});

export default cocktailRouter;