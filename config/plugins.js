module.exports = ({ env }) => ({
  // ... deploy
  upload: {
    config: {
      provider: "cloudinary",
      providerOptions: {
        cloud_name: env("CLOUDINARY_NAME"),
        api_key: env("CLOUDINARY_KEY"),
        api_secret: env("CLOUDINARY_SECRET"),
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        host: env("SMTP_HOST", "smtp-mail.outlook.com"),
        port: env("SMTP_PORT", 587),
        auth: {
          user: env("MAILUSER"),
          pass: env("MAILSECRET"),
        },
      },
      settings: {
        defaultFrom: "admin-eval@garelli95.org",
        defaultReplyTo: "no-reply@garelli95.org",
      },
    },
  },
});
