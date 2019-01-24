export class StringHelper {
    public static formatName(name: string) : string {
        return name.toLocaleLowerCase().replace(/^[\u00C0-\u1FFF\u2C00-\uD7FF\w]|\s[\u00C0-\u1FFF\u2C00-\uD7FF\w]/g, function (letter) {
            return letter.toLocaleUpperCase();
        });
    }

    public static formatEmail(email: string): string {
        return email.toLowerCase();
    }

    public static formatDateToISODate(date: Date): string {
        return date.getFullYear() +
            '-' + ((date.getMonth() + 1) < 10?"0":"")+(date.getMonth() + 1) +
            '-' + (date.getDate()< 10?"0":"") + date.getDate();
    }

    public static formatTimeToISOTime(date: Date): string {
        return (date.getHours() < 10?"0":"") + date.getHours() +
            ':' + (date.getMinutes() < 10?"0":"") + date.getMinutes() +
            ':' + (date.getSeconds() < 10?"0":"") + date.getSeconds();
    }

    public static formatDateTimeToISODateTime(date: Date): string {
        return StringHelper.formatDateToISODate(date)+"T"+StringHelper.formatTimeToISOTime(date);
    }
}