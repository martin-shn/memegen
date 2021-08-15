'use strict';

let gElCanvas;
let gCtx;
let gIsDown = false;
let gCurrMeme;
let gCurrArea;

const gTouchEvs = ['touchstart', 'touchmove', 'touchend'];

let currTextLine = 0;
let currPos = {};
let gLastPos;

function onInit() {
    gCurrMeme = getMeme();
    gElCanvas = document.querySelector('canvas');
    gCtx = gElCanvas.getContext('2d');
    createGallery();
    createTags();
    if (isMobile()) updateTags(tagsMobile);
    else updateTags(tagsDesktop);
    createMemesMenu();
    addListeners();
    document.querySelector('.memes').addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
}

function renderCanvas(isOutline = true) {
    // gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height);
    gCurrMeme = getMeme();
    if (!gCurrMeme.selectedImgName) return;
    const img = new Image();
    img.src = `${gCurrMeme.selectedImgName}`;
    img.onload = () => {
        let textWidth;
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height); //img,x,y,xend,yend
        gCurrMeme.lines.forEach(function (line, idx) {
            if ('sticker' in line) {
                // sticker line
                const sticker = new Image();
                sticker.src = gStickers[line.sticker];
                sticker.onload = () => {
                    gCtx.drawImage(sticker, line.x, line.y, line.stickerDX, line.stickerDY);
                };
            } else {
                // text line
                if (!line.txt) return;
                gCtx.font = line.size + 'px ' + line.font;
                gCtx.textAlign = line.align;
                gCtx.fillStyle = line.textColor;
                gCtx.fillText(line.txt, line.x, line.y);
                gCtx.strokeStyle = line.strokeColor;
                gCtx.strokeText(line.txt, line.x, line.y);
                if (idx === currTextLine) textWidth = gCtx.measureText(line.txt).width;
            }
        });
        //draw the outline of the selected text
        if (isOutline) {
            if ('sticker' in gCurrMeme.lines[currTextLine]) {
                // draw outline for sticker
                gCtx.beginPath();
                gCtx.strokeStyle = '#FF0000';
                gCtx.rect(gCurrMeme.lines[currTextLine].x - 5, gCurrMeme.lines[currTextLine].y - 5, gCurrMeme.lines[currTextLine].stickerDX + 10, gCurrMeme.lines[currTextLine].stickerDY + 10);
                gCurrArea = { startX: gCurrMeme.lines[currTextLine].x - 5, startY: gCurrMeme.lines[currTextLine].y + gCurrMeme.lines[currTextLine].stickerDY + 5, dx: gCurrMeme.lines[currTextLine].stickerDX + 10, dy: 0 - gCurrMeme.lines[currTextLine].stickerDY - 10 };
                gCurrMeme.lines[currTextLine].area = gCurrArea;
                gCtx.stroke();
                addHandle();
                return;
            }
            if (!gCurrMeme.lines[currTextLine].txt) return;
            gCtx.beginPath();
            gCtx.strokeStyle = '#FF0000';

            const textHeight = gCurrMeme.lines[currTextLine].size;
            switch (gCurrMeme.lines[currTextLine].align) {
                case 'left':
                    gCtx.rect(0, gCurrMeme.lines[currTextLine].y + 5, textWidth + 10, 0 - textHeight - 5);
                    gCurrArea = { startX: 0, startY: gCurrMeme.lines[currTextLine].y + 5, dx: textWidth + 10, dy: 0 - textHeight - 5 };
                    break;
                case 'center':
                    gCtx.rect(gCurrMeme.lines[currTextLine].x - textWidth / 2 - 5, gCurrMeme.lines[currTextLine].y + 5, textWidth + 10, 0 - textHeight - 5);
                    gCurrArea = { startX: gCurrMeme.lines[currTextLine].x - textWidth / 2 - 5, startY: gCurrMeme.lines[currTextLine].y + 5, dx: textWidth + 10, dy: 0 - textHeight - 5 };
                    break;
                case 'right':
                    gCtx.rect(gElCanvas.width - textWidth - 10, gCurrMeme.lines[currTextLine].y + 5, textWidth + 10, 0 - textHeight - 5);
                    gCurrArea = { startX: gElCanvas.width - textWidth - 10, startY: gCurrMeme.lines[currTextLine].y + 5, dx: textWidth + 10, dy: 0 - textHeight - 5 };
                    break;
            }
            gCtx.stroke();
            gCurrMeme.lines[currTextLine].area = gCurrArea;
            addHandle();
        }
    };
}

