const b64toBlob = (b64Data, sliceSize = 512) => {
  const data = b64Data.replace('data:application/pdf;base64,', '');
  const byteCharacters = atob(data.replace(/\r?\n/g, ''));
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  // const blob = new Blob(byteArrays, {type: contentType});
  return new Blob(byteArrays);
};

export default {
  b64toBlob,
};
