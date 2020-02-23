import { Sequelize, Model, DataTypes, BuildOptions, Association } from 'sequelize';
import { HASH_LENGTH, MAX_USERNAME_LENGTH } from '../config';
import { Post } from './post';

export class User extends Model {
  public id!: number;
  public username!: string;
  public password!: string;

  public static associations: {
    projects: Association<User, Post>;
  };
}

export default (sequelize: Sequelize) => {
  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(MAX_USERNAME_LENGTH),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(HASH_LENGTH),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'users'
  });

  User.hasMany(Post, {
    sourceKey: 'id',
    foreignKey: 'authorId',
    as: 'posts'
  });
};
