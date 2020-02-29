import { Sequelize, Model, DataTypes } from 'sequelize';
import { v4 as uuid4 } from 'uuid';
import { MAX_BODY_LENGTH, MAX_TITLE_LENGTH } from '../config';

export class Post extends Model {
  public id!: string;
  public title!: string;
  public body!: string;
  public authorId!: number;
  public readonly createdAt!: Date;
}

export const initModel = (sequelize: Sequelize) =>
  Post.init({
    id: {
      type: DataTypes.UUIDV4,
      defaultValue: uuid4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(MAX_TITLE_LENGTH),
      allowNull: false
    },
    body: {
      type: DataTypes.STRING(MAX_BODY_LENGTH),
      allowNull: false
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'posts'
  });
