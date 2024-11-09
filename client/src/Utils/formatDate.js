import { formatDistanceToNow, parseISO, format } from 'date-fns';

function formatDateRelative(timeStamp) {
    return formatDistanceToNow(parseISO(timeStamp), { addSuffix: true });
}

function formatDateExact(timeStamp) {
    const date = new Date(timeStamp);
    return format(date, 'dd/mm/yyyy');
}

export { formatDateRelative, formatDateExact };
