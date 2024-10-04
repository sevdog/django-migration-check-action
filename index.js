const core = require("@actions/core");
const glob = require("@actions/glob");
const checkDate = require("./checks");

const AUTO_PATTERN = "????_auto_????????_????.py";

async function run() {
  try {
    const repositoryType = core.getInput("type");
    let startDate = core.getInput("start-date");
    const baseDirectory = core.getInput("base-directory");
    let pattern;
    if (repositoryType === "project")
      pattern = `${baseDirectory}/*/migrations/${AUTO_PATTERN}`;
    else if (repositoryType === "app")
      pattern = `${baseDirectory}/migrations/${AUTO_PATTERN}`;
    else
      throw Error(
        'Invalid type provided, correct choices are "app" or "project".',
      );

    let checkForDate = false;
    if (startDate) {
      startDate = new Date(startDate);
      if (isNaN(startDate))
        console.log("Invalid date provided, date checks skipped");
      else checkForDate = true;
    }

    const globber = await glob.create(pattern, { followSymbolicLinks: false });
    const migrations = await globber.glob();
    if (!checkForDate && migrations.length > 0) {
      throw Error(
        `Automatic migration names detected!\n${migrations.join("\n")}`,
      );
    } else {
      const invalidDates = migrations.filter((m) => checkDate(m, startDate));
      if (invalidDates.length > 0) {
        throw Error(
          `Automatic migration names detected!\n${invalidDates.join("\n")}`,
        );
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
