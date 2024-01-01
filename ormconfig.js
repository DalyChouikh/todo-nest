module.exports = {
  type: 'postgres',
  host: process.env('DB_HOST'),
  port: process.env('DB_PORT'),
  username: process.env('POSTGRES_USER'),
  password: process.env('POSTGRES_PASSWORD'),
  database: process.env('POSTGRES_DB'),
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};
