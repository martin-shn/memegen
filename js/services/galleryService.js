'use strict';

const memeImgs = [
    { id: 1, tags: ['USA', 'trump', 'finger'] },
    { id: 2, tags: ['cartoon', 'kids', 'dance'] },
    { id: 3, tags: ['baby', 'sleep', 'dog'] },
    { id: 4, tags: ['cat', 'sleep'] },
    { id: 5, tags: ['baby', 'angry', 'mad'] },
    { id: 6, tags: ['hair', 'funny'] },
    { id: 7, tags: ['black', 'baby', 'eyes'] },
    { id: 8, tags: ['think', 'smile'] },
    { id: 9, tags: ['baby', 'kids', 'smile', 'funny'] },
    { id: 10, tags: ['USA', 'obama', 'black', 'smile'] },
    { id: 11, tags: ['black', 'sport', 'gay'] },
    { id: 12, tags: ['TV', 'israel', 'finger', 'acuse'] },
    { id: 13, tags: ['cheers', 'drink', 'smile'] },
    { id: 14, tags: ['cat', 'sleep'] },
    { id: 15, tags: ['dog', 'cute'] },
    { id: 16, tags: ['USA', 'trump', 'finger'] },
    { id: 17, tags: ['black', 'TV', 'serious'] },
    { id: 18, tags: ['explain', 'hair', 'sunlight'] },
    { id: 19, tags: ['TV', 'funny'] },
    { id: 20, tags: ['russia', 'putin'] },
    { id: 21, tags: ['TV', 'kids', 'cartoon', 'explain'] },
    { id: 22, tags: ['what'] },
    { id: 23, tags: ['hair', 'funny'] },
    { id: 24, tags: ['TV', 'peace'] },
    { id: 25, tags: ['black', 'dance', 'cute', 'baby'] },
    { id: 26, tags: ['USA', 'trump', 'finger'] },
    { id: 27, tags: ['black', 'baby', 'eyes'] },
    { id: 28, tags: ['yoga', 'dog', 'cute', 'strech'] },
    { id: 29, tags: ['USA', 'obama', 'black', 'smile'] },
    { id: 30, tags: ['black', 'sport', 'gay'] },
    { id: 31, tags: ['cheers', 'drink', 'smile'] },
    { id: 32, tags: ['black', 'TV', 'serious'] },
    { id: 33, tags: ['explain', 'hair', 'sunlight'] },
    { id: 34, tags: ['opera', 'black'] },
    { id: 35, tags: ['TV', 'funny'] },
    { id: 36, tags: ['russia', 'putin'] },
    { id: 37, tags: ['TV', 'kids', 'cartoon', 'explain'] },
];

function createGallery(imgs=memeImgs) {
    imgs.forEach(function (meme) {
        meme.url = 'img/gallery/'+meme.id + '.jpg';
    });
    const elGallery = document.querySelector('.gallery');
    //<img class="img id-1" src="img/gallery/1.jpg" onclick="onImageGallery(this)" />
    const strHTML =imgs
        .map(function (memeImg) {
            return `<img class="img id-${memeImg.id}" src="${memeImg.url}" onclick="onImageGallery('${memeImg.url}',${memeImg.id})" />`;
        })
        .join('');
    elGallery.innerHTML = `<img class="img" src="img/upload.png" onclick="onUpload()" title="Upload your own image">` + strHTML;
}

function loadImage(imgName) {
    // console.log(imgId);
    const img = new Image();
    img.src = `${imgName}`;
    img.onload = function () {
        resizeCanvas(this.width, this.height);
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
    };
}

function uploadImg(elFile) {
    const img = new Image();
    img.src = URL.createObjectURL(elFile.files[0]);
    img.onload = function () {
        resizeCanvas(this.width, this.height);
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
    };
    onImageGallery(img.src, makeId(),true)
}

