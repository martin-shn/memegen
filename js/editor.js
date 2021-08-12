'use strict';

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
    for (var i = 0; i<gMeme.lines.length; i++) {
        if (isTextClicked(pos,gMeme.lines[i].area)) return i;
    }
    return -1;
}

function loadMeme(id){
    let storageMemes = loadFromStorage('userMemes');
    gMeme=storageMemes[id];
    renderCanvas();
}