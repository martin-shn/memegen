'use strict';
let gIsChangeTextSize;

let gStickers = ['img/ICONS/stickers/S1.png', 'img/ICONS/stickers/S2.png', 'img/ICONS/stickers/S3.png'];

function addText(currTextLine, txt) {
    gMeme.lines[currTextLine].txt = txt;
}

function isTextClicked(clickedPos, area) {
    if (!area) return false;
    if (clickedPos.x > area.startX && clickedPos.x < area.startX + area.dx && clickedPos.y < area.startY && clickedPos.y > area.startY + area.dy) return true;
    return false;
}

function setTextDrag(isDrag) {
    gIsDown = isDrag;
}

function moveText(dx, dy) {
    gMeme.lines[currTextLine].x += dx;
    gMeme.lines[currTextLine].y += dy;
}

function findTextClicked(pos) {
    for (var i = 0; i < gMeme.lines.length; i++) {
        if (isTextClicked(pos, gMeme.lines[i].area)) return i;
    }
    return -1;
}

function loadMeme(id) {
    onMemes();
    if (!document.querySelector('.gallery').classList.contains('hidden')) switchDisplay();
    let storageMemes = loadFromStorage('userMemes');
    gMeme = storageMemes[id];
    currTextLine = gMeme.selectedLineIdx;
    if (gMeme.lines[currTextLine].txt) document.querySelector('.meme-text').value = gMeme.lines[currTextLine].txt;
    renderCanvas();
}

function createMemesMenu() {
    let storageMemes = loadFromStorage('userMemes');
    if (!storageMemes) return;
    let strHTML = storageMemes
        .map(function (meme, idx) {
            return `<img src="${meme.thumbnail}" onclick="loadMeme(${idx})">`;
        })
        .join('');
    document.querySelector('.memes').innerHTML = strHTML;
}

function addHandle() {
    let currArea = gMeme.lines[currTextLine].area;
    gCtx.beginPath();
    gCtx.fillStyle = 'rgba(0,0,0,0.6)';
    gCtx.fillRect(currArea.startX + currArea.dx - 10, currArea.startY - 10, 11, 11);
}

function setTextSize(isChangeTextSize) {
    gIsChangeTextSize = isChangeTextSize;
}

function isClickedOnHandle(clickedPos) {
    let area = gMeme.lines[currTextLine].area;
    if (clickedPos.x > area.startX + area.dx - 11 && clickedPos.x < area.startX + area.dx && clickedPos.y < area.startY && clickedPos.y > area.startY - 11) {
        return true;
    }
    return false;
}
