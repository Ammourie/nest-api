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
    host: process.env.POSTGRES_HOST,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    ssl: true,  
    entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
    extra: {
      ssl: true,
    },
    synchronize: false,
    migrations: ['migrations/*.{ts,js}'],
  };
} else {
  throw new Error(`Unsupported environment: ${mode}`);
}

const AppDataSource = new DataSource(dataSourceOptions);

export default AppDataSource;
