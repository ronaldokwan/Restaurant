const { User, Cuisine, Category } = require("../models");
const { signToken } = require("../helpers/jwt");
const { comparePassword } = require("../helpers/bcrypt");
const axios = require("axios");
const cloudinary = require("cloudinary").v2;
const { Op } = require("sequelize");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

class Controller {
  // root
  static home(req, res, next) {
    try {
      res.status(200).json({ message: "Hi there" });
    } catch (error) {
      next(error);
    }
  }
  // register
  static async addUser(req, res, next) {
    try {
      const { email, password, username, phoneNumber, address } = req.body;
      const data = await User.create({
        email,
        password,
        username,
        phoneNumber,
        address,
      });
      res.status(201).json({
        id: data.id,
        email: data.email,
        username: data.username,
        phoneNumber: data.phoneNumber,
        address: data.address,
      });
    } catch (error) {
      next(error);
    }
  }
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email) throw { name: "emailRequired" };
      if (!password) throw { name: "passwordRequired" };

      const data = await User.findOne({ where: { email } });
      if (!data) throw { name: "invalidLogin" };

      const checkPass = comparePassword(password, data.password);
      if (!checkPass) throw { name: "invalidLogin" };

      const payload = { id: data.id };
      const token = signToken(payload);
      res.status(200).json({ token, email: data.email, role: data.role });
    } catch (error) {
      next(error);
    }
  }
  static async createCuisine(req, res, next) {
    try {
      const { name, description, price, imgUrl, categoryId } = req.body;
      const authorId = req.user.id;
      const data = await Cuisine.create({
        name,
        description,
        price,
        imgUrl,
        categoryId,
        authorId,
      });
      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }
  static async readCuisine(req, res, next) {
    try {
      const data = await Cuisine.findAll({
        include: {
          model: User,
          attributes: [
            "id",
            "username",
            "email",
            "role",
            "phoneNumber",
            "address",
          ],
        },
      });
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  static async readCuisineId(req, res, next) {
    try {
      let id = req.params.id;
      const data = await Cuisine.findOne({
        where: { id },
      });
      if (!data) {
        throw { name: "notFound", id };
      }
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  static async updateCuisineId(req, res, next) {
    try {
      let id = req.params.id;
      const { name, description, price, imgUrl, categoryId, authorId } =
        req.body;
      const data = await Cuisine.findOne({ where: { id } });
      if (!data) {
        throw { name: "notFound", id };
      }
      data.name = name;
      data.description = description;
      data.price = price;
      data.imgUrl = imgUrl;
      data.categoryId = categoryId;
      data.authorId = authorId;
      await data.save();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  static async deleteCuisineId(req, res, next) {
    try {
      let id = req.params.id;
      const data = await Cuisine.findOne({ where: { id } });
      if (!data) {
        throw { name: "notFound", id };
      }
      await data.destroy();
      res.status(200).json({ message: `Cuisine id ${id} success to delete` });
    } catch (error) {
      next(error);
    }
  }
  static async createCategory(req, res, next) {
    try {
      const { name } = req.body;
      const data = await Category.create({ name });
      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }
  static async readCategory(req, res, next) {
    try {
      const data = await Category.findAll({});
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  static async updateCategoryId(req, res, next) {
    try {
      let id = req.params.id;
      const { name } = req.body;
      const data = await Category.findOne({ where: { id } });
      if (!data) {
        throw { name: "notFound", id };
      }
      data.name = name;
      await data.save();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  static async deleteCategoryId(req, res, next) {
    try {
      let id = req.params.id;
      const data = await Category.findOne({ where: { id } });
      if (!data) {
        throw { name: "notFound", id };
      }
      await data.destroy();
      res.status(200).json({ message: `Category id ${id} success to delete` });
    } catch (error) {
      next(error);
    }
  }
  static async pubCuisine(req, res, next) {
    try {
      const { filter, sort, page, search } = req.query;
      const paramsQuerySQL = {};

      if (search) {
        paramsQuerySQL.where = {
          name: {
            [Op.iLike]: `%${search}%`,
          },
        };
      }

      if (filter) {
        paramsQuerySQL.where = {
          categoryId: filter,
        };
      }

      if (filter && search) {
        paramsQuerySQL.where = {
          [Op.and]: [
            {
              name: {
                [Op.iLike]: `%${search}%`,
              },
            },
            { categoryId: filter },
          ],
        };
      }

      if (sort) {
        const order = sort[0] === "-" ? "DESC" : "ASC";
        const columnName = order === "DESC" ? sort.slice(1) : sort;
        paramsQuerySQL.order = [[columnName, order]];
      }

      let limit = 10;
      let pageNumber = 1;
      if (page) {
        if (page.size) {
          limit = +page.size;
          paramsQuerySQL.limit = limit;
        }
        if (page.number) {
          pageNumber = +page.number;
          paramsQuerySQL.offset = limit * (pageNumber - 1);
        }
      }

      const { count, rows } = await Cuisine.findAndCountAll(paramsQuerySQL);
      res.status(200).json({
        page: pageNumber,
        data: rows,
        totalData: count,
        totalPage: Math.ceil(count / limit),
        dataPerPage: limit,
      });
    } catch (error) {
      next(error);
    }
  }
  static async pubCuisineId(req, res, next) {
    try {
      let id = req.params.id;
      const data = await Cuisine.findOne({
        where: { id },
      });
      if (!data) {
        throw { name: "notFound", id };
      }
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  static async updateImage(req, res, next) {
    try {
      const id = req.params.id;
      const data = await Cuisine.findByPk(id);
      if (!data) {
        throw { name: "notFound", id };
      }
      if (!req.file) {
        throw { name: "FileIsRequired" };
      }
      const base64Image = Buffer.from(req.file.buffer).toString("base64");
      const base64URL = `data:${req.file.mimetype};base64,${base64Image}`;

      const result = await cloudinary.uploader.upload(base64URL, {
        public_id: req.file.originalname,
      });

      await data.update({ imgUrl: result.secure_url });
      res.status(200).json({ message: `Image id ${id} success to update` });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = Controller;
