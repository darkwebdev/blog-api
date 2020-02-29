import { resolve } from 'path';
import { Sequelize } from 'sequelize';

export default new Sequelize({
  dialect: 'sqlite',
  storage: resolve(__dirname, '../db.sqlite3'),
  logQueryParameters: true
});
