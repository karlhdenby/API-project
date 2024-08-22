const data = `
  const fs = require("fs");
  const path = require("path");
  const fileData = require("./setup.js");
  
  const makeFile = (filePath, tryMessage, catchMessage) => {
    const resolvedPath = filePath.split("_");
    const lastIndex = resolvedPath.length - 1;
    if (!resolvedPath[lastIndex].includes(".") && resolvedPath[lastIndex]!=="www") {
      resolvedPath[lastIndex] = resolvedPath[lastIndex] + ".js";
    }
    const fileName = resolvedPath[lastIndex];
    try {
      const data = fileData[filePath];
      if (!data) {
        throw new Error("the filepath does not exist in fileData.js");
      }
      console.log(tryMessage || "writing " + fileName + "...");
      if (fileName.includes(".js")||fileName === "www") {
        fs.writeFileSync(path.resolve(...resolvedPath), data, "utf8");
      } else {
        fs.writeFileSync(path.join(__dirname,fileName), data.trim(), "utf8");
      }
    } catch (error) {
      console.log(catchMessage || "Error occurred while writing " + fileName);
      console.log(error);
    }
  };
  
  Object.keys(fileData).forEach((file) => makeFile(file));
  `;
  
  const sequelizeConfig = `
  const path = require("path");
  
  module.exports = {
    config: path.resolve("config", "database.js"),
    "migrations-path": path.resolve("db", "migrations"),
    "models-path": path.resolve("db", "models"),
    "seeders-path": path.resolve("db", "seeders"),
  };
  `;
  
  module.exports = {
    ".env": `
    NODE_ENV = development
    DB_FILE=db/dev.db
    JWT_SECRET= insertSecretHere
    JWT_EXPIRES_IN=604800
    SERVER_URL=http://localhost:
        `,
    config_database: `
    const config = require('./index');
    module.exports = {
      development: {
        storage: config.dbFile,
        dialect: "sqlite",
        seederStorage: "sequelize",
        logQueryParameters: true,
        typeValidation: true
      },
      production: {
        use_env_variable: 'DATABASE_URL',
        dialect: 'postgres',
        seederStorage: 'sequelize',
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        },
        define: {
          schema: process.env.SCHEMA
        }
      }
    };
    `,
    config_index: `
    module.exports = {
        environment: process.env.NODE_ENV || 'development',
        port: process.env.PORT || 8000,
        dbFile: process.env.DB_FILE,
        jwtConfig: {
          secret: process.env.JWT_SECRET,
          expiresIn: process.env.JWT_EXPIRES_IN
        }
      };
    `,
    app: `
    const express = require("express");
    require("express-async-errors");
    const cookieParser = require("cookie-parser");
    const morgan = require("morgan");
    const cors = require("cors");
    const csurf = require("csurf");
    const helmet = require("helmet");
    
    const { environment } = require("./config");
    const isProduction = environment === "production";
    
    const app = express();
    
    app.use(morgan("dev"));
    
    app.use(cookieParser());
    app.use(express.json());
    
    if (!isProduction) {
      app.use(cors());
    }
    
    app.use(
      helmet.crossOriginResourcePolicy({
        policy: "cross-origin",
      })
    );
    
    app.use(
      csurf({
        cookie: {
          secure: isProduction,
          sameSite: isProduction && "Lax",
          httpOnly: true,
        },
      })
    );
    
    const routes = require("./routes");
    app.use(routes);
    app.use((_req, _res, next) => {
      const err = new Error("The requested resource couldn't be found.");
      err.title = "Resource Not Found";
      err.errors = { message: "The requested resource couldn't be found." };
      err.status = 404;
      next(err);
    });
    const { ValidationError } = require("sequelize");
    app.use((err, _req, _res, next) => {
      if (err instanceof ValidationError) {
        let errors = {};
        for (let error of err.errors) {
          errors[error.path] = error.message;
        }
        err.title = "Validation error";
        err.errors = errors;
      }
      next(err);
    });
    app.use((err, _req, res, _next) => {
      res.status(err.status || 500);
      console.error(err);
      res.json({
        title: err.title || "Server Error",
        message: err.message,
        errors: err.errors,
        stack: isProduction ? undefined : err.stack,
      });
    });
    module.exports = app;
    `,
    routes_index: `
    const express = require("express");
    const router = express.Router();
    
    const apiRouter = require("./API");
    router.use("/api", apiRouter);
    
    if (process.env.NODE_ENV === "production") {
      const path = require("path");
      // Serve the frontend's index.html file at the root route
      router.get("/", (req, res) => {
        res.cookie("XSRF-TOKEN", req.csrfToken());
        res.sendFile(
          path.resolve(__dirname, "../../frontend", "dist", "index.html")
        );
      });
    
      // Serve the static assets in the frontend's build folder
      router.use(express.static(path.resolve("../frontend/dist")));
    
      // Serve the frontend's index.html file at all other routes NOT starting with /api
      router.get(/^(?!\\/?api).*/, (req, res) => {
        res.cookie("XSRF-TOKEN", req.csrfToken());
        res.sendFile(
          path.resolve(__dirname, "../../frontend", "dist", "index.html")
        );
      });
    }
    
    if (process.env.NODE_ENV !== "production")
      router.get("/api/csrf/restore", (req, res) => {
        const csrfToken = req.csrfToken();
        res.cookie("XSRF-TOKEN", csrfToken);
        res.status(200).json({
          "XSRF-Token": csrfToken,
        });
      });
    
    module.exports = router;
    `,
    routes_API_index: `
    const router = require("express").Router();
    
    const { restoreUser } = require("../../utils/auth.js");
    
    router.use(restoreUser);
    
    const addRoute = (name) => router.use("/" + name, require("./" + name));
  
    addRoute("session");
    addRoute("users");
    
    module.exports = router;
    `,
    routes_API_session:`
    const express = require("express");
  const { Op } = require("sequelize");
  const bcrypt = require("bcryptjs");
  
  const { setTokenCookie} = require("../../utils/auth");
  const { User } = require("../../db/models");
  
  const { check } = require("express-validator");
  const { handleValidationErrors } = require("../../utils/validation");
  
  const validateLogin = [
    (req, res, next) => {
      const { credential, username, email } = req.body;
      req.body.credential = credential? credential: username ? username : email;
      return next();
    },
    check("credential")
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage("Email or username is required"),
    check("email")
    .optional()
      .isEmail()
      .withMessage("Please provide a valid email."),
    check("username")
      .optional()
      .notEmpty()
      .withMessage("Please provide a valid username."),
    check("password")
      .exists({ checkFalsy: true })
      .withMessage("Password is required"),
    handleValidationErrors,
  ];
  
  const router = express.Router();
  
  /*                        LOG IN                         */
  
  router.post("/", validateLogin, async (req, res, next) => {
      const { username, password, email, credential } = req.body;
      try {
          if (!((username || email) && password)&&!credential)
              throw new Error("insufficient credentials given");
          const user = await User.unscoped().findOne({
              where: {
                  [Op.or]: { username: credential, email: credential },
              },
          });
          
          const error = new Error("Invalid credentials");
          error.status = 401;
          error.title = "Login failed";
          
          if (!user) {
              error.errors = { credential: "Invalid Username or email" };
              throw error;
          }
          if (!bcrypt.compareSync(password, user.hashedPassword.toString())) {
              error.errors = { credential: "Incorrect Password" };
              throw error;
          }
          
          const safeUser = {
              id: user.id,
              email: user.email,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
          };
          
          await setTokenCookie(res, safeUser);
          
          return res.json({ user: safeUser });
      } catch (err) {
          if(err.status === 401){
              return res.status(401).json({message:err.message})
          }
          next(err);
      }
  });
  
  /*                        LOG OUT                         */
  
  router.delete("/", (_req, res) => {
      // console.log(_req);
      res.clearCookie("token");
      return res.json({ message: "success" });
  });
  
  router.get("/", (req, res) => {
    const { user } = req;
    if (user) {
      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      };
      return res.json({ user: safeUser });
    } else return res.json({ user: null });
  });
  
  module.exports = router;`,
  routes_API_users:`
  const express = require("express");
  const bcrypt = require("bcryptjs");
  
  const { setTokenCookie, requireAuth } = require("../../utils/auth");
  const { User } = require("../../db/models");
  
  const { check } = require("express-validator");
  const { handleValidationErrors } = require("../../utils/validation");
  
  const router = express.Router();
  
  const validateSignup = [
    check("email")
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage("Invalid email"),
    check("username")
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage("Please provide a username with at least 4 characters."),
    check("username").not().isEmail().withMessage("Username cannot be an email."),
    check("password")
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage("Password must be 6 characters or more."),
    check("firstName")
      .exists({ checkFalsy: true })
      .withMessage("First Name is required"),
    check("lastName")
      .exists({ checkFalsy: true })
      .withMessage("Last Name is required"),
    handleValidationErrors,
  ];
  
  router.post("/", validateSignup, async (req, res, next) => {
    const { email, password, username, firstName, lastName } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    try {
      const user = await User.create({
        email,
        username,
        hashedPassword,
        firstName,
        lastName,
      });
  
      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      };
  
      await setTokenCookie(res, safeUser);
  
      return res.status(201).json({
        user: safeUser,
      });
    } catch (err) {
      next(err);
    }
  });
  
  router.use("/", (err, req, res, next) => {
    if(!err) next()
    const error = { message: "User already exists", errors: {} };
    if (req.url !== "/") return next(err);
    if(!Array.isArray(err)) return next(err)
    const {errors:[...errors]} = err;
    errors.forEach((e) => {
      if (e.path === "email")
        error.errors.email = "User with that email already exists";
      if (e.path === "username")
        error.errors.username = "User with that username already exists";
    });
    return res.status(500).json(error);
  });
  
  router.get("/all", async (req, res) => {
    let allUsers = await User.findAll();
    return res.json(allUsers);
  });
  
  module.exports = router;
  `,
    utils_auth: `
    const jwt = require("jsonwebtoken");
    const { jwtConfig } = require("../config");
    const { User } = require("../db/models");
    
    const { secret, expiresIn } = jwtConfig;
    
    const setTokenCookie = (res, user) => {
      // Create the token.
      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
      };
      const token = jwt.sign(
        { data: safeUser },
        secret,
        { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
      );
    
      const isProduction = process.env.NODE_ENV === "production";
    
      // Set the token cookie
      res.cookie("token", token, {
        maxAge: expiresIn * 1000, // maxAge in milliseconds
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction && "Lax",
      });
    
      return token;
    };
    
    const restoreUser = (req, res, next) => {
      // token parsed from cookies
      const { token } = req.cookies;
      req.user = null;
    
      return jwt.verify(token, secret, null, async (err, jwtPayload) => {
        if (err) {
          return next();
        }
    
        try {
          const { id } = jwtPayload.data;
          req.user = await User.findByPk(id, {
            attributes: {
              include: ["email", "createdAt", "updatedAt"],
            },
          });
        } catch (e) {
          res.clearCookie("token");
          return next();
        }
    
        if (!req.user) res.clearCookie("token");
    
        return next();
      });
    };
    
    const requireAuth = function (req, _res, next) {
      if (req.user) return next();
    
      const err = new Error("Authentication required");
      err.title = "Authentication required";
      err.errors = { message: "Authentication required" };
      err.status = 401;
      // return _res.status(err.status).json({
      //   message: "Authentication required",
      // });
      return next(err);
    };
    module.exports = {requireAuth,restoreUser,setTokenCookie};
    `,
    "psql-setup-script": `
    const { sequelize } = require("./db/models");
    
    sequelize.showAllSchemas({ logging: false }).then(async (data) => {
      if (!data.includes(process.env.SCHEMA)) {
        await sequelize.createSchema(process.env.SCHEMA);
      }
    });
    `,
    utils_validation:`const { validationResult, check } = require("express-validator");
  const { Model } = require("sequelize");
  
  const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);
  
    if (!validationErrors.isEmpty()) {
      const errors = {};
      validationErrors
        .array()
        .forEach((error) => (errors[error.path] = error.msg));
  
      const err = Error("Bad request");
      err.errors = errors;
      err.status = 400;
      err.title = "Bad request";
      next(err);
    }
    next();
  };
  
  module.exports = { handleValidationErrors };`,
    db_models_index: `
    'use strict';
    
    const fs = require('fs');
    const path = require('path');
    const Sequelize = require('sequelize');
    const process = require('process');
    const basename = path.basename(__filename);
    const env = process.env.NODE_ENV || 'development';
    const config = require(__dirname + '/../../config/database.js')[env];
    const db = {};
    
    let sequelize;
    if (config.use_env_variable) {
      sequelize = new Sequelize(process.env[config.use_env_variable], config);
    } else {
      sequelize = new Sequelize(config.database, config.username, config.password, config);
    }
    
    fs
      .readdirSync(__dirname)
      .filter(file => {
        return (
          file.indexOf('.') !== 0 &&
          file !== basename &&
          file.slice(-3) === '.js' &&
          file.indexOf('.test.js') === -1
        );
      })
      .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
      });
    
    Object.keys(db).forEach(modelName => {
      if (db[modelName].associate) {
        db[modelName].associate(db);
      }
    });
    
    db.sequelize = sequelize;
    db.Sequelize = Sequelize;
    
    module.exports = db;
    `,
    db_models_user: `
    "use strict";
    const { Model } = require("sequelize");
    module.exports = (sequelize, DataTypes) => {
      class User extends Model {
        static associate(models) {
        }
      }
    
      User.init(
        {
          firstName: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          lastName: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
          },
          hashedPassword: { type: DataTypes.STRING, allowNull: false },
          email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
              isEmail: true,
            },
          },
        },
        {
          sequelize,
          modelName: "User",
          timestamps:true,
          defaultScope: {
            attributes: { exclude: ["createdAt", "updatedAt","hashedPassword"] },
          },
        }
      );
      return User;
    };
    `,
    "db_migrations_0-create-user.js": `
    "use strict";
    
    const options = {
      schema: process.env.NODE_ENV === "production" ? process.env.SCHEMA : undefined,
    };
    
    /** @type {import('sequelize-cli').Migration} */
    module.exports = {
      async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
          "Users",
          {
            id: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.INTEGER,
            },
            firstName: {
              type: Sequelize.STRING(50),
              allowNull: false,
            },
            lastName: {
              type: Sequelize.STRING(50),
              allowNull: false,
            },
            username: {
              type: Sequelize.STRING(50),
              allowNull: false,
              unique: true,
            },
            hashedPassword: {
              type: Sequelize.STRING.BINARY,
              allowNull: false,
            },
            email: {
              type: Sequelize.STRING(255),
              allowNull: false,
              unique: true
            },
            createdAt: {
              allowNull: false,
              type: Sequelize.DATE,
              defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updatedAt: {
              allowNull: false,
              type: Sequelize.DATE,
              defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
          },
          options
        );
      },
      async down(queryInterface, Sequelize) {
        options.tableName = "Users";
        await queryInterface.dropTable(options);
      },
    };
    `,
    "db_seeders_0-demo-users.js": `
    "use strict";
  
  const { User } = require("../models");
  const bcrypt = require("bcryptjs");
  
  /** @type {import('sequelize-cli').Migration} */
  module.exports = {
    async up(queryInterface, Sequelize) {
      await User.bulkCreate(
        [
          {
            email: "demo@user.io",
            firstName: "Demo",
            lastName: "User",
            username: "Demo-user",
            hashedPassword: bcrypt.hashSync("password"),
          },
          {
            email: "user1@user.io",
            firstName: "User",
            lastName: "One",
            username: "FakeUser1",
            hashedPassword: bcrypt.hashSync("password2"),
          },
          {
            email: "user4@user.io",
            firstName: "User",
            lastName: "Four",
            username: "FakeUser4",
            hashedPassword: bcrypt.hashSync("password4"),
          },
          {
            email: "user5@user.io",
            firstName: "User",
            lastName: "Five",
            username: "FakeUser5",
            hashedPassword: bcrypt.hashSync("password5"),
          },
          {
            email: "user2@user.io",
            firstName: "User",
            lastName: "Two",
            username: "FakeUser2",
            hashedPassword: bcrypt.hashSync("password3"),
          },
        ],
        { validate: true }
      );
    },
  
    async down(queryInterface, Sequelize) {
      return queryInterface.bulkDelete(
        { schema: process.env.SCHEMA, tableName: "Users" },
        {
          username: {
            [Sequelize.Op.in]: [
              "Demo-user",
              "FakeUser1",
              "FakeUser4",
              "FakeUser5",
              "FakeUser2",
            ],
          },
        },
        {}
      );
    },
  };`,
    bin_www: `#!/usr/bin/env node
  // backend/bin/www
  
  // Import environment variables
  require("dotenv").config();
  
  const { port } = require("../config");
  
  const app = require("../app");
  const db = require("../db/models");
  
  // Check the database connection before starting the app
  db.sequelize
    .authenticate()
    .then(() => {
      // console.log('Database connection success! Sequelize is ready to use...');
  
      // Start listening for connections
      if (process.env.NODE_ENV === "development") {
        console.log("Listening on port "+port+"...");
      }
      app.listen(port);
  
      // app.listen(port);
    })
    .catch((err) => {
      // console.log('Database connection failure.');
      // console.error(err);
    });
  `,
  };
  
  const fs = require("fs");
  
  console.log("Creating Create Files File...");
  try {
    fs.writeFileSync("./createFiles.js", data, "utf8");
  } catch (error) {
    console.log("Failed to Create Create Files File");
    console.log(error);
  }
  
  console.log("Creating .sequelizerc...");
  try {
    fs.writeFileSync("./.sequelizerc", sequelizeConfig, "utf8");
  } catch (error) {
    console.log("Failed to Create .sequelizerc File");
    console.log(error);
  }
  