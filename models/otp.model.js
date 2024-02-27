module.exports = (sequelize, DataTypes) => {
  const OTP = sequelize.define("OTP", {
    status: {
      type: DataTypes.ENUM("active", "expired"),
      allowNull: false,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  OTP.associate = (models) => {
    OTP.belongsTo(models.User);
  };

  return OTP;
};
