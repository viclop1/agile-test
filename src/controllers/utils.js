export const formatDate = (date, format) => {
    const map = {
        mm: date.getMonth() + 1,
        dd: date.getDate(),
        yy: date.getFullYear().toString().slice(-2),
        yyyy: date.getFullYear(),
        HH: date.getHours(),
        MM: date.getMinutes(),
        SS: date.getSeconds(),
    }

    return format.replace(/mm|dd|yy|yyyy|HH|MM|SS/gi, matched => map[matched])
}