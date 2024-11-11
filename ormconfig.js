const path = require('path');
const env = process.env.NODE_ENV || 'development';

let config = {
  entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
  synchronize: false,
  migrations: ['migration/*.js'],
  cli: {
    migrationsDir: 'migration',
  },
};

if (env === 'development') {
  config = Object.assign(config, {
    type: 'sqlite',
    database: 'db.sqlite',
    entities: ['**/*.entity.js'],
  });
} else if (env === 'test' || env === 'production') {
  config = Object.assign(config, {
    type: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });
}

module.exports = config;
