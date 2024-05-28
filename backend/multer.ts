import multer from 'multer';
import {promises as fs} from 'fs';
import path from 'path';
import {randomUUID} from 'crypto';
import config from './config';
import {unlink} from 'node:fs';

const imageStorage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    const destDir = path.join(config.publicPath, 'images');
    await fs.mkdir(destDir, {recursive: true});
    cb(null, config.publicPath);
  },
  filename: async (_req, file, cb) => {
    const extension = path.extname(file.originalname);
    cb(null, 'images/' + randomUUID() + extension);
  }
});

export const deleteImage = (imagePath: string) => {
  unlink(path.join(config.publicPath, imagePath), (e) => {
    if (e) return console.log('File does not exist');
    console.log('File deleted');
  })
};

export const imagesUpload = multer({storage: imageStorage});