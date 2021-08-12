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
    if (amount < 0) amount = Object.keys(gTags).length;
    for (var i = 0; i < amount; i++) {
        strHTML += `<span style="font-size:${Object.values(gTags)[i]}em" onclick="tagClick(this)">${Object.keys(gTags)[i]}</span>`;
    }

    elTags.innerHTML = strHTML;
}

function tagClick(el) {
    let tagName = el.innerText;
    gTags[tagName] += 0.1;
    if (document.querySelectorAll('.search-tags span').length > 5) updateTags();
    else updateTags(5);
    createGallery(findImgs(tagName));
    document.querySelector('.search-container input').value = tagName;
}

function findImgs(searchText) {
    return memeImgs.filter((m) => isMatch(m.tags, searchText));
}

function isMatch(tags, searchText) {
    return tags.filter((s) => s.toLowerCase().includes(searchText.toLowerCase())).length > 0;
}
