// const bcrypt = require('bcrypt');
// const AppError = require('../../utils/appError');

// module.exports = (sequelize, DataTypes) => {

//     const users = sequelize.define(
//         'users',
//         {
//             id: {
//                 allowNull: false,
//                 autoIncrement: true,
//                 primaryKey: true,
//                 type: DataTypes.INTEGER,
//             },

//             userType: {
//                 type: DataTypes.ENUM('0', '1', '2'),
//                 allowNull: false,
//                 validate: {
//                     notNull: {
//                         msg: 'userType cannot be null',
//                     },
//                     notEmpty: {
//                         msg: 'userType cannot be empty',
//                     },
//                 },
//             },

//             firstName: {
//                 type: DataTypes.STRING,
//                 allowNull: false,
//                 validate: {
//                     notNull: {
//                         msg: 'firstName cannot be null',
//                     },
//                     notEmpty: {
//                         msg: 'firstName cannot be empty',
//                     },
//                 },
//             },

//             lastName: {
//                 type: DataTypes.STRING,
//                 allowNull: false,
//                 validate: {
//                     notNull: {
//                         msg: 'lastName cannot be null',
//                     },
//                     notEmpty: {
//                         msg: 'lastName cannot be empty',
//                     },
//                 },
//             },

//             email: {
//                 type: DataTypes.STRING,
//                 allowNull: false,
//                 validate: {
//                     notNull: {
//                         msg: 'email cannot be null',
//                     },
//                     notEmpty: {
//                         msg: 'email cannot be empty',
//                     },
//                     isEmail: {
//                         msg: 'Invalid email id',
//                     },
//                 },
//             },

//             password: {
//                 type: DataTypes.STRING,
//                 allowNull: false,
//                 validate: {
//                     notNull: {
//                         msg: 'password cannot be null',
//                     },
//                     notEmpty: {
//                         msg: 'password cannot be empty',
//                     },
//                 },
//             },

//             confirmPassword: {
//                 type: DataTypes.VIRTUAL,
//                 set(value) {
//                     if (!this.password || this.password.length < 7) {
//                         throw new AppError(
//                             'Password length must be greater than 7',
//                             400
//                         );
//                     }

//                     if (value === this.password) {
//                         const hashPassword = bcrypt.hashSync(value, 10);
//                         this.setDataValue('password', hashPassword);
//                     } else {
//                         throw new AppError(
//                             'Password and confirm password must be the same',
//                             400
//                         );
//                     }
//                 },
//             },
//             profileImage: {
//                 type: DataTypes.STRING,
//                 allowNull: true,
//             },
//             panCard: {
//                 type: DataTypes.STRING,
//                 allowNull: true,
//             },
            
//             audioFile: {
//                 type: DataTypes.STRING,
//                 allowNull: true,
//             },

//             createdAt: {
//                 allowNull: false,
//                 type: DataTypes.DATE,
//             },

//             updatedAt: {
//                 allowNull: false,
//                 type: DataTypes.DATE,
//             },

//             deletedAt: {
//                 type: DataTypes.DATE,
//             },
//         },
//         {
//             paranoid: true,
//             freezeTableName: true,
//             modelName: 'users',
//         }
//     );

//     users.associate = (models) => {
//         users.hasMany(models.project, {
//             foreignKey: 'createdBy',
//         });
//     };

//     return users;
// };

const bcrypt = require("bcrypt");
const appError = require("../../utils/appError");

module.exports = (sequelize, DataTypes) => {
    const users = sequelize.define(
        "users",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },

            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "firstName cannot be null",
                    },
                    notEmpty: {
                        msg: "firstName cannot be empty",
                    },
                },
            },

            lastName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "lastName cannot be null",
                    },
                    notEmpty: {
                        msg: "lastName cannot be empty",
                    },
                },
            },

            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    notNull: {
                        msg: "email cannot be null",
                    },
                    notEmpty: {
                        msg: "email cannot be empty",
                    },
                    isEmail: {
                        msg: "Invalid email id",
                    },
                },
            },

            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "password cannot be null",
                    },
                    notEmpty: {
                        msg: "password cannot be empty",
                    },
                },
            },

            confirmPassword: {
                type: DataTypes.VIRTUAL,
                set(value) {
                    if (!this.password || this.password.length < 7) {
                        throw new AppError(
                            "Password length must be greater than 7",
                            400
                        );
                    }

                    if (value === this.password) {
                        const hashPassword = bcrypt.hashSync(value, 10);
                        this.setDataValue("password", hashPassword);
                    } else {
                        throw new AppError(
                            "Password and confirm password must be the same",
                            400
                        );
                    }
                },
            },

            roleId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "roles",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },

            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },

            loginAttempts: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },

            lockUntil: {
                type: DataTypes.DATE,
                allowNull: true,
            },

            profileImage: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            panCard: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            audioFile: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },

            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },

            deletedAt: {
                type: DataTypes.DATE,
            },
        },
        {
            paranoid: true,
            freezeTableName: true,
            modelName: "users",
        }
    );

    users.associate = (models) => {
        users.belongsTo(models.roles, {
            foreignKey: "roleId",
            as: "role",
        });

        users.hasMany(models.project, {
            foreignKey: "createdBy",
        });
    };

    return users;
};