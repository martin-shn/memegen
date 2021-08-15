'use strict';

function downloadMeme() {
    const data = gElCanvas.toDataURL('image/jpeg');

    const element = document.createElement('a');
    element.setAttribute('href', data);
    element.setAttribute('download', 'my-img.jpg');
    element.click();
    element.remove();
    renderCanvas();
}

//share to facebook
function shareImg() {
    try {
        var img = gElCanvas.toDataURL('image/jpeg', 0.9).split(',')[1];
    } catch (e) {
        var img = gElCanvas.toDataURL().split(',')[1];
    }

    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl);
        if (isMobile()) window.location.assign(`https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}`, '_blank');
        else window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}`, '_blank');
    }
    imgurUpload(img, onSuccess);
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

function imgurUpload(imgDataUrl, onSuccess) {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Client-ID f64b0059ce0e166');

    const formdata = new FormData();
    formdata.append('image', imgDataUrl);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
    };

    fetch('https://api.imgur.com/3/image', requestOptions)
        .then((response) => response.text())
        .then(function (result) {
            onSuccess(JSON.parse(result).data.link);
        })
        .catch((error) => console.log('error', error));
}

function saveMeme(currMeme){
    currMeme.selectedLineIdx = currTextLine;
    currMeme.thumbnail = gElCanvas.toDataURL('image/jpeg', 0.1);
    let userMemes = loadFromStorage('userMemes');
    if (userMemes) {
        // add to storage
        userMemes.push(currMeme);
    } else {
        // create first storage
        userMemes = [currMeme];
    }
    saveToStorage('userMemes', userMemes);
}