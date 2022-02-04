module.exports = {
  apps: [
    {
      name: "next-bnb-server",
      script: "build/index.js",
      env: { NODE_ENV: "production" },
    },
  ],
};
