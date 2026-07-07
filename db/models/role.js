module.exports = (sequelize, DataTypes) => {
    const roles = sequelize.define(
        "roles",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },

            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },

            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },

            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },
        },
        {
            freezeTableName: true,
            modelName: "roles",
        }
    );

    roles.associate = (models) => {
        roles.hasMany(models.users, {
            foreignKey: "roleId",
            as: "users",
        });
    };

    return roles;
};