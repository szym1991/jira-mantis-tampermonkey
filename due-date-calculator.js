class DueDateCalculator {
    constructor(startHourOnWorkingDay, endHourOnWorkingDay) {
        this.startHourOnWorkingDay = startHourOnWorkingDay;
        this.endHourOnWorkingDay = endHourOnWorkingDay;
        this.oneDayTime = this.calculateTimeOnOneDay();
        this.SLA_ERROR_CRITICAL = 10;
        this.SLA_ERROR_MAJOR = 15;
        this.SLA_ERROR_NORMAL = 32;
        this.SLA_ERROR_MINOR = 100;
        this.SLA_CONSULTATION = 50;
        this.MANTIS_CONSULTATION = "KONSULTACJE"
        this.MANTIS_CRITICAL = "BLOKUJĄCY";
        this.MANTIS_MAJOR = "BŁĄD KRYTYCZNY";
        this.MANTIS_NORMAL = "WAŻNY";
        this.MANTIS_MINOR = "DROBNY";
    }

    calculateDueDate(date, category, severity) {
        category = category.toUpperCase();
        severity = severity.toUpperCase();
        var hours = this.SLA_ERROR_NORMAL;
        if (category === this.MANTIS_CONSULTATION) {
            hours = this.SLA_CONSULTATION;
        } else {
            if (severity === this.MANTIS_CRITICAL) {
                hours = this.SLA_ERROR_CRITICAL;
            } else if (severity === this.MANTIS_MAJOR) {
                hours = this.SLA_ERROR_MAJOR;
            } else if (severity === this.MANTIS_NORMAL) {
                hours = this.SLA_ERROR_NORMAL;
            } else if (severity === this.MANTIS_MINOR) {
                hours = this.SLA_ERROR_MINOR;
            }
        }

        return this.getDueDate(date, hours);
    }

    getDueDate(date, numberOfHours) {
        //check if someone adds ticket on holidays
        //if ticket was created on Saturday
        //time is measured from Monday 8:00
        while (!this.isWorkingDay(date)) {
            date = new Date(date.getTime() + 86400000);
            date.setHours(this.startHourOnWorkingDay, 0, 0, 0);
        }

        var timeInMillis = numberOfHours * 60 * 60 * 1000;
        var endOfWorkingDay = new Date(date);
        endOfWorkingDay.setHours(this.endHourOnWorkingDay, 0, 0, 0);
        var zeroDayDifferent = endOfWorkingDay.getTime() - date.getTime();

        //if ticket created after working hours
        if (zeroDayDifferent <= 0) {
            date = new Date(date.getTime() + 86400000);
            date.setHours(this.startHourOnWorkingDay, 0, 0, 0);
            return this.getDueDate(date, numberOfHours);
        }

        var restOfTime = timeInMillis - zeroDayDifferent;
        //end task on the same day
        if (restOfTime <= 0) {
            var finalTime = new Date(date);
            var time = finalTime.getTime() + timeInMillis;
            return new Date(time);
        }

        //pick next day
        var nextDay = new Date(date.getTime() + 86400000);
        //set time to start hour
        nextDay.setHours(this.startHourOnWorkingDay, 0, 0, 0);
        while (restOfTime > 0) {
            //if it's working day - pick time
            if (this.isWorkingDay(nextDay)) {
                if (restOfTime > this.oneDayTime) {
                    restOfTime = restOfTime - this.oneDayTime;
                    nextDay = new Date(nextDay.getTime() + 86400000);
                } else {
                    return new Date(nextDay.getTime() + restOfTime);
                }
            // if it isn't working day - get next
            } else {
                nextDay = new Date(nextDay.getTime() + 86400000);
            }
        }
    }

    calculateTimeOnOneDay() {
        var hours = this.endHourOnWorkingDay - this.startHourOnWorkingDay;
        return hours * 60 * 60 * 1000;
    }

    //https://forum.webhelp.pl/javascript/dni-swiateczne-wolne-od-pracy-t244839.html
    //http://jsfiddle.net/Jaason/rmg11npf/
    easterDate(year) {
        // original by algorithm from polish wikipedia (http://pl.wikipedia.org/wiki/Wielkanoc)
        year = isNaN(year) ? new Date().getFullYear() : +year;
        var a = year % 19,
            b = year / 100 | 0,
            c = year % 100,
            h = (19 * a + b - (b / 4 | 0) - ((b - ((b + 8) / 25 | 0) + 1) / 3 | 0) + 15) % 30,
            l = (32 + 2 * (b % 4) + 2 * (c / 4 | 0) - h - c % 4) % 7,
            m = Math.floor((a + 11 * h + 22 * l) / 451);
        return new Date(year, Math.floor((h + l - 7 * m + 114) / 31) - 1, (h + l - 7 * m + 114) % 31 + 1);
    }

    isWorkingDay(date) {
        // saturday, sunday?
        if ((date.getDay() == 0) || (date.getDay() == 6)) {
            return false;
        }

        var str = date.getDate() + "." + (date.getMonth());
        var holidays = ["1.0", "6.0", "1.4", "3.4", "15.7", "1.10", "11.10", "25.11", "26.11"];

        if (holidays.indexOf(str) >= 0) {
            return false;
        }

        var movableHolidays = this.easterDate(date.getFullYear()); // Easter
        var additionalHolidays = [
            0, // Easter
            1, // Easter Monday
            48, // 49 days after Easter - Green week
            11 // 60 days after Easter - Corpus Christi
        ];
        var i = 0;
        do {
            movableHolidays.setDate(movableHolidays.getDate() + additionalHolidays[i]);

            if (movableHolidays.getDate() + "." + (movableHolidays.getMonth() + 1) === str) {
                return false;
            }

            i++;
        } while (i < additionalHolidays.length);

        return true;
    }
}