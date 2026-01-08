import { Client } from 'minio';
import dotenv from 'dotenv';

dotenv.config();

export const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'chat-files';

export const initializeMinIO = async () => {
  try {
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
      console.log(`Bucket "${BUCKET_NAME}" created successfully`);
    } else {
      console.log(`Bucket "${BUCKET_NAME}" already exists`);
    }
  } catch (error) {
    console.error('Error initializing MinIO:', error);
    throw error;
  }
};

export const uploadFile = async (file, fileName) => {
  try {
    const metaData = {
      'Content-Type': file.mimetype,
    };
    
    const objectName = `${Date.now()}-${fileName}`;
    await minioClient.putObject(BUCKET_NAME, objectName, file.buffer, file.size, metaData);
    
    const url = await minioClient.presignedGetObject(BUCKET_NAME, objectName, 7 * 24 * 60 * 60); // 7 days
    return {
      url,
      objectName,
      fileName: file.originalname,
      size: file.size,
      type: file.mimetype
    };
  } catch (error) {
    console.error('Error uploading file to MinIO:', error);
    throw error;
  }
};

export const deleteFile = async (objectName) => {
  try {
    await minioClient.removeObject(BUCKET_NAME, objectName);
  } catch (error) {
    console.error('Error deleting file from MinIO:', error);
    throw error;
  }
};

export { BUCKET_NAME };
