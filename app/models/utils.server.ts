// utils/util.server.js

import type { UploadApiResponse } from "cloudinary";
import cloudinary from "cloudinary";
import { writeAsyncIterableToWritable } from "@remix-run/node";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(data: AsyncIterable<Uint8Array>) {
  const uploadPromise = new Promise<UploadApiResponse>(
    async (resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        {
          folder: "remix",
        },
        (error, result) => {
          if (error || !result) {
            reject(error);
            return;
          }
          resolve(result);
        }
      );
      await writeAsyncIterableToWritable(data, uploadStream);
    }
  );

  return uploadPromise;
}

export { uploadImage };
