// server/middleware/upload.js
const multer = require('multer');
const sharp = require('sharp');
const { assertS3Configuration } = require('../utils/s3');

const storage = multer.memoryStorage();
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_IMAGE_PIXELS = 25_000_000;
const MAX_IMAGE_DIMENSION = 8192;
const CONTENT_TYPES = {
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp'
};

const upload = multer({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 1,
        fields: 10,
        parts: 11
    }
});

const singleImage = (fieldName) => (req, res, next) => {
    upload.single(fieldName)(req, res, async (error) => {
        if (error) {
            const tooLarge = error instanceof multer.MulterError &&
                error.code === 'LIMIT_FILE_SIZE';
            return res.status(tooLarge ? 413 : 400).json({
                message: tooLarge
                    ? 'File exceeds the 5 MB limit'
                    : 'Invalid multipart upload'
            });
        }

        if (!req.file) return next();

        try {
            assertS3Configuration();
        } catch (storageError) {
            return res.status(500).json({
                message: 'Image storage is not configured'
            });
        }

        try {
            const image = sharp(req.file.buffer, {
                failOn: 'warning',
                limitInputPixels: MAX_IMAGE_PIXELS
            });
            const metadata = await image.metadata();
            const contentType = CONTENT_TYPES[metadata.format];

            if (!contentType) {
                return res.status(400).json({
                    message: 'Only JPEG, PNG and WebP images are allowed'
                });
            }

            if (
                !metadata.width ||
                !metadata.height ||
                metadata.width > MAX_IMAGE_DIMENSION ||
                metadata.height > MAX_IMAGE_DIMENSION ||
                metadata.width * metadata.height > MAX_IMAGE_PIXELS ||
                metadata.pages > 1
            ) {
                return res.status(413).json({
                    message: 'Image dimensions exceed the allowed limit'
                });
            }

            const outputOptions = metadata.format === 'png'
                ? { compressionLevel: 9 }
                : { quality: 85 };
            const processedBuffer = await sharp(req.file.buffer, {
                failOn: 'warning',
                limitInputPixels: MAX_IMAGE_PIXELS
            })
                .rotate()
                .toFormat(metadata.format, outputOptions)
                .toBuffer();

            if (processedBuffer.length > MAX_FILE_SIZE) {
                return res.status(413).json({
                    message: 'Processed image exceeds the 5 MB limit'
                });
            }

            req.file.buffer = processedBuffer;
            req.file.size = processedBuffer.length;
            req.file.mimetype = contentType;
            req.file.contentType = contentType;
            req.file.validatedImage = true;
            return next();
        } catch (processingError) {
            const isInputError = !processingError.code ||
                processingError.code.startsWith('ERR_INPUT_BUFFER');
            const status = isInputError ? 400 : 500;

            if (status === 500) {
                console.error('Image processing failed');
            }

            return res.status(status).json({
                message: isInputError
                    ? 'Invalid or unsupported image'
                    : 'Image processing failed'
            });
        }
    });
};

module.exports = { singleImage };