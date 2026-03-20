import Driver from "../Models/Driver.models.js";
import apiError from "../Utils/apiError.utils.js";

const driverSignUp = async (req, res) => {
  const { name, phoneNumber, vehicleNumber, vehicleType } = req.body;
  const existingDriver = await Driver.findOne({
    phoneNumber,
    vehicleNumber,
  });

  if(existingDriver){
    throw new apiError(409,"This phoneNumber is already registered.")
  }

};
