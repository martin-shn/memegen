'use strict';
let gIsChangeSize;
let handleSize = 15;
var gMeme = {};

let gStickers = ['img/icons/stickers/s1.png', 'img/icons/stickers/s2.png', 'img/icons/stickers/s3.png'];

function getGMeme() {
    return gMeme;
}
function setGMeme(GMeme) {
    gMeme = GMeme;
}

function addText(currTextLine, txt) {
    gMeme.lines[currTextLine].txt = txt;
}

function isTextClicked(clickedPos, area) {
    if (!area) return false;
    return clickedPos.x > area.startX && clickedPos.x < area.startX + area.dx && clickedPos.y < area.startY && clickedPos.y > area.startY + area.dy;
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
    else document.querySelector('.meme-text').value = '';
    var img = new Image();
    img.src = `${gMeme.selectedImgName}`;
    img.onload = function () {
        resizeCanvas(this.width, this.height);
    };
    renderCanvas();
}

function deleteMeme(id) {
    let storageMemes = loadFromStorage('userMemes');
    storageMemes.splice(id, 1);
    saveToStorage('userMemes', storageMemes);
    createMemesMenu();
    if (document.querySelector('.memes').childElementCount === 0) onMemes();
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
    gIsChangeSize = isChangeTextSize;
}

function isClickedOnHandle(clickedPos) {
    let area = gMeme.lines[currTextLine].area;
    return clickedPos.x > area.startX + area.dx - handleSize - 1 && clickedPos.x < area.startX + area.dx && clickedPos.y < area.startY && clickedPos.y > area.startY - handleSize - 1;
}
