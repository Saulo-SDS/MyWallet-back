import joi from "joi";
import JoiDate from "@hapi/joi-date";
import moment from "moment";

const Joi = joi.extend(JoiDate);

const paymentSchema = Joi.object({
    value: Joi.number()
        .required(),
    type: Joi.string()
        .valid('entry', 'exit')
        .required(),
    describe: Joi.string()
    .required(),
    date: Joi.date()
        .format('YYYY-MM-DD')
        .max('now')
        .min(moment().format('YYYY-MM-DD'))
        .required()
});

const userSchema = Joi.object({
    name: Joi.string()
        .required(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: {allow: ['com', 'net', 'br']}})
        .required(),
    password: Joi.string()
        .min(6)
        .required()
});


export {
    paymentSchema,
    userSchema
}