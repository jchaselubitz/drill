export async function downloadCSV(
	lesson: { id: number; title: string },
	setLoadingFalse: () => void
) {
	await fetch(`/api/downloads/csv/${lesson.id}`, {
		method: 'POST'
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.blob();
		})
		.then((blob) => {
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.style.display = 'none';
			a.href = url;
			a.download = `${lesson.title}.csv`;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		})
		.catch((error) => {
			console.error('There was a problem with the fetch operation:', error);
		});
	setLoadingFalse();
}

export async function downloadApkg(
	lesson: { id: number; title: string },
	setLoadingFalse: () => void
) {
	await fetch(`/api/downloads/apkg/${lesson.id}`, {
		method: 'POST'
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.blob();
		})
		.then((blob) => {
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.style.display = 'none';
			a.href = url;
			a.download = `${lesson.title}.apkg`;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		})
		.catch((error) => {
			console.error('There was a problem with the fetch operation:', error);
		});
	setLoadingFalse();
}
