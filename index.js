const verifyOTP = require("./verify");
const readline = require('readline');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt user for OTP
function promptForOTP() {
  return new Promise((resolve) => {
    rl.question("Enter the 6-digit OTP from your Authenticator app: ", (userOTP) => {
      // Close the readline interface
      rl.close();

      // Resolve with the entered OTP
      resolve(userOTP);
    });
  });
}

// Main verification function
async function verifyUserOTP() {
  try {
    // Get OTP from user
    const userOTP = await promptForOTP();

    // Verify the OTP
    const verificationResult = verifyOTP(userOTP);

    if (verificationResult) {
      console.log("OTP verification successful!");
    } else {
      console.log("OTP verification failed!");
    }
  } catch (error) {
    console.error("An error occurred during OTP verification:", error);
  }
}

// Run the verification
verifyUserOTP();