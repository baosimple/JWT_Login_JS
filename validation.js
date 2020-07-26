//VALIDATION
const Joi = require('@hapi/joi');

//Register Validation
const registerValidation = data => {
    const schema = Joi.object({
        username: Joi.string().max(16).required(),
        email: Joi.string().required().email(),
        password: Joi.string().min(8).required()
    });

    //LETS VALIDATE THE DATA BEFORE WE MAKE A USER
    return schema.validate(data);
};

const loginValidation = data => {
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().min(8).required()
    });

    //LETS VALIDATE THE DATA BEFORE WE MAKE A USER
    return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;