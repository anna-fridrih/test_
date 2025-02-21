require('dotenv').config();
const express = require('express');
const cluster = require('cluster');
const os = require('os');
const { sequelize } = require('./models/user');
const { run } = require('./Services/database');
const userRoutes = require('./routes/userRoutes');
const app = express();
app.use(express.json());
app.use('/users', userRoutes);

const PORT = process.env.SERVER_PORT || 3000;
const NUM_CORES = os.cpus().length;

async function resetUser() {
  try {
    console.log('Checking database connection...');
    await sequelize.authenticate();
    console.log('Database connected.');

    console.log('Resetting user...');
    await sequelize.sync({ force: true }); // Пересоздаем таблицы
    const user = await sequelize.models.User.create({ id: 1, balance: 10000 });
    console.log('User created:', user.toJSON());
  } catch (error) {
    console.error('Error resetting user:', error);
    process.exit(1);
  }
}

if (cluster.isMaster) {
  (async () => {
    try {
      await run();
      console.log('Migrations completed.');
      await resetUser();

      for (let i = 0; i < NUM_CORES; i++) {
        cluster.fork();
      }
    } catch (error) {
      console.error('Failed to start:', error.stack);
      process.exit(1);
    }
  })();
} else {
  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} started on port ${PORT}`);
  });
}