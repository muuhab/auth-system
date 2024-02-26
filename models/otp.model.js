module.exports = (sequelize, DataTypes) => {
    const OTP = sequelize.define("OTP", {
      status: {
        type: DataTypes.BOOLEAN,
      },
    });

    OTP.associate = (models)=>{
        OTP.belongsTo(models.User)
    }
    
  
    return OTP;
  };
