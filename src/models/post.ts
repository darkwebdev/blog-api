import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';
import { MAX_BODY_LENGTH, MAX_TITLE_LENGTH } from '../config';

export class Post extends Model {
  public id!: number;
  public title!: string;
  public body!: string;
  public authorId!: number;
  public readonly createdAt!: Date;
}


export default (sequelize: Sequelize) =>
  Post.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
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
