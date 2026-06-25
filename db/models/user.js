// 'use strict';
// const { Model, Sequelize , DataTypes} = require('sequelize');
// const bcrypt = require('bcrypt');
// const sequelize = require('../../config/database');
// const appError = require('../../utils/appError');


// const users = sequelize.define(
//        'users', 
//        {
//           id: {
//             allowNull: false,
//             autoIncrement: true,
//             primaryKey: true,
//             type: DataTypes.INTEGER
//           },
//           userType: {
//             type: DataTypes.ENUM('0','1','2')
//           },
//           firstName: {
//             type: DataTypes.STRING
//           },
//           lastName: {
//             type: DataTypes.STRING
//           },
//           email: {
//             type: DataTypes.STRING
//           },
//           password: {
//             type: DataTypes.STRING
//           },
//           confirmPassword: {
//             type: DataTypes.VIRTUAL,
//             set(value){
//               if(value === this.password){
//                  const hashedPassword = bcrypt.hashSync(value, 10);
//                   this.setDataValue('password', hashedPassword);
//               }else{
//                 throw new Error('passwords do not match')
//               }
//             }
//           },
//           createdAt: {
//             allowNull: false,
//             type: DataTypes.DATE
//           },
//           updatedAt: {
//             allowNull: false,
//             type: DataTypes.DATE
//           },
//         deletedAt: {
//             type: DataTypes.DATE,
//         },
//       },
//         {
//           paranoid: true,
//         freezeTableName: true,
//         modelName: 'users',
//         }
      
        
//       )

//  module.exports = users;     

'use strict';

const bcrypt = require('bcrypt');
const appError = require('../../utils/appError');

module.exports = (sequelize, DataTypes) => {

  const users = sequelize.define(
    'users',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },

      userType: {
        type: DataTypes.ENUM('0', '1', '2'),
        allowNull: false,
        validate: {
          notNull:{
            msg:'userType cannot be null',

          },
          notEmpty: {
            msg: 'userType cannot be empty',
          },
        }
      },

      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'firstName cannot be null'
          },
          notEmpty: {
            msg: 'firstName cannot be empty'
          }
        }
      },

      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'lastName cannot be null'
          },
          notEmpty: {
            msg: 'lastName cannot be empty'
          }
        }
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'email cannot be null'
          },
          notEmpty: {
            msg: 'email cannot be empty'
          },
          isEmail:{
            msg:'invalid email format'
          }
        }
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'password cannot be null'
          },
          notEmpty: {
            msg: 'password cannot be empty'
          }
        }
      },

      confirmPassword: {
        type: DataTypes.VIRTUAL,
        set(value) {
          if(this.password.length < 7){
            throw new appError('password must be at least 7 characters long', 400);
          }

          if (value === this.password) {
            const hashPassword = bcrypt.hashSync(value, 10);
            this.setDataValue('password', hashPassword);
          } else {
            throw new appError('passwords do not match ',400);
          }
        }
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      deletedAt: {
      
        type: DataTypes.DATE,
      },

      
    },
    {
      paranoid: true,
      freezeTableName: true,
      modelName: 'users'
    }
  );

  return users;
};






























// 'use strict';
// const {
//   Model
// } = require('DataTypess');
// module.exports = (DataTypess, DataTypes) => {
//   class user extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of DataTypess lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   user.init({
//     userType: DataTypes.ENUM('0','1','2'),
//     firstName: DataTypes.STRING,
//     lastName: DataTypes.STRING,
//     email: DataTypes.STRING,
//     password: DataTypes.STRING,
//     confirmPassword: DataTypes.VIRTUAL,
//   }, {
//     DataTypess,
//     modelName: 'users',
//     freezeTableName: true,
//     tableName: 'users',
//   });
//   return user;
// };



// 'use strict';

// const bcrypt = require('bcrypt');

// module.exports = (sequelize, DataTypes) => {

//   const User = sequelize.define(
//     'users',
//     {
//       id: {
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         type: DataTypes.INTEGER
//       },

//       userType: {
//         type: DataTypes.ENUM('0', '1', '2')
//       },

//       firstName: {
//         type: DataTypes.STRING
//       },

//       lastName: {
//         type: DataTypes.STRING
//       },

//       email: {
//         type: DataTypes.STRING
//       },

//       password: {
//         type: DataTypes.STRING
//       },

//       confirmPassword: {
//         type: DataTypes.VIRTUAL,

//         set(value) {
//           if (value === this.password) {
//             const hashedPassword = bcrypt.hashSync(value, 10);
//             this.setDataValue('password', hashedPassword);
//           } else {
//             throw new Error('Passwords do not match');
//           }
//         }
//       },

//       createdAt: {
//         allowNull: false,
//         type: DataTypes.DATE
//       },

//       updatedAt: {
//         allowNull: false,
//         type: DataTypes.DATE
//       }
//     },
//     {
//       freezeTableName: true
//     }
//   );

//   return User;
// };