function resizeCanvas(imgW, imgH) {
    const elTools = document.querySelector('.tools');
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const elContainer = document.querySelector('.canvas-container');
    let canvasW, canvasH;
    if (isMobile()) {
        canvasH = canvasW = screenW * 0.8;
        elTools.style.width = canvasW + 'px';
        elTools.style.height = '';
    } else {
        canvasW = screenW * 0.4;
        canvasH = canvasW;
        if (canvasH > screenH * 0.6) {
            canvasH = canvasW = screenH * 0.6;
        }
        elTools.style.height = canvasH + 'px';
    }

    canvasH = (imgH * canvasW) / imgW;
    elContainer.style.width = canvasW + 'px';
    elContainer.style.height = canvasH + 'px';
    gElCanvas.width = elContainer.offsetWidth;
    gElCanvas.height = elContainer.offsetHeight;
}

function onGallery() {
    document.querySelector('#hamburger').checked = false;
    if (!document.querySelector('.gallery').classList.contains('first-show')) return;
    switchDisplay();
}

function onMemes() {
    document.querySelector('#hamburger').checked = false;
    if (document.querySelector('.memes').childElementCount === 0) return;
    document.querySelector('.memes').classList.toggle('hidden');
}

function onImageGallery(imgName, imgId, isUpload = false) {
    document.querySelector('#hamburger').checked = false;
    if (!isUpload) loadImage(imgName);
    currTextLine = 0;
    currPos = {};
    gCurrMeme = {};
    document.querySelector('.meme-text').value = '';
    gCurrMeme.selectedImgId = imgId;
    gCurrMeme.selectedImgName = imgName;
    gCurrMeme.selectedLineIdx = 0;
    gCurrMeme.lines = [
        {
            size: 20,
            align: 'center',
            textColor: '#FFFFFF',
            strokeColor: '#000000',
            font: 'Impact',
        },
    ];
    setMeme(gCurrMeme);

    switchDisplay();
    gCurrMeme.lines[0].x = gElCanvas.width / 2;
    gCurrMeme.lines[0].y = 30;
    if (!isMobile()) document.querySelector('.meme-text').focus();
}

function switchDisplay() {
    document.querySelector('.editor').classList.toggle('flex');
    document.querySelector('.search-container').classList.toggle('hidden');
    document.querySelector('.about').classList.toggle('hidden');
    document.querySelector('.gallery').classList.toggle('hidden');
    document.querySelector('.gallery').classList.add('first-show');
    if (!document.querySelector('.gallery').classList.contains('hidden')) {
        document.querySelector('.gallery-link').innerText = 'Editor';
    } else document.querySelector('.gallery-link').innerText = 'Gallery';
    resizeCanvas();
    renderCanvas();
}

function onUpdateText() {
    if ('sticker' in gCurrMeme.lines[currTextLine]) {
        delete gCurrMeme.lines[currTextLine].sticker;
        if (gCurrMeme.lines[currTextLine].align === 'right') gCurrMeme.lines[currTextLine].x = gElCanvas.width - 6;
    }
    const txt = document.querySelector('.meme-text').value;
    addText(currTextLine, txt);
    renderCanvas();
}

function onAddText() {
    document.querySelector('.meme-text').value = '';
    gCurrMeme.lines.push({
        size: 20,
        align: 'center',
        textColor: '#FFFFFF',
        strokeColor: '#000000',
        font: document.querySelector('.font').value,
    });
    currTextLine = gCurrMeme.lines.length - 1;

    if (currTextLine === 0) currPos = { x: gElCanvas.width / 2, y: 30 };
    else if (currTextLine === 1) currPos = { x: gElCanvas.width / 2, y: gElCanvas.height - 30 };
    else currPos = { x: gElCanvas.width / 2, y: gElCanvas.height / 2 };
    gCurrMeme.lines[currTextLine].x = currPos.x;
    gCurrMeme.lines[currTextLine].y = currPos.y;
    document.querySelector('.text-stroke-icon').style.backgroundColor = gCurrMeme.lines[currTextLine].strokeColor;
    document.querySelector('.text-color-icon').style.backgroundColor = gCurrMeme.lines[currTextLine].textColor;
    renderCanvas();
    document.querySelector('.meme-text').focus();
}

