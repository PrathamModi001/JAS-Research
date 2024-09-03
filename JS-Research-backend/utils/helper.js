import multer from 'multer';

export const userRoles = {
    Admin: 'Admin',
    User: 'User',
};

export const otpGenerate = async () =>
    Math.floor(100000 + Math.random() * 900000);
export const availableExtensions = ['.pdf', '.doc', '.docx'];


export const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
