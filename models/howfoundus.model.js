
module.exports = (sequelize, DataTypes) => {
    const HowFoundUs = sequelize.define("HowFoundUs", {
      value: {
        type: DataTypes.STRING,
      },
    });
    
    return HowFoundUs;
  };


