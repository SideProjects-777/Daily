import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";


class NewEventService {


    static parseDateLatest = (date: CalendarDate, start:string): CalendarDate => {
        let startArr = start.split(':');
        const hour = parseInt(startArr[0]);
        const minute = parseInt(startArr[1]);
        if (date) {
            date.setHours(hour, minute);
        }
        return new Date(date);
    };
}

export default NewEventService;