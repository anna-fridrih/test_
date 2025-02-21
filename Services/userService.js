const { User, sequelize } = require('../models/user');
const { QueryTypes } = require('sequelize');

const MAX_RETRIES = 5;
const RETRY_DELAY = 100;

const updateBalance = async (userId, amount) => {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const [result] = await sequelize.query(
        `UPDATE "Users" 
         SET balance = balance + :amount 
         WHERE id = :userId 
           AND balance + :amount >= 0 
         RETURNING balance`,
        {
          replacements: { userId, amount },
          type: QueryTypes.UPDATE,
          plain: true,
          useMaster: true
        }
      );

      if (!result) {
        const exists = await User.count({ where: { id: userId } });
        if (!exists) throw new Error('User not found');
        throw new Error('Insufficient funds');
      }

      return result.balance;
    } catch (error) {
      if (isRetryableError(error) && attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
        continue;
      }
      throw error;
    }
  }
};

function isRetryableError(error) {
  return [
    '55P03', // lock_not_available
    '40001', // serialization_failure
    '40P01'  // deadlock_detected
  ].includes(error.parent?.code);
}

module.exports = { updateBalance };