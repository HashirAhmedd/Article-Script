const fetch = require('node-fetch');
const cloudinary = require('cloudinary').v2;
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECERET,
});

async function query(data) {
    const response = await fetch(
        "https://router.huggingface.co/nebius/v1/images/generations",
        {
            headers: {
                Authorization: `Bearer ${process.env.HF_TOKEN}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    return await response.json();
}

async function getImage(previewText) {
    if (!previewText || previewText.trim().length === 0) {
        return "No preview available.";
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(
        `I want to generate a cartoonize cover image based on the content below. Carefully read the article and extract the core visual theme. Respond with a single, well-crafted cartoonize image generation prompt that reflects the article’s essence. Do not include any titles, summaries, explanations, or additional text — only the raw prompt suitable for an AI image generator. Here is the content: ${previewText}`
    );

    const response = await result.response;
    const imagePrompt = response.text();

    const data = {
        response_format: "b64_json",
        prompt: imagePrompt,
        model: "black-forest-labs/flux-dev"
    };

    const imageResult = await query(data);
    const base64 = imageResult?.data?.[0]?.b64_json;

    if (base64) {
        const buffer = Buffer.from(base64, "base64");
        console.log("✅ Image Generated");

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
    } else {
        console.error("❌ No image found in response:", imageResult);
        return null;
    }
}

module.exports = getImage;
