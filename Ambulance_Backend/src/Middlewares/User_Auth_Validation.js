const Joi = require("joi");

const UserSignupValidation = (req, res, next) => {
  const user_schema = Joi.object({
    fullName: Joi.string().min(3).max(50).trim().required(),

    email: Joi.string().email().trim().required(),

    number: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .message("Phone number must be exactly 10 digits")
      .required(),

    dob: Joi.date().less("now").iso().required().messages({
      "date.base": "DOB must be a valid date",
      "date.less": "DOB must be in the past",
    }),

    gender: Joi.string().valid("male", "female", "other").required(),

    userName: Joi.string().alphanum().min(3).max(30).trim().required(),

    password: Joi.string()
      .min(8)
      .max(30)
      .required()
      .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/)
      .messages({
        "string.min": "Password must be at least 8 characters long",
        "string.pattern.base":
          "Password must contain at least one letter and one number",
      }),

    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({ "any.only": "Passwords must match" }),

    bloodGroup: Joi.string()
      .valid("A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "Unknown")
      .required(),

    prevMedic: Joi.string().allow("", null).default("None"),

    allergies: Joi.string().allow("", null).default("None"),

    emergencyName: Joi.string().min(3).max(50).trim().required(),

    emergencyNum: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .message("Emergency contact must be exactly 10 digits")
      .required(),

    location: Joi.object({
      latitude: Joi.string().allow("").optional(),
      longitude: Joi.string().allow("").optional(),
      address: Joi.string().trim().required(),
      city: Joi.string().trim().required(),
      state: Joi.string().trim().required(),
      country: Joi.string().trim().required(),
    }).required(),
  });

  const { error } = user_schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      errors: error.details.reduce((acc, curr) => {
        acc[curr.context.key] = curr.message;
        return acc;
      }, {}),
    });
  }

  next();
};

const UserLoginValidation = (req, res, next) => {
  const login_schema = Joi.object({
    identifier: Joi.alternatives()
      .try(
        Joi.string().email().trim(),
        Joi.string().alphanum().min(3).max(30).trim()
      )
      .required()
      .messages({
        "alternatives.match": "Provide a valid email or username",
      }),

    password: Joi.string()
      .min(8)
      .max(30)
      .required()
      .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/)
      .messages({
        "string.min": "Password must be at least 8 characters long",
        "string.pattern.base":
          "Password must contain at least one letter and one number",
      }),
  });

  const { error } = login_schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res
      .status(400)
      .json({ errors: error.details.map((err) => err.message) });
  }

  next();
};
module.exports = { UserSignupValidation, UserLoginValidation };
