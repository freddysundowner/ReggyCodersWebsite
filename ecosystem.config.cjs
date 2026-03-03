module.exports = {
  apps: [{
    name: "reggycodas",
    script: "dist/index.js",
    env: {
      DATABASE_URL: "postgresql://reggycodas:your_password@localhost:5432/reggycodas_db?sslmode=disable",
      PORT: 9092,
      NODE_ENV: "production"
    }
  }]
};
