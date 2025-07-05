const fetch = require('node-fetch');
const FormData = require('form-data');
const cloudinary = require('cloudinary').v2;
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getImage(previewText) {
    if (!previewText || previewText.trim().length === 0) {
        return "No preview available.";
    }
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`I want to generate a cartoonize cover image based on the content below. Carefully read the article and extract the core visual theme. Respond with a single, well-crafted cartoonize image generation prompt that reflects the article’s essence. Do not include any titles, summaries, explanations, or additional text — only the raw prompt suitable for an AI image generator. Here is the content: ${previewText}`);
    const response = await result.response;
    const imagePrompt = response.text();

    // 🔐 Cloudinary Config
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECERET
    });


    const form = new FormData();
    form.append("prompt", imagePrompt);
    form.append("output_format", "jpeg");

    const stabilityResponse = await fetch("https://api.stability.ai/v2beta/stable-image/generate/sd3", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.STABILITY_API}`,
            Accept: "image/*",
            ...form.getHeaders(),
        },
        body: form,
    });


    if (!stabilityResponse.ok) {
       return null;
    }

    const buffer = Buffer.from(await stabilityResponse.arrayBuffer());

    // STEP 2: Upload to Cloudinary
    const uploadUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "image" },
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        );
        uploadStream.end(buffer);
    });

    return uploadUrl;

}

module.exports = getImage;