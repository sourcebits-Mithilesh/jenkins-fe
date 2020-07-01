export const addeZero = (date) => {
   const format=(parseInt(date)<10)?`0${date}`:date;
   return format;
}