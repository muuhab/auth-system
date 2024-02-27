module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    firstName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: false,
      },
    },
    lastName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: false,
      },
    },
    howFoundUsId: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    mobile: {
      type: DataTypes.STRING,
      unique: true,
    },
    age: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: false,
      },
    },
    secret: {
      type: DataTypes.STRING,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  User.associate = (models) => {
    User.hasMany(models.OTP);
  };

  return User;
};
