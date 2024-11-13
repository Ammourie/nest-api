import { DataSource, DataSourceOptions } from 'typeorm';
const path = require('path');
const config = require('dotenv').config({ path: '.env' });

const mode = process.env.MODE;

let dataSourceOptions: DataSourceOptions;

if (mode === 'development') {
  dataSourceOptions = {
    type: 'sqlite',
    database: 'db.sqlite',
    synchronize: false,
    entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
    migrations: ['migrations/*.{ts,js}'],
  };
} else if (mode === 'test' || mode === 'production') {
  dataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
    synchronize: false,
    migrations: ['migrations/*.{ts,js}'],
  };
} else {
  throw new Error(`Unsupported environment: ${mode}`);
}

const AppDataSource = new DataSource(dataSourceOptions);

export default AppDataSource;
