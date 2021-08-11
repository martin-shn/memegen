'use strict';

function addText(currTextLine, txt) {
    gMeme.lines[currTextLine].txt = txt;
}

function isTextClicked(clickedPos, area) {
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
