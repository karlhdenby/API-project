const json = `{
    "name": "template",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "test": "echo \\"Error: no test specified\\" && exit 1",
      "install": "npm --prefix backend install backend",
      "dev:backend": "npm install --prefix backend start",
      "sequelize": "npm run --prefix backend sequelize",
      "sequelize-cli": "npm run --prefix backend sequelize-cli",
      "start": "npm start --prefix backend",
      "build": "npm run --prefix backend build",
      "start:frontend": "npm run --prefix frontend dev",
      "build:frontend": "npm run --prefix frontend build",
      "delete:all": "rm -rf backend frontend package.json",
      "setup":"npm run --prefix backend setup && npm run --prefix frontend setup && rm -rf backend/setup.js backend/createFiles.js frontend/setup.js frontend/createFiles.js setup.js"
    },
    "author": "",
    "license": "ISC"
  }
  `;

const backendJson = `{
    "name": "backend",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "test": "echo \\"Error: no test specified\\" && exit 1",
      "sequelize": "sequelize",
      "sequelize-cli": "sequelize-cli",
      "start": "per-env",
      "start:development": "nodemon ./bin/www",
      "start:production": "node ./bin/www",
      "build": "node psql-setup-script.js",
      "db:setup": "npx dotenv sequelize db:migrate && npx dotenv sequelize db:seed:all",
      "db:migrate": "npx dotenv sequelize db:migrate",
      "db:seed": "npx dotenv sequelize db:seed:all",
      "setup": "npm i && npm run file-structure && rm -rf createFiles.js && npm run db:setup",
      "file-structure": "node setup.js && npx sequelize init && mkdir utils routes routes/API bin && node createFiles",
      "delete-all":"rm -rf createFiles.js package-lock.json .env .sequelizerc utils routes node_modules db config psql-setup-script.js app.js bin setup.js",
      "restart-app-development":"npm run delete-all && npm run startup"
    },
    "author": "",
    "license": "ISC",
    "dependencies": {
      "bcryptjs": "^2.4.3",
      "cookie-parser": "^1.4.6",
      "cors": "^2.8.5",
      "csurf": "^1.11.0",
      "dotenv": "^16.4.5",
      "express": "^4.19.2",
      "express-async-errors": "^3.1.1",
      "express-validator": "^7.1.0",
      "helmet": "^7.1.0",
      "jsonwebtoken": "^9.0.2",
      "moment": "^2.30.1",
      "morgan": "^1.10.0",
      "per-env": "^1.0.2",
      "pg": "^8.12.0",
      "sequelize": "^6.37.3",
      "sequelize-cli": "^6.6.2"
    },
    "devDependencies": {
      "dotenv-cli": "^7.4.2",
      "nodemon": "^3.1.4",
      "sqlite3": "^5.1.7"
    }
  }
  `;

const frontendJson = `{
  "name": "frontend",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build --watch",
    "lint": "eslint src --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "setup": "npm i && node setup.js && node createFiles.js && rm -rf setup.js createFiles.js"
  },
  "dependencies": {
    "js-cookie": "^3.0.5",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-icons": "^5.2.1",
    "react-redux": "^9.1.2",
    "react-router-dom": "^6.25.1",
    "redux": "^5.0.1",
    "redux-thunk": "^3.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "eslint": "^8.45.0",
    "eslint-plugin-react": "^7.32.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "redux-logger": "^3.0.6",
    "vite": "^4.4.5",
    "vite-plugin-eslint": "^1.8.1"
  }
}
`;

