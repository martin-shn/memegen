'use strict';
let gIsChangeTextSize;
let handleSize = 15;

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

function deleteMeme(id){
    let storageMemes = loadFromStorage('userMemes');
    storageMemes.splice(id,1);
    saveToStorage('userMemes', storageMemes);
    createMemesMenu();
    if (document.querySelector('.memes').childElementCount===0) onMemes();
}

function createMemesMenu() {
    let storageMemes = loadFromStorage('userMemes');
    if (!storageMemes) return;
    let strHTML = storageMemes
        .map(function (meme, idx) {
            return `<img src="${meme.thumbnail}" onclick="loadMeme(${idx})" oncontextmenu="deleteMeme(${idx})" title="Right-click to delete me">`;
        })
        .join('');
    document.querySelector('.memes').innerHTML = strHTML;
}

function addHandle() {
    let currArea = gMeme.lines[currTextLine].area;
    gCtx.beginPath();
    gCtx.fillStyle = 'rgba(0,0,0,0.6)';
    gCtx.fillRect(currArea.startX + currArea.dx - handleSize, currArea.startY - handleSize, handleSize + 1, handleSize + 1);
}

function setTextSize(isChangeTextSize) {
    gIsChangeTextSize = isChangeTextSize;
}

function isClickedOnHandle(clickedPos) {
    let area = gMeme.lines[currTextLine].area;
    if (clickedPos.x > area.startX + area.dx - handleSize - 1 && clickedPos.x < area.startX + area.dx && clickedPos.y < area.startY && clickedPos.y > area.startY - handleSize - 1) {
        return true;
    }
    return false;
}
