const AUTO_REGEX = /_auto_(?<year>\d{4})(?<month>\d{2})(?<day>\d{2})_(?<hour>\d{2})(?<minutes>\d{2}).py$/i;

function checkDate(migrationName, startDate) {
    const migrationMatch = migrationName.match(AUTO_REGEX);
    if (migrationMatch) {
        const {
            year,
            month,
            day,
            hour,
            minutes
        } = migrationMatch.groups;
        const migrationDate = new Date(+year, parseInt(month) -1, parseInt(day), parseInt(hour), parseInt(minutes));
        if (migrationDate > startDate) {
            return migrationName;
        }
    }
    return null;
}

module.exports = checkDate;
