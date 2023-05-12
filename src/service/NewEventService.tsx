import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";


class NewEventService {


    static parseDateLatest = (date: CalendarDate, start:string): CalendarDate => {
        if(start===''){return new Date();}
        let startArr = start.split(':');
        const hour = parseInt(startArr[0]);
        const minute = parseInt(startArr[1]);
        if (date) {
            date.setHours(hour, minute);
        }
        return new Date(date);
    };


    static generateRandomKey():string{
        const timestamp = new Date().getTime();
        const counter = timestamp % 9000 + 1000;
        const randomString = counter.toString(36).substring(2, 14);
        return randomString;
    }
}

export default NewEventService;