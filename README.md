# TOTP Demo NodeJS

## Generate QR Code

```sh
node generate_qr_code.js
```

## Add to Google Authenticator

Scan [QR Code File](./qr_code.png) from the app, you can get OTP from here now.

## Verify OTP

```sh
node index.js
```

Provide the correct OTP from the app & it will show successful otherwise failed.