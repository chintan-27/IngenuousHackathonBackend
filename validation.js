const Joi = require('@hapi/joi');

const registervalidation = (data) =>{
    const schema = Joi.object({
        email: Joi.string().min(10).required().email(),
        password: Joi.string().min(6).required(),
    })
    return schema.validate(data)    
}


module.exports.registervalidation = registervalidation;
