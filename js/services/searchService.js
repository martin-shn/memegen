'use strict';

const gTags = {};
const tagsMobile=3;
const tagsDesktop=5;

function createTags() {
    memeImgs.forEach(function (memeImg) {
        memeImg.tags.forEach(function (tag) {
            if (tag in gTags) gTags[tag]++;
            else gTags[tag] = 1;
        });
    });
}

function updateTags(amount = 0) {
    const elTags = document.querySelector('.search-tags');
    //<span>funny</span>
    let strHTML = '';
    Object.keys(gTags).forEach(function(tag,idx){
        if(amount && idx>=amount) return false;
        strHTML+= `<span style="font-size:${gTags[tag]}em" onclick="tagClick(this)">${tag}</span>`;
    });
    elTags.innerHTML = strHTML;
}

function tagClick(el) {
    const tagName = el.innerText;
    gTags[tagName] += 0.1;
    if (isMobile()) updateTags(tagsMobile);
    else updateTags(tagsDesktop);
    createGallery(findImgs(tagName));
    document.querySelector('.search-container input').value = tagName;
}

function findImgs(searchText) {
    return memeImgs.filter((meme) => isMatch(meme.tags, searchText));
}

function isMatch(tags, searchText) {
    return tags.filter((tag) => tag.toLowerCase().includes(searchText.toLowerCase())).length > 0;
}
