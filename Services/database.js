const { Sequelize } = require('sequelize');
const { Umzug, SequelizeStorage } = require('umzug');
const path = require('path');
require('dotenv').config();

const requiredEnvVars = ['DB_USER', 'DB_PASS', 'DB_NAME', 'DB_HOST'];
requiredEnvVars.forEach(env => {
  if (!process.env[env]) throw new Error(`Missing ${env} in .env file`);
});

const sequelize = new Sequelize({
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  dialect: 'postgres',
  logging: msg => console.log(`[SQL] ${msg}`)
});

const database = new Umzug({
  migrations: {
    glob: path.join(__dirname, 'migrations/*.js'),
    resolve: ({ name, path }) => {
      const migration = require(path);
      return {
        name,
        up: async () => migration.up(sequelize.getQueryInterface(), Sequelize),
        down: async () => migration.down(sequelize.getQueryInterface(), Sequelize)
      };
    }
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  storageOptions: { sequelize },
  logger: console
});

const run = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection established');
    console.log('Starting migrations...');
    await database.up();
    console.log('All migrations completed!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

if (require.main === module) {
  run();
}

module.exports = { run };