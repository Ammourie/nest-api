const path = require('path');
const env = process.env.NODE_ENV || 'development';

let config;

if (env === 'development') {
  config = {
    type: 'sqlite',
    database: 'db.sqlite',
    entities: ['**/*.entity.js'],
    synchronize: false,
  };
} else if (env === 'test') {
  config = {
    type: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
    synchronize: false,
  };
} else if (env === 'production') {
  config = {
    type: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
    synchronize: false,
  };
}

module.exports = config;
