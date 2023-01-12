import multer from 'multer';

export const upload = multer({
    dest: './tmp',
    fileFilter: (req, files, cb) => {
        const allowed: string[] = ['image/jpeg', 'image/jpg', 'image/png'];
        (allowed.includes(files.mimetype)) ? cb(null, true) : cb(new Error('Só aceitamos imagens .jpg, .jpeg e .png!'));
    },
    limits: { fieldSize: 20000000} //roughly 2MB
})