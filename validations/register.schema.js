const z = require('zod')


module.exports = z.object({
    firstName: z.string().min(1,'First name must not be less than 1 char').max(32,'First name must not be more than 32 char'),
    lastName: z.string().min(1,'Last name must not be less than 1 char').max(32,'Last name must not be more than 32 char'),
    age:z.number().gte(14,'Age must not be less than 14 years old').lte(100,'Age must not be more than 100 years old'),
    howfoundusId:z.string().optional(),
    password:z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character '),
    mobile:z.string().regex(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,"Invalid number!")
  });