const backendSetupData = `const data = \`
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
  \`;
  
  const sequelizeConfig = \`
  const path = require("path");
  
  module.exports = {
    config: path.resolve("config", "database.js"),
    "migrations-path": path.resolve("db", "migrations"),
    "models-path": path.resolve("db", "models"),
    "seeders-path": path.resolve("db", "seeders"),
  };
  \`;
  
  module.exports = {
    ".env": \`
    NODE_ENV = development
    DB_FILE=db/dev.db
    JWT_SECRET= insertSecretHere
    JWT_EXPIRES_IN=604800
    SERVER_URL=http://localhost:
        \`,
    config_database: \`
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
    \`,
    config_index: \`
    module.exports = {
        environment: process.env.NODE_ENV || 'development',
        port: process.env.PORT || 8000,
        dbFile: process.env.DB_FILE,
        jwtConfig: {
          secret: process.env.JWT_SECRET,
          expiresIn: process.env.JWT_EXPIRES_IN
        }
      };
    \`,
    app: \`
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
    \`,
    routes_index: \`
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
      router.get(/^(?!\\\\/?api).*/, (req, res) => {
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
    \`,
    routes_API_index: \`
    const router = require("express").Router();
    
    const { restoreUser } = require("../../utils/auth.js");
    
    router.use(restoreUser);
    
    const addRoute = (name) => router.use("/" + name, require("./" + name));
  
    addRoute("session");
    addRoute("users");
    
    module.exports = router;
    \`,
    routes_API_session:\`
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
  
  module.exports = router;\`,
  routes_API_users:\`
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
  \`,
    utils_auth: \`
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
    \`,
    "psql-setup-script": \`
    const { sequelize } = require("./db/models");
    
    sequelize.showAllSchemas({ logging: false }).then(async (data) => {
      if (!data.includes(process.env.SCHEMA)) {
        await sequelize.createSchema(process.env.SCHEMA);
      }
    });
    \`,
    utils_validation:\`const { validationResult, check } = require("express-validator");
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
  
  module.exports = { handleValidationErrors };\`,
    db_models_index: \`
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
    \`,
    db_models_user: \`
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
    \`,
    "db_migrations_0-create-user.js": \`
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
    \`,
    "db_seeders_0-demo-users.js": \`
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
  };\`,
    bin_www: \`#!/usr/bin/env node
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
  \`,
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
  `;

