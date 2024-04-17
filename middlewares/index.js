const { verifyToken } = require("../helpers/jwt");
const { User, Cuisine } = require("../models");
const multer = require("multer");

async function authentication(req, res, next) {
  try {
    const { authorization } = req.headers;
    if (!authorization) throw { name: "invalidToken" };
    const [type, token] = authorization.split(" ");
    if (type !== "Bearer") throw { name: "invalidToken" };
    const result = verifyToken(token);
    // console.log(result); { id: 2, iat: 1709022324 }
    const data = await User.findByPk(result.id);
    if (!data) throw { name: "invalidToken" };

    req.user = data;

    next();
  } catch (error) {
    next(error);
  }
}
async function authorization(req, res, next) {
  try {
    const { id } = req.params;
    const data = await Cuisine.findByPk(id);
    if (!data) throw { name: "notFound" };
    if (req.user.role !== "admin" && data.UserId !== req.user.id) {
      throw { name: "forbidden" };
    }
    next();
  } catch (error) {
    next(error);
  }
}

const uploader = multer({ storage: multer.memoryStorage() });

async function errHandler(error, req, res, next) {
  switch (error.name) {
    case "SequelizeValidationError":
    case "SequelizeUniqueConstraintError":
      let errors = error.errors.map((item) => {
        return item.message;
      });
      res.status(400).json({ message: errors });
      break;
    case "emailRequired":
      res.status(400).json({ message: "emailRequired" });
      break;
    case "passwordRequired":
      res.status(400).json({ message: "passwordRequired" });
      break;
    case "invalidLogin":
      res.status(401).json({ message: "error invalid email or password" });
      break;
    case "notFound":
      res.status(404).json({ message: `id ${error.id}, error not found` });
      break;
    case "JsonWebTokenError":
    case "invalidToken":
      res.status(401).json({ message: `Invalid Token` });
      break;
    case "forbidden":
      res.status(403).json({ message: `Forbidden` });
      break;
    case "notFound":
      res.status(404).json({ message: `id ${error.id}, error not found` });
      break;
    case "FileIsRequired":
      res.status(400).json({ message: `File is required` });
      break;
    default:
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
      break;
  }
}

module.exports = { authentication, authorization, uploader, errHandler };
