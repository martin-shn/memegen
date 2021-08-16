'use strict';
let gIsChangeSize;
const handleSize = 15;
let gMeme = {};

const gStickers = ['img/icons/stickers/s1.png', 'img/icons/stickers/s2.png', 'img/icons/stickers/s3.png', 'img/icons/stickers/s4.png', 'img/icons/stickers/s5.png', 'img/icons/stickers/s6.png', 'img/icons/stickers/s7.png', 'img/icons/stickers/s8.png', 'img/icons/stickers/s9.png', 'img/icons/stickers/s10.png'];

function getMeme() {
    return gMeme;
}
function setMeme(meme) {
    gMeme = meme;
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
    const storageMemes = loadFromStorage('userMemes');
    gMeme = storageMemes[id];
    currTextLine = gMeme.selectedLineIdx;
    if (gMeme.lines[currTextLine].txt) document.querySelector('.meme-text').value = gMeme.lines[currTextLine].txt;
    else document.querySelector('.meme-text').value = '';
    const img = new Image();
    img.src = `${gMeme.selectedImgName}`;
    img.onload = function () {
        resizeCanvas(this.width, this.height);
    };
    renderCanvas();
}

function deleteMeme(id) {
    const storageMemes = loadFromStorage('userMemes');
    storageMemes.splice(id, 1);
    saveToStorage('userMemes', storageMemes);
    createMemesMenu();
    if (document.querySelector('.memes').childElementCount === 0) onMemes();
}

function createMemesMenu() {
    const storageMemes = loadFromStorage('userMemes');
    if (!storageMemes) return;
    const strHTML = storageMemes
        .map(function (meme, idx) {
            return `<img src="${meme.thumbnail}" onclick="loadMeme(${idx})" oncontextmenu="deleteMeme(${idx})" title="Right-click to delete me">`;
        })
        .join('');
    document.querySelector('.memes').innerHTML = strHTML;
}

function addHandle() {
    const currArea = gMeme.lines[currTextLine].area;
    gCtx.beginPath();
    gCtx.fillStyle = 'rgba(0,0,0,0.6)';
    gCtx.fillRect(currArea.startX + currArea.dx - handleSize, currArea.startY - handleSize, handleSize + 1, handleSize + 1);
}

function setTextSize(isChangeTextSize) {
    gIsChangeSize = isChangeTextSize;
}

function isClickedOnHandle(clickedPos) {
    const area = gMeme.lines[currTextLine].area;
    return clickedPos.x > area.startX + area.dx - handleSize - 1 && clickedPos.x < area.startX + area.dx && clickedPos.y < area.startY && clickedPos.y > area.startY - handleSize - 1;
}

function createStickers() {
    document.querySelector('.stickers').innerHTML = gStickers
        .map(function (sticker, idx) {
            return `<img src="${sticker}" onclick="onSticker(${idx})" />`;
        })
        .join('');
}

function createFonts() {
    const fonts = ['Impact', 'Lato', 'Secular:Secular(hebrew)', 'Arial', 'Times New Roman', 'Courier', 'Helvetica', 'Tahoma', 'Comic Sans MS'];
    document.querySelector('.font').innerHTML = fonts
        .map(function (font) {
            let fontName;
            let fontLabel;
            fontName = fontLabel = font;
            let div = font.indexOf(':');
            if (div>0) {
                fontName = font.substr(0, div);
                fontLabel = font.substr(div + 1);
            }
            return `<option value="${fontName}" style="font-family:${fontName}">${fontLabel}</option>`;
        })
        .join('');
}
