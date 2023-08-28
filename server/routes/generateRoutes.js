import express from 'express';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const router = express.Router();

router.route('/').get((req, res) => {
  res.status(200).json({ message: 'generated!' });
});

async function query(data) {
  const response = await fetch(
      "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
      {
          headers: { Authorization: `Bearer ${process.env.AUTH_TOKEN}`},
          method: "POST",
          body: JSON.stringify(data),
      }
  );
  if (!response.ok) {
      throw new Error("Failed to fetch the image.");
  }
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer;
}

router.route('/').post(async (req, res) => {
  try {
      const { prompt } = req.body;

      // Utilize the query function to get the image as a buffer
      const imageBuffer = await query({ "inputs": prompt });

      const base64Image = imageBuffer.toString('base64');

      const dataURL = `data:image/jpeg;base64,${base64Image}`;
      console.log(dataURL); 
      console.log('generated an image');

      // Send the data URL as a response
      res.status(200).json({ imageURL: dataURL });
  } catch (error) {
      console.error(error);
      res.status(500).send(error?.response?.data?.error?.message || 'Something went wrong');
  }
});


export default router;



