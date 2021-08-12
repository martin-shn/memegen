'use strict';

// let gMemesLocalStorage={id:1,gMeme.json}

function downloadMeme() {
    const data = gElCanvas.toDataURL('image/jpeg'); //.replace('image/png', 'image/octet-stream');

    var element = document.createElement('a');
    element.setAttribute('href', data);
    element.setAttribute('download', 'my-img.jpg');
    element.click();
    element.remove();
    renderCanvas();
}

//share to facebook
function shareImg() {
    const imgDataUrl = gElCanvas.toDataURL('image/jpeg');

    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl);
        // document.querySelector('.user-msg').innerText = `Your photo is available here: ${uploadedImgUrl}`;
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}`, '_blank');
    }
    doUploadImg(imgDataUrl, onSuccess);
    renderCanvas();
}

function doUploadImg(imgDataUrl, onSuccess) {
    const formData = new FormData();
    formData.append('img', imgDataUrl);

    fetch('//ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData,
    })
        .then((res) => res.text())
        .then((url) => {
            // console.log('Got back live url:', url);
            onSuccess(url);
        })
        .catch((err) => {
            console.error(err);
        });
}
