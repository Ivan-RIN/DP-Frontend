import apiFile from '../api/Files/files';
import b64Blob from '../plugins/lib-b64-blob';

export default {
	async downloadFile(id) {
		const file = await apiFile.getById(id);
		this.convertAndLoadFile(file);
	},
	b64b(file) {
		if (!file) return '##';
		try {
			const b = b64Blob.b64toBlob(file.replace(/\r?\n/g, ''));
			return URL.createObjectURL(b);
		} catch (e) {
			console.error(e);
			return '##';
		}
	},
	async convertAndLoadFile(file) {
		let anchor;
		if (navigator.msSaveBlob) {
			console.log('~~z~~ navigator.msSaveBlob');
			const b = b64Blob.b64toBlob(file.content.replace(/\r?\n/g, ''));
			navigator.msSaveBlob(b, file.name);
		} else {
			const fileData = this.b64b(file.content);
			anchor = document.createElement('a');
			anchor.href = fileData;
			anchor.download = file.name;
			anchor.onclick = (e) => {
				document.body.removeChild(e.target);
			};
			document.body.appendChild(anchor);
			anchor.click();
			URL.revokeObjectURL(fileData);
		}
	},
};
