const express = require('express');
const { User, sequelize } = require('../models/user');
const router = express.Router();
const { Sequelize, Transaction } = require('sequelize');
const { validateUpdateBalance } = require('../middlewares/validateUser');
const { updateBalance } = require('../controllers/userController');


router.post('/update-balance', validateUpdateBalance, updateBalance, async (req, res) => {
  console.log('Request body:', req.body);
  const { userId, amount } = req.body;

  if (!userId || amount === undefined) {
    return res.status(400).json({ message: 'Missing userId or amount' });
  }

const transaction = await sequelize.transaction({
  isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
});

  try {
    const user = await User.findOne({
      where: { id: userId },
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ message: 'User not found' });
    }

    const newBalance = user.balance + amount;
    if (newBalance < 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    await User.update(
      { balance: newBalance },
      { where: { id: userId }, transaction }
    );

    await transaction.commit();
    return res.json({ balance: newBalance });
  } catch (error) {
    await transaction.rollback();
    console.error('Transaction error:', error);
    return res.status(500).json({ message: 'Internal error', error: error.message });
  }
});
module.exports = router;