function onUpDown() {
    currTextLine++;
    if (currTextLine >= gCurrMeme.lines.length) currTextLine = 0;
    if (!gCurrMeme.lines[currTextLine].txt && !('sticker' in gCurrMeme.lines[currTextLine])) return;
    if (!('sticker' in gCurrMeme.lines[currTextLine])) {
        document.querySelector('.meme-text').value = gCurrMeme.lines[currTextLine].txt;
        document.querySelector('.text-stroke-icon').style.backgroundColor = gCurrMeme.lines[currTextLine].strokeColor;
        document.querySelector('.text-color-icon').style.backgroundColor = gCurrMeme.lines[currTextLine].textColor;
        document.querySelector('.font').value = gCurrMeme.lines[currTextLine].font;
    } else document.querySelector('.meme-text').value = '';
    renderCanvas();
}

function onDeleteText() {
    gCurrMeme.lines.splice(currTextLine, 1);
    if (gCurrMeme.lines.length === 0) {
        onAddText();
        return;
    }
    onUpDown();
    renderCanvas();
    if (!isMobile()) document.querySelector('.meme-text').focus();
}

function onIncFont() {
    if ('sticker' in gCurrMeme.lines[currTextLine]) {
        gCurrMeme.lines[currTextLine].stickerDX++;
        gCurrMeme.lines[currTextLine].stickerDY++;
    } else {
        gCurrMeme.lines[currTextLine].size++;
    }
    renderCanvas();
}
function onDecFont() {
    if ('sticker' in gCurrMeme.lines[currTextLine]) {
        if (gCurrMeme.lines[currTextLine].stickerDX < 1 || gCurrMeme.lines[currTextLine].stickerDY < 1) return;
        gCurrMeme.lines[currTextLine].stickerDX--;
        gCurrMeme.lines[currTextLine].stickerDY--;
    } else {
        if (gCurrMeme.lines[currTextLine].size < 1) return;
        gCurrMeme.lines[currTextLine].size--;
    }
    renderCanvas();
}
function onAlign(align) {
    gCurrMeme.lines[currTextLine].align = align;
    switch (align) {
        case 'left':
            gCurrMeme.lines[currTextLine].x = 6;
            break;
        case 'center':
            gCurrMeme.lines[currTextLine].x = gElCanvas.width / 2;
            break;
        case 'right':
            if ('sticker' in gCurrMeme.lines[currTextLine]) gCurrMeme.lines[currTextLine].x = gElCanvas.width - gCurrMeme.lines[currTextLine].stickerDY - 6;
            else gCurrMeme.lines[currTextLine].x = gElCanvas.width - 6;
            break;
    }
    renderCanvas();
}

function onSelectFont(font) {
    gCurrMeme.lines[currTextLine].font = font;
    gCtx.direction = 'ltr';
    if (font === 'Secular') gCtx.direction = 'rtl';
    renderCanvas();
}
function onStrokeColor() {
    document.querySelector('.text-stroke').click();
}
function onFontColor() {
    document.querySelector('.text-color').click();
}

function onStrokeColorSelect(el) {
    document.querySelector('.text-stroke-icon').style.backgroundColor = el.value;
    gCurrMeme.lines[currTextLine].strokeColor = el.value;
    renderCanvas();
}
function onFontColorSelect(el) {
    document.querySelector('.text-color-icon').style.backgroundColor = el.value;
    gCurrMeme.lines[currTextLine].textColor = el.value;
    renderCanvas();
}

function addListeners() {
    addMouseListeners();
    addTouchListeners();
    window.addEventListener('resize', () => {
        resizeCanvas();
        renderCanvas();
    });
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove);
    gElCanvas.addEventListener('mousedown', onDown);
    gElCanvas.addEventListener('mouseup', onUp);
    gElCanvas.addEventListener('mouseleave', onUp);
    gElCanvas.addEventListener('click', onClick);
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove);
    gElCanvas.addEventListener('touchstart', onDown);
    gElCanvas.addEventListener('touchend', onUp);
}

