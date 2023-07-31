export const downloadFile = (apiFunc, applicationId, fileName) => {
    apiFunc(applicationId)
        .then(blob => URL.createObjectURL(blob))
        .then(url => {
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.click();
        });
};
