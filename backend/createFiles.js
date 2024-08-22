
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
  