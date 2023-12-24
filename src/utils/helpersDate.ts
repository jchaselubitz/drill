export function rfc3339(d: Date) {
	function pad(n: number) {
		return n < 10 ? '0' + n : n;
	}

	return (
		d.getFullYear() +
		'-' +
		pad(d.getMonth() + 1) +
		'-' +
		pad(d.getDate()) +
		'T' +
		pad(d.getHours()) +
		':' +
		pad(d.getMinutes()) +
		':' +
		pad(d.getSeconds())
	);
}

export const toDbDate = (date: Date) => rfc3339(date);
export const toJsDateType = (date: string): Date => new Date(date);

export function getDateDay(date: Date): Date {
	const daydate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
	return daydate;
}

export function isSameDate(date1: Date, date2: Date): boolean {
	return date1.getTime() === date2.getTime();
}