function onClick(ev) {
    // ev.preventDefault();
    const pos = getEvPos(ev);
    // if (!isTextClicked(pos, currArea)) return;
    const clickedLine = findTextClicked(pos);
    if (clickedLine >= 0) currTextLine = clickedLine;
    else return;
    currTextLine--;
    onUpDown();
    renderCanvas();
}

function onDown(ev) {
    ev.preventDefault();
    const pos = getEvPos(ev);
    const clickedLine = findTextClicked(pos);
    if (clickedLine >= 0) currTextLine = clickedLine;
    else return;
    if (isClickedOnHandle(pos)) setTextSize(true);
    else setTextDrag(true);
    gLastPos = pos;
    if (gCurrMeme.lines[currTextLine].align !== 'center') {
        gCurrMeme.lines[currTextLine].x = pos.x;
        gCurrMeme.lines[currTextLine].align = 'center';
    }
    document.body.style.cursor = 'grabbing';
    document.querySelector('.font').value = gCurrMeme.lines[currTextLine].font;
    document.querySelector('.text-stroke-icon').style.backgroundColor = gCurrMeme.lines[currTextLine].strokeColor;
    document.querySelector('.text-color-icon').style.backgroundColor = gCurrMeme.lines[currTextLine].textColor;
    document.querySelector('.meme-text').value = gCurrMeme.lines[currTextLine].txt ? gCurrMeme.lines[currTextLine].txt : '';
    renderCanvas();
}

function onMove(ev) {
    ev.preventDefault();
    if (gIsDown) {
        const pos = getEvPos(ev);
        const dx = pos.x - gLastPos.x;
        const dy = pos.y - gLastPos.y;
        moveText(dx, dy);
        gLastPos = pos;
        renderCanvas();
    }
    if (gIsChangeSize) {
        const pos = getEvPos(ev);
        const dx = pos.x - gLastPos.x;
        const dy = pos.y - gLastPos.y;
        gCurrMeme.lines[currTextLine].area.dx += dx;
        gCurrMeme.lines[currTextLine].stickerDX += dx;
        gCurrMeme.lines[currTextLine].area.dy += dy;
        gCurrMeme.lines[currTextLine].stickerDY += dy;
        if (gCurrMeme.lines[currTextLine].size > 1 || gCurrMeme.lines[currTextLine].size + dx > 1) gCurrMeme.lines[currTextLine].size += dx;
        gLastPos = pos;
        renderCanvas();
    }
}

function onUp(ev) {
    setTextDrag(false);
    setTextSize(false);
    document.body.style.cursor = 'default';
}

function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    };
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault();
        ev = ev.changedTouches[0];
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
        };
    }
    return pos;
}

function onShare() {
    renderCanvas(false);
    setTimeout(shareImg, 1000);
}

function onDownload() {
    renderCanvas(false);
    setTimeout(downloadMeme, 1000);
}

function onSave() {
    saveMeme(gCurrMeme);
    createMemesMenu();
}

function onSearchMore() {
    if (document.querySelector('.search-container a').innerText === 'close!') {
        if (isMobile()) updateTags(tagsMobile);
        else updateTags(tagsDesktop);
        document.querySelector('.search-container a').innerText = 'more...';
    } else {
        updateTags();
        document.querySelector('.search-container a').innerText = 'close!';
    }
    document.querySelector('.search-container').classList.toggle('more');
}

function onSearchKeywords(searchText) {
    const searchResults = findImgs(searchText);
    createGallery(searchResults);
}

function onSticker(stickerId) {
    document.querySelector('.meme-text').value = '';
    delete gCurrMeme.lines[currTextLine].txt;
    gCurrMeme.lines[currTextLine].sticker = stickerId;
    gCurrMeme.lines[currTextLine].x = gElCanvas.width / 2;
    gCurrMeme.lines[currTextLine].y = gElCanvas.height / 2;
    gCurrMeme.lines[currTextLine].stickerDX = 50;
    gCurrMeme.lines[currTextLine].stickerDY = 50;
    gCurrMeme.lines[currTextLine].align = 'center';
    renderCanvas();
}

function onUpload() {
    document.querySelector('.upload-file').click();
}

function onClearSearch() {
    document.querySelector('.search-container input').value = '';
    onSearchKeywords('');
}
