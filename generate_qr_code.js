const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Load existing .env file
dotenv.config();

// Generate a secret key
const secret = speakeasy.generateSecret({ length: 20 });

// Function to generate a QR code URL for Google Authenticator
function generateQRCodeURL() {
    return new Promise((resolve, reject) => {
        QRCode.toDataURL(secret.otpauth_url, (err, dataURL) => {
            if (err) {
                reject(err);
            } else {
                resolve(dataURL);
            }
        });
    });
}

// Function to save QR code as PNG image
function saveQRCodeImage(dataURL) {
    return new Promise((resolve, reject) => {
        // Remove the data URL prefix
        const base64Data = dataURL.replace(/^data:image\/png;base64,/, "");

        // Filepath for qr_code.png in the same directory
        const filepath = path.join(__dirname, 'qr_code.png');

        // Write the image file
        fs.writeFile(filepath, base64Data, 'base64', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(filepath);
            }
        });
    });
}

// Function to write secret to .env file
function writeSecretToEnv() {
    return new Promise((resolve, reject) => {
        // Read existing .env content
        let envContent = fs.existsSync('.env') ? fs.readFileSync('.env', 'utf8') : '';

        // Remove existing SECRET_KEY line if it exists
        envContent = envContent.split('\n')
            .filter(line => !line.startsWith('SECRET_KEY='))
            .join('\n');

        // Add new SECRET_KEY line
        const newEnvContent = envContent +
            (envContent.trim() ? '\n' : '') +
            `SECRET_KEY=${secret.base32}\n`;

        // Write to .env file
        fs.writeFile('.env', newEnvContent, 'utf8', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

// Generate and process the QR code
generateQRCodeURL()
    .then((dataURL) => {
        // Write secret to .env file
        return writeSecretToEnv()
            .then(() => {
                // Save QR code image
                return saveQRCodeImage(dataURL);
            })
            .then((filepath) => {
                console.log("Add The Secret in the Authenticator app:");
                console.log(secret);
                console.log("Secret written to .env file");
                console.log("QR Code saved to:", filepath);
                console.log("Scan the QR code with the Google Authenticator app:");
                console.log(dataURL);
            });
    })
    .catch((err) => {
        console.error("Error generating QR code, writing to .env, or saving image:", err);
    });