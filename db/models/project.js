
module.exports = (sequelize, DataTypes) => {

  const project = sequelize.define(
    'project',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      isFeatured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      productImage: {
        type: DataTypes.ARRAY(DataTypes.STRING),
      },

      price: {
        type: DataTypes.DECIMAL,
      },

      shortDescription: {
        type: DataTypes.TEXT,
      },

      description: {
        type: DataTypes.TEXT,
      },

      productUrl: {
        type: DataTypes.STRING,
      },

      category: {
        type: DataTypes.ARRAY(DataTypes.STRING),
      },

      tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
      },

      createdBy: {
        type: DataTypes.INTEGER,
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      }
    },
    {
      paranoid: true,
      freezeTableName: true,
      modelName: 'project',
    }
  );

  project.associate = (models) => {
    project.belongsTo(models.users, {
      foreignKey: 'createdBy'
    });
  };

  return project;
};