import { Sequelize, Model, DataTypes, Association } from 'sequelize';
import { v4 as uuid4 } from 'uuid';
import { HASH_LENGTH, MAX_USERNAME_LENGTH } from '../config';
import { Post } from './post';

export class User extends Model {
  public id!: string;
  public username!: string;
  public password!: string;

  public static associations: {
    projects: Association<User, Post>;
  };
}

export const initModel = (sequelize: Sequelize) => {
  User.init({
    id: {
      type: DataTypes.UUIDV4,
      defaultValue: () => uuid4(),
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
    tableName: 'users',
    timestamps: false
  });

  User.hasMany(Post, {
    sourceKey: 'id',
    foreignKey: 'authorId',
    as: 'posts'
  });
};
