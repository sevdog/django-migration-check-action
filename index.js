const core = require('@actions/core');
const glob = require('@actions/glob');

const autoRegex = /_auto_(?<year>\d{4})(?<month>\d{2})(?<day>\d{2})_(?<hour>\d{2})(?<minutes>\d{2}).py$/i;

async function run() {
    try {
        const repositoryType = core.getInput('type');
        let startDate = core.getInput('start-date');
        const baseDirectory = core.getInput('base-directory');
        const autoPattern = '????_auto_????????_????.py'
        let pattern;
        if (repositoryType === 'project')
            pattern = baseDirectory + '/*/migrations/' + autoPattern;
        else if (repositoryType === 'app')
            pattern = baseDirectory + '/migrations/' + autoPattern;
        else
            throw Error('Invalid type provided, correct choices are "app" or "project".');

        let checkForDate = false;
        if (startDate) {
            startDate = new Date(startDate);
            if (isNaN(startDate))
                console.log('Invalid date provided, date checks skipped');
            else
                checkForDate = true;
        }

        const globber = await glob.create(pattern, {followSymbolicLinks: false});
        const migrations = await globber.glob();
        if (!checkForDate && migrations.length > 0) {
            throw Error('Automatic migration names detected!\n' + migrations.join('\n'));
        } else {
            const invalidDates = []
            for (const migrationName of migrations) {
                const migrationMatch = migrationName.match(autoRegex);
                if (migrationMatch) {
                    const migrationDate = new Date(
                        migrationMatch.groups.year +
                        '-' +
                        migrationMatch.groups.month +
                        '-' +
                        migrationMatch.groups.day +
                        'T' +
                        migrationMatch.groups.hour +
                        ':' +
                        migrationMatch.groups.minutes
                    );
                    if (migrationDate > startDate) {
                        invalidDates.push(migrationName);
                    }
                }
            }
            if (invalidDates.length > 0) {
                throw Error('Automatic migration names detected!\n' + invalidDates.join('\n'));
            }
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