const frontendSetupData = `export default {
  src_main: \`import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { Modal, ModalProvider } from "./context/Modal.jsx";
import configureStore from "./store";
import { restoreCSRF, csrfFetch } from "./store/csrf";
import * as sessionActions from "./store/session";

const store = configureStore();

if (import.meta.env.MODE !== "production") {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
}

if (process.env.NODE_ENV !== "production") {
  window.store = store;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ModalProvider>
      <Provider store={store}>
        <App />
        <Modal/>
      </Provider>
    </ModalProvider>
  </React.StrictMode>
);\`,
  src_App: \`import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import Navigation from "./components/Navigation";

import * as sessionActions from "./store/session";

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        index: true,
        element: <h1>Welcome!</h1>,
      },
      {
        path: "*",
        element: (
          <div>
            <h1 className="title">404 page not found</h1>
          </div>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
\`,
  "src_store_csrf.js": \`import Cookies from "js-cookie";

export async function csrfFetch(url, options = {}) {
  // set options.method to 'GET' if there is no method
  options.method = options.method || "GET";
  // set options.headers to an empty object if there is no headers
  options.headers = options.headers || {};

  // if the options.method is not 'GET', then set the "Content-Type" header to
  // "application/json", and set the "XSRF-TOKEN" header to the value of the
  // "XSRF-TOKEN" cookie
  if (options.method.toUpperCase() !== "GET") {
    options.headers["Content-Type"] =
      options.headers["Content-Type"] || "application/json";
    options.headers["XSRF-Token"] = Cookies.get("XSRF-TOKEN");
  }
  // call the default window's fetch with the url and the options passed in
  const res = await window.fetch(url, options);

  // if the response status code is 400 or above, then throw an error with the
  // error being the response
  if (res.status >= 400) throw res;

  // if the response status code is under 400, then return the response to the
  // next promise chain
  return res;
}

export function restoreCSRF() {
  return csrfFetch("/api/csrf/restore");
}

export async function post(url, reqBody = {}) {
  const adjustedUrl = url.includes("api") ? url : "/api" + url;
  const data = await csrfFetch(adjustedUrl, { method: "POST", body: reqBody });
  const json = await data.json()
  return [json,data];
}
export async function get(url) {
  const adjustedUrl = url.includes("api") ? url : "/api" + url;
  const data = await csrfFetch(adjustedUrl);
  const json = await data.json()
  return [json,data];
}
export async function put(url, reqBody = {}) {
  const adjustedUrl = url.includes("api") ? url : "/api" + url;
  const data = await csrfFetch(adjustedUrl, { method: "PUT", body: reqBody });
  const json = await data.json()
  return [json,data];
}
export async function del(url) {
  const adjustedUrl = url.includes("api") ? url : "/api" + url;
  const data = await csrfFetch(adjustedUrl, { method: "DELETE" });
  const json = await data.json()
  return [json,data];
}
\`,
  "src_store_index.js": \`import configureStore from "./store.js"
export default configureStore
\`,
  "src_store_session.js": \`import { csrfFetch, del, get, post } from "./csrf";

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
  };
};

const removeUser = () => {
  return {
    type: REMOVE_USER,
  };
};

export const restoreUser = () => async (dispatch) => {
  const [data,response] = await get("/session");
  dispatch(setUser(data.user));
  return response;
};

export const signup = (user) => async (dispatch) => {
  const [data,response] = await post("/users",JSON.stringify(user));
  dispatch(setUser(data.user));
  return response;
};

export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

export const logout = () => async (dispatch) => {
  const response = await del("/session");
  dispatch(removeUser());
  return response;
};

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    default:
      return state;
  }
};

export default sessionReducer;
\`,
  "src_store_store.js": \`import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { thunk } from "redux-thunk";

import sessionReducer from "./session";

const rootReducer = combineReducers({
  session: sessionReducer,
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;\`,
  src_context_Modal: \`import { useRef, useState, createContext, useContext } from "react";
import ReactDOM from 'react-dom'
import './Modal.css'

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const modalRef = useRef();
  const [modalContent, setModalContent] = useState(null);
  const [onModalClose, setOnModalClose] = useState(null);

  const closeModal = () => {
    setModalContent(null);
    if (typeof onModalClose === "function") {
      setOnModalClose(null);
      onModalClose();
    }
  };

  const contextValue = {
    modalRef,
    modalContent,
    setModalContent,
    setOnModalClose,
    closeModal,
  };

  return (
    <>
      <ModalContext.Provider value={contextValue}>
        {children}
      </ModalContext.Provider>
      <div ref={modalRef} />
    </>
  );
}

export function Modal() {
  const { modalRef, modalContent, closeModal } = useContext(ModalContext);
  // If there is no div referenced by the modalRef or modalContent is not a
  // truthy value, render nothing:
  if (!modalRef || !modalRef.current || !modalContent) return null;

  // Render the following component to the div referenced by the modalRef
  return ReactDOM.createPortal(
    <div id="modal">
      <div id="modal-background" onClick={closeModal} />
      <div id="modal-content">{modalContent}</div>
    </div>,
    modalRef.current
  );
}

export const useModal = () => useContext(ModalContext);
\`,
  src_components_LoginFormModal_LoginFormModal: \`import { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginFormModal.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <>
      <div className="login">
        <h1>Log In</h1>
        <form onSubmit={handleSubmit}>
          <label className="credential">
            Username or Email
            <input
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
            />
          </label>
          <label className="password">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {errors.credential && <p>{errors.credential}</p>}
          <button type="submit">Log In</button>
        </form>
      </div>
    </>
  );
}

export default LoginFormModal;
\`,
  src_components_LoginFormModal_index: \`import LoginFormModal from "./LoginFormModal";

export default LoginFormModal\`,
  "src_components_LoginFormModal_LoginFormModal.css": true,
  src_components_Navigation_index: \`import Navigation from "./Navigation";
export default Navigation;
\`,
  "src_components_Navigation_Navigation.css": true,
  src_components_Navigation_Navigation: \`import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton.jsx";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from '../SignupFormModal/index.jsx';
import { FaHome } from "react-icons/fa";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  const sessionLinks = sessionUser ? (
    <>
      <li className="profileButton">
        <ProfileButton user={sessionUser} />
      </li>
    </>
  ) : (
    <>
      <li className="navButton">
        <OpenModalButton
          buttonText="Log In"
          modalComponent={<LoginFormModal />}
        />
      </li>
      <li className="navButton">
        <OpenModalButton
          buttonText="Sign Up"
          modalComponent={<SignupFormModal />}
        />
      </li>
    </>
  );

  return (
    <ul className="nav">
      <li className="navButton">
        <NavLink to="/"><FaHome/></NavLink>
      </li>
      {isLoaded && sessionLinks}
    </ul>
  );
}

export default Navigation;
\`,
  src_components_SignupFormModal_index: \`import SignupFormModal from "./SignupFormModal";
export default SignupFormModal;\`,
  "src_components_SignupFormModal_SignupFormModal.css": true,
  src_components_SignupFormModal_SignupFormModal: \`import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupFormModal.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <div className="signup">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p>{errors.email}</p>}
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.username && <p>{errors.username}</p>}
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        {errors.firstName && <p>{errors.firstName}</p>}
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        {errors.lastName && <p>{errors.lastName}</p>}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p>{errors.password}</p>}
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && (
          <p>{errors.confirmPassword}</p>
        )}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
\`,
  ".gitignore": \`# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
# dist
# dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
\`,
"src_components_Navigation_ProfileButton":\`import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import * as sessionActions from "../../store/session";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [dropDownActive, setDropdown] = useState(false);
  const ulRef = useRef();

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    return setDropdown((prevState) => !prevState);
  };

  useEffect(() => {
    if (!dropDownActive) return;

    const closeMenu = (e) => {
      const isInComponent = ulRef && !ulRef.current?.contains(e.target);
      if (isInComponent) {
        setDropdown(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [dropDownActive]);

  return (
    <>
      <button onClick={toggleDropdown}>
        <FaUserCircle />
      </button>
      <ul
        className={\\\`profile-dropdown \\\${dropDownActive ? "active" : ""}\\\`}
        ref={ulRef}
      >
        <li>{user.username}</li>
        <li>
          {user.firstName} {user.lastName}
        </li>
        <li>{user.email}</li>
        <li>
          <button className="navButton" onClick={logout}>
            Log Out
          </button>
        </li>
      </ul>
    </>
  );
}

export default ProfileButton;
\`,"src_components_OpenModalButton_index":\`import OpenModalButton from "./OpenModalButton";
export default OpenModalButton;\`,
"src_components_OpenModalButton_OpenModalButton":\`import { useModal } from '../../context/Modal';

function OpenModalButton({
  modalComponent, // component to render inside the modal
  buttonText, // text of the button that opens the modal
  onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
  onModalClose // optional: callback function that will be called once the modal is closed
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onButtonClick === "function") onButtonClick();
  };

  return <button onClick={onClick}>{buttonText}</button>;
}

export default OpenModalButton;\`,
"src_context_Modal.css":
    \`#modal {
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    #modal-background {
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.7);
    }
    
    #modal-content {
      position: absolute;
      background-color: white;
    }\`,
"vite.config.js":\`import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    eslint({
      lintOnStart: true,
      failOnError: mode === "production"
    })
  ],
  // To automatically open the app in the browser whenever the server starts,
  // uncomment the following lines:
  server: {
    proxy: {
      '/api': 'http://localhost:8000'
    },
  }
}));\`
};

const data = \`
  import fs from "fs"
  import path from "path"
  import fileData from "./setup.js"
  
  const makeFile = (filePath, tryMessage, catchMessage) => {
    const resolvedPath = filePath.split("_");
    const lastIndex = resolvedPath.length - 1;
    if (!resolvedPath[lastIndex].includes(".")) {
      resolvedPath[lastIndex] = resolvedPath[lastIndex] + ".jsx";
    }
    const fileName = resolvedPath[lastIndex];
    try {
      const data = fileData[filePath];
      if (!data) {
        throw new Error("the filepath does not exist in fileData.js");
      }
      console.log(tryMessage || "writing " + fileName + "...");
      if (fileName.includes(".css") && typeof data === "boolean") {
        fs.writeFileSync(path.resolve(...resolvedPath), "/*Insert CSS here*/", "utf8");
      } else {
        fs.writeFileSync(path.resolve(...resolvedPath), data , "utf8");
      }
    } catch (error) {
      console.log(catchMessage || "Error occurred while writing " + fileName);
      console.log(error);
    }
  };
  
  Object.keys(fileData).forEach((file) => makeFile(file));

  \`;

import fs from "fs"

const createDirectory = (name) => {
  fs.mkdir("./" + name, { recursive: true }, (err) => {
    return console.log("Created: " + name);
  });
};

createDirectory("src/store");
createDirectory("src/components");
createDirectory("src/components/LoginFormModal");
createDirectory("src/components/Navigation");
createDirectory("src/components/SignupFormModal");
createDirectory("src/components/OpenModalButton");
createDirectory("src/context");
createDirectory("dist");
createDirectory("dist/assets");

console.log("Creating Create Files File...");
try {
  fs.writeFileSync("./createFiles.js", data, "utf8");
} catch (error) {
  console.log("Failed to Create Create Files File");
  console.log(error);
}
`;

const fs = require("fs");
const path = require("path");

const createFile = (path, data) => {
  fs.writeFileSync(path, data, "utf-8");
};

console.log("Ready for magic?");

fs.mkdir("./backend", { recursive: true }, (err) => {
  console.log("Generated Backend Folder");
});

require("child_process").exec(
  "npx tiged appacademy/aa-react18-vite-template#main frontend",
  (error, stdout, stderr) => {
    console.log("Generated Frontend Folder");
  }
);

setTimeout(() => {
  createFile("./package.json", json);

  createFile(path.resolve("backend", "package.json"), backendJson);

  createFile(path.resolve("backend", "setup.js"), backendSetupData);

  createFile(path.resolve("frontend", "package.json"), frontendJson);

  createFile(path.resolve("frontend", "setup.js"), frontendSetupData);

  require("child_process").exec("npm run setup", (error, stdout, stderr) => {
    console.log("Generated Web Application...");
    console.log(
      "Run |npm start| to start backend and in another terminal run |npm run start:frontend| to see your application in the browser"
    );
  });
}, 10000);
