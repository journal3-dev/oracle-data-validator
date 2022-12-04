const { promisify } = require("util");
const exec = promisify(require("child_process").exec);
const {
  readFileSync,
  readdirSync,
  promises: fsPromises,
  readdir,
  stat,
} = require("fs");
const path = require("path");
const ethers = require("ethers");

const generateValidators = async (dir = "./directoryToTest") => {
  let dataPoints = {
    python_language: "No",
    r_language: "No",
    sql_language: "No",
    scala_language: "No",
  };

  var files = readdirSync(dir);
  files.map((filename) => {
    // get current file name
    const name = path.parse(filename).name;
    // get current file extension
    const ext = path.parse(filename).ext;
    const filepath = path.resolve(dir, filename);
    const contents = readFileSync(filepath, "utf-8");
    console.log(".py" == ext, ext);
    switch (ext) {
      case ".py":
        dataPoints["python_language"] = "Yes";
        dataPoints = {
          ...dataPoints,
          ...validatePythonCode(contents, filepath),
        };
        break;
      case ".r":
        dataPoints["r_language"] = "Yes";
        dataPoints = {
          ...dataPoints,
          ...validateRScript(contents),
        };
        break;
      case ".sql":
        dataPoints["sql_language"] = "Yes";
        dataPoints = {
          ...dataPoints,
          ...validateSqlLanguage(contents),
        };
        break;
      case ".sc":
        dataPoints["scala_language"] = "Yes";
        dataPoints = {
          ...dataPoints,
          ...validateScalaLanguage(contents),
        };
    }
    return dataPoints;
    // get current file path
  });
  return dataPoints;
};

const validateScalaLanguage = (fileContent) => {
  const dataPointsToAdd = {};
  if (fileContent.length > 20000) {
    dataPointsToAdd["Scala Code Quality"] = "Amazing";
  }
  if (fileContent.length < 20000) {
    dataPointsToAdd["Scala Code Quality"] = "Average";
  }
  if (fileContent.length < 5000) {
    dataPointsToAdd["Scala Code Quality"] = "Poor";
  }
  return dataPointsToAdd;
};

const validateSqlLanguage = async (fileContent) => {
  let dataPointsToAdd = {};
  if (fileContent.search("JOIN") > 0) {
    dataPointsToAdd["SQL Join Implementation"] = "Yes";
  }
  if (fileContent.toUpperCase() !== fileContent) {
    dataPointsToAdd["SQL Code Quality"] = "Poor";
  } else {
    dataPointsToAdd["SQL Code Quality"] = "Good";
  }
};

const validateRScript = async (fileContent) => {
  const dataPointsToAdd = {};
  // Checking for Data Science Libraries:
  if (fileContent.search("library(dplyr)") > 0) {
    dataPointsToAdd["R Data Science dplyr"] = "Yes";
  }
  //Checking for Data Visualization Libraries:
  if (fileContent.search("library(shiny)") > 0) {
    dataPointsToAdd["R Data Visualization shiny"] = "Yes";
  }
  if (fileContent.search("library(lubridate)") > 0) {
    dataPointsToAdd["R Data Visualization lubridate"] = "Yes";
  }
  //Checking for Data Reporting Libraries:
  if (fileContent.search("library(knitr)") > 0) {
    dataPointsToAdd["R Data Reporting knitr"] = "Yes";
  }
  //Checking for ML
  if (fileContent.search("library(quanteda)") > 0) {
    dataPointsToAdd["R Machine Learning quanteda"] = "Yes";
  }
  //Verifying Code Quality
  if (fileContent.length > 20000) {
    dataPointsToAdd["R Code Quality"] = "Amazing";
  }
  if (fileContent.length < 20000) {
    dataPointsToAdd["R Code Quality"] = "Average";
  }
  if (fileContent.length < 5000) {
    dataPointsToAdd["R Code Quality"] = "Poor";
  }
  return dataPointsToAdd;
};
generateValidators().then((e) => console.log(e));

async function validatePythonCode(contents, filePath) {
  const objectsToAdd = {};
  let nameOutput;
  let score = 0;
  try {
    if (contents.search("tensorflow") > 0) {
      objectsToAdd["Python TensorFlow"] = "Yes";
    }
    if (contents.search("numpy") > 0) {
      objectsToAdd["Python numpy"] = "Yes";
    }
    if (contents.search("Pandas") > 0) {
      objectsToAdd["Python pandas"] = "Yes";
    }
    if (contents.search("keras") > 0) {
      objectsToAdd["Python Keras"] = "Yes";
    }
    if (contents.search("Scikit") > 0) {
      objectsToAdd["Python Scikit"] = "Yes";
    }

    if (contents.search("Conv2D") > 0) {
      objectsToAdd["Python Conv2D"] = "Yes";
    }
    if (contents.search("Sequential") > 0) {
      objectsToAdd["Python Sequential"] = "Yes";
    }

    nameOutput = await exec(
      `/Users/notanshuman/Library/Python/3.8/bin/pylint ${filePath}`
    );
    score = 10;
  } catch (e) {
    score = e.stdout
      .match(/\bYour code has been rated at \b[+-]?([0-9]*[.])?[0-9]+/)[0]
      .split(" ")
      .slice(-1)[0];
  }

  return {
    pylintScore: score,
    ...objectsToAdd,
  };
}
const main = async () => {
  const address = "0x035a935dce16C3085A1Ee04f32Ab64c4F753Bb07";
  const data = await generateValidators();
  const contract = ethers.Contract(CONTRACT, ABI, provider);
  //   Object.keys(data).map(async k=>{
  //     await contract.
  //   })
};
// getScore().then((e) => console.log(e));
