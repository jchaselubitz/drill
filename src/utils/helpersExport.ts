export function downloadCSV(lesson: { id: string; title: string }) {
	fetch(`/api/downloads/${lesson.id}`, {
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
			a.download = `lesson-${lesson.title}.csv`;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		})
		.catch((error) => {
			console.error('There was a problem with the fetch operation:', error);
		});
}
