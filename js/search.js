'use strict';

let gTags = {};

function createTags() {
    memeImgs.forEach(function (memeImg) {
        memeImg.tags.forEach(function (tag) {
            if (tag in gTags) gTags[tag]++;
            else gTags[tag] = 1;
        });
    });
}

function updateTags(amount = -1) {
    let elTags = document.querySelector('.search-tags');
    //<span>funny</span>
    let strHTML = '';
    for (var i = 0; i < amount; i++) {
        var fontsize = 1.6;
        switch (gTags[Object.keys(gTags)[i]]) {
            case 1:
                fontsize = 1.1;
                break;
            case 2:
                fontsize = 1.2;
                break;
            case 3:
                fontsize = 1.3;
                break;
            case 4:
                fontsize = 1.4;
                break;
            case 5:
                fontsize = 1.5;
                break;
        }
        strHTML += `<span style="font-size:${fontsize}em" onclick="tagClick(this)">${Object.keys(gTags)[i]}</span>`;
    }

    elTags.innerHTML = strHTML;
}

function tagClick(el) {
    let tagName = el.innerText;
    gTags[tagName]++;
    updateTags(5);
}
