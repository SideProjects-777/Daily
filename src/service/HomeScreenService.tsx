// import { Item } from
// "react-native-paper/lib/typescript/src/components/Drawer/Drawer";

import {Item} from "../HomeScreen";

class HomeScreenService {

    static sort(itemArray : Item[]): Item[] {
        const length = itemArray.length;
        for (let i = 0; i < length - 1; i++) {
            let minIndex = i;

            for (let j = i + 1; j < length; j++) {
                const a = itemArray[j];
                const b = itemArray[minIndex];

                if (a.timeless && !b.timeless) {
                    minIndex = j;
                } else if (!a.timeless && b.timeless) {
                    // do nothing, minIndex is already correct
                } else {
                    const dateA = new Date(a.date).getTime();
                    const dateB = new Date(b.date).getTime();

                    if (dateA < dateB) {
                        minIndex = j;
                    }
                }
            }

            if (minIndex !== i) {
                const temp = itemArray[i];
                itemArray[i] = itemArray[minIndex];
                itemArray[minIndex] = temp;
            }
        }
        return itemArray;
    }

    static removeFromList(items : Item[], key : string) {
        if (items.length == 1) {
            const isToday = new Date(items.at(0)?.date).toDateString() === new Date().toDateString();
            return isToday
                ? []
                : undefined;
        } else {
            return items.filter((obj) => obj.key !== key);
        }
    }

    static checkIfKeyIsGiven(items : Record < string, Item[] >, key : string) {
        const keyExists = Object
            .values(items)
            .some((items) => items.some((item) => item.key === key));
        if (keyExists) {
            return true;
        } else {
            return false;
        }

    }

    static update(items : Item[], item : Item) {
        const updatedItems = items.map((obj) => obj.key === item.key
            ? item
            : obj);
        return updatedItems;
    }

    static parseDateIntoStringAndVice = (data : Date) => {
        const date = new Date(data);
        const formattedDate = `${date.getFullYear()}-${ (date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${date
            .getDate()
            .toString()
            .padStart(2, '0')}`;
        return formattedDate
    }

    static loopInGivenMonth(items : {
        [key : string]: any[]
    }, currentDate : Date) {
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        // Get the first day of the month
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);

        // Get the last day of the month
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

        for (let day = firstDayOfMonth.getDate(); day <= lastDayOfMonth.getDate(); day++) {
            var date = new Date(currentYear, currentMonth, day);
            var parsedDate = HomeScreenService.parseDateIntoStringAndVice(date);
            if (!items[parsedDate]) {
                items[parsedDate] = [];
            }
        }

        return items;
    }

}

export default HomeScreenService;