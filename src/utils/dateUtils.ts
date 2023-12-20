import moment from 'moment-timezone';

export function timezone7(): Date {
  const timezone = moment().tz('Asia/Ho_Chi_Minh');

  return new Date(timezone.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'));
}

export function timestamp7(): number {
  const timezone = moment().tz('Asia/Ho_Chi_Minh');

  return timezone.valueOf();
}

/* eslint-disable @typescript-eslint/no-unused-vars */
export function formatDate(date: Date): string {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function convertToStartOfDay(date: string) {
  let dateConvert = '';
  if (date.includes(' ')) {
    const dateItem = date.split(' ');
    dateConvert = dateItem[0];
  } else {
    dateConvert = date;
  }
  const newDate = new Date(dateConvert);
  const offsetInHours = 0;
  const startOfDay = new Date(newDate.setUTCHours(offsetInHours, 0, 0, 0));
  return startOfDay;
}

export function convertToEndOfDay(date: string) {
  let dateConvert = '';
  if (date.includes(' ')) {
    const dateItem = date.split(' ');
    dateConvert = dateItem[0];
  } else {
    dateConvert = date;
  }
  const newDate = new Date(dateConvert);
  const offsetInHours = 23;
  const endOfDay = new Date(newDate.setUTCHours(offsetInHours, 59, 59, 999));
  return endOfDay;
}
