import { formatDistanceToNow, parseISO } from "date-fns";

export default function formatDate(timeStamp) {
    return formatDistanceToNow(parseISO(timeStamp), { addSuffix: true });
}
