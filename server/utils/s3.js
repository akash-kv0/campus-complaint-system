const {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand
} = require('@aws-sdk/client-s3');

const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

let s3;
let s3Region;

const getS3Configuration = () => {
    const missing = ['AWS_REGION', 'AWS_S3_BUCKET'].filter(
        name => !process.env[name]?.trim()
    );

    if (missing.length > 0) {
        const error = new Error(
            `S3 is unavailable. Missing required environment variables: ${missing.join(', ')}`
        );
        error.code = 'S3_CONFIGURATION_MISSING';
        throw error;
    }

    return {
        region: process.env.AWS_REGION.trim(),
        bucket: process.env.AWS_S3_BUCKET.trim()
    };
};

const getS3Client = (region) => {
    if (!s3 || s3Region !== region) {
        s3 = new S3Client({ region });
        s3Region = region;
    }

    return s3;
};

const assertS3Configuration = () => {
    getS3Configuration();
};

const sendS3Command = async (command, region) => {
    try {
        return await getS3Client(region).send(command);
    } catch (error) {
        const safeError = new Error('S3 operation failed');
        safeError.code = 'S3_OPERATION_FAILED';
        throw safeError;
    }
};

const getObjectKey = (keyOrUrl, { bucket, region }) => {
    let value = keyOrUrl;

    for (let depth = 0; depth < 3 && /^https?:\/\//i.test(value); depth++) {
        let objectUrl;
        try {
            objectUrl = new URL(value);
        } catch (error) {
            return '';
        }

        const hostname = objectUrl.hostname.toLowerCase();
        const isVirtualHosted = hostname === `${bucket}.s3.${region}.amazonaws.com` ||
            hostname === `${bucket}.s3.amazonaws.com`;
        const isPathStyle = hostname === `s3.${region}.amazonaws.com` ||
            hostname === 's3.amazonaws.com';
        let path = objectUrl.pathname.replace(/^\/+/, '');

        if (isPathStyle) {
            const bucketPrefix = `${bucket}/`;
            if (!path.startsWith(bucketPrefix)) return '';
            path = path.slice(bucketPrefix.length);
        } else if (!isVirtualHosted) {
            return '';
        }

        try {
            value = decodeURIComponent(path);
        } catch (error) {
            return '';
        }
    }

    return /^https?:\/\//i.test(value) ? '' : value;
};

const uploadToS3 = async (file, folder) => {
    const configuration = getS3Configuration();

    if (
        file?.validatedImage !== true ||
        !['image/jpeg', 'image/png', 'image/webp'].includes(file.contentType)
    ) {
        throw new Error('Image must be validated before S3 upload');
    }

    const safeName = file.originalname.replace(
        /[^a-zA-Z0-9.-]/g,
        '-'
    );

    const key = `${folder}/${Date.now()}-${safeName}`;

    const command = new PutObjectCommand({
        Bucket: configuration.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.contentType
    });

    await sendS3Command(command, configuration.region);

    return key;
};

const getS3SignedUrl = async (key) => {
    if (!key) return '';

    const configuration = getS3Configuration();
    const objectKey = getObjectKey(key, configuration);
    if (!objectKey) return '';

    const command = new GetObjectCommand({
        Bucket: configuration.bucket,
        Key: objectKey
    });

    try {
        return await getSignedUrl(
            getS3Client(configuration.region),
            command,
            { expiresIn: 3600 }
        );
    } catch (error) {
        const safeError = new Error('S3 operation failed');
        safeError.code = 'S3_OPERATION_FAILED';
        throw safeError;
    }
};

const deleteFromS3 = async (key) => {
    if (!key) return;

    const configuration = getS3Configuration();
    const command = new DeleteObjectCommand({
        Bucket: configuration.bucket,
        Key: key
    });

    await sendS3Command(command, configuration.region);
};

module.exports = {
    assertS3Configuration,
    uploadToS3,
    getS3SignedUrl,
    deleteFromS3
};