var express = require('express');
var router = express.Router();
const schema = require('../validations/register.schema')

const db = require('../models')


/* GET home page. */
router.post('/', async (req, res, next)=>{
  try {
    const data = schema.parse(req.body)
    const user =  await db.User.create(data)
    res.json({success:true,id:user.id})
  } catch (error) {
    if(error.name==='SequelizeUniqueConstraintError')
    return res.status(400).json({message:error.errors[0].message});
    res.status(400).json(error);
  }
});

module.exports = router;
