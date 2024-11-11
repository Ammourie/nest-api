import { DataSource, DataSourceOptions } from 'typeorm';
const path = require('path');

const env = process.env.NODE_ENV || 'development';

let dataSourceOptions: DataSourceOptions;

if (env === 'development') {
  dataSourceOptions = {
    type: 'sqlite',
    database: 'db.sqlite',
    synchronize: false,
    entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
    migrations: [path.join(__dirname, 'migration', '*.js')],
  };
} else if (env === 'test' || env === 'production') {
  dataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
    synchronize: false,
    migrations: [path.join(__dirname, 'migration', '*.js')],
  };
} else {
  throw new Error(`Unsupported environment: ${env}`);
}

const AppDataSource = new DataSource(dataSourceOptions);

export default AppDataSource;
