'use strict';

let memeImgs = [
    { id: 1, name: '1.jpg', tags: ['USA', 'trump', 'mad'] },
    { id: 2, name: '2.jpg', tags: ['dogs', 'cute', 'lick'] },
    { id: 3, name: '3.jpg', tags: ['baby', 'sleep', 'dog'] },
    { id: 4, name: '4.jpg', tags: ['cat', 'cute', 'sleep'] },
    { id: 5, name: '5.jpg', tags: ['mad', 'baby', 'angry'] },
    { id: 6, name: '6.jpg', tags: ['smile', 'funny', 'hair'] },
    { id: 7, name: '7.jpg', tags: ['baby', 'surprised', 'cute'] },
    { id: 8, name: '8.jpg', tags: ['think', 'smile', 'colors'] },
    { id: 9, name: '9.jpg', tags: ['baby', 'funny', 'smile'] },
    { id: 10, name: '10.jpg', tags: ['USA', 'obama', 'smile'] },
    { id: 11, name: '11.jpg', tags: ['fight', 'men', 'muscle'] },
    { id: 12, name: '12.jpg', tags: ['justice', 'israel', 'tv'] },
    { id: 13, name: '13.jpg', tags: ['cheers', 'smile', 'mmm'] },
    { id: 14, name: '14.jpg', tags: ['tv', 'sunglases', 'serious'] },
    { id: 15, name: '15.jpg', tags: ['hair', 'explain', 'sun'] },
    { id: 16, name: '16.jpg', tags: ['funny', 'tv', 'hair'] },
    { id: 17, name: '17.jpg', tags: ['putin', 'russia', 'victory'] },
    { id: 18, name: '18.jpg', tags: ['tv', 'toys', 'baby'] },
];

function createGallery() {
    var elGallery = document.querySelector('.gallery');
    //<img class="img id-1" src="img/gallery/1.jpg" onclick="onImageGallery(this)" />
    let strHTML = memeImgs
        .map(function (memeImg) {
            return `<img class="img id-${memeImg.id}" src="img/gallery/${memeImg.name}" onclick="onImageGallery('${memeImg.name}',${memeImg.id})" />`;
        })
        .join('');
    elGallery.innerHTML = strHTML;
}

function loadImage(imgName) {
    // console.log(imgId);
    var img = new Image();
    img.src = `img/gallery/${imgName}`;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height); //img,x,y,xend,yend
    };
    
}
