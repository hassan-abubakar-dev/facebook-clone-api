import multer  from "multer";
import path from 'path';
import AppError from "../utils/AppError.js";

// for local development
// export const uploadFile = path.join(process.cwd(), 'upload/profile');
// if(!fs.existsSync(uploadFile)){
//     fs.mkdirSync(uploadFile, {recursive: true})
// }

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, uploadFile)
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuppix = Date.now() + '-' + (Math.floor(Math.random() * 2e10 + 1000));
//         cb(null, uniqueSuppix + path.extname(file.originalname));
//     }
// });

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowTypes = ['.png', '.jpg', '.jfif', '.jpeg'];
    const imageType = path.extname(file.originalname).toLocaleLowerCase();

    if(!allowTypes.includes(imageType)){
        return cb(new AppError('this type is not allow', 400), false);
    };

    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

export default upload;

