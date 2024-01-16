export const cleanFileName = (fileName: string): string => {
	const cleaned = fileName
		.replace(/ß/g, 'ss')
		.toLocaleLowerCase()
		.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
		.split(' ')
		.join('_');

	return cleaned.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};
