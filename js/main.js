'use strict';

var gElCanvas,
    gCtx,
    gIsDown = false,
    currGMeme,
    currArea;

const gTouchEvs = ['touchstart', 'touchmove', 'touchend'];

var currTextLine = 0,
    currPos = {},
    gLastPos;

function onInit() {
    currGMeme = getGMeme();
    gElCanvas = document.querySelector('canvas');
    gCtx = gElCanvas.getContext('2d');
    createGallery();
    createTags();
    updateTags(5);
    createMemesMenu();
    addListeners();
    document.querySelector('.memes').addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
}

function renderCanvas(isOutline = true) {
    // gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height);
    currGMeme = getGMeme();
    if (!currGMeme.selectedImgName) return;
    var img = new Image();
    img.src = `${currGMeme.selectedImgName}`;
    img.onload = () => {
        let textWidth;
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height); //img,x,y,xend,yend
        currGMeme.lines.forEach(function (line, idx) {
            if ('sticker' in line) {
                // sticker line
                let sticker = new Image();
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
            if ('sticker' in currGMeme.lines[currTextLine]) {
                // draw outline for sticker
                gCtx.beginPath();
                gCtx.strokeStyle = '#FF0000';
                gCtx.rect(currGMeme.lines[currTextLine].x - 5, currGMeme.lines[currTextLine].y - 5, currGMeme.lines[currTextLine].stickerDX + 10, currGMeme.lines[currTextLine].stickerDY + 10);
                currArea = { startX: currGMeme.lines[currTextLine].x - 5, startY: currGMeme.lines[currTextLine].y + currGMeme.lines[currTextLine].stickerDY + 5, dx: currGMeme.lines[currTextLine].stickerDX + 10, dy: 0 - currGMeme.lines[currTextLine].stickerDY - 10 };
                currGMeme.lines[currTextLine].area = currArea;
                gCtx.stroke();
                addHandle();
                return;
            }
            if (!currGMeme.lines[currTextLine].txt) return;
            gCtx.beginPath();
            gCtx.strokeStyle = '#FF0000';

            let textHeight = currGMeme.lines[currTextLine].size;
            switch (currGMeme.lines[currTextLine].align) {
                case 'left':
                    gCtx.rect(0, currGMeme.lines[currTextLine].y + 5, textWidth + 10, 0 - textHeight - 5);
                    currArea = { startX: 0, startY: currGMeme.lines[currTextLine].y + 5, dx: textWidth + 10, dy: 0 - textHeight - 5 };
                    break;
                case 'center':
                    gCtx.rect(currGMeme.lines[currTextLine].x - textWidth / 2 - 5, currGMeme.lines[currTextLine].y + 5, textWidth + 10, 0 - textHeight - 5);
                    currArea = { startX: currGMeme.lines[currTextLine].x - textWidth / 2 - 5, startY: currGMeme.lines[currTextLine].y + 5, dx: textWidth + 10, dy: 0 - textHeight - 5 };
                    break;
                case 'right':
                    gCtx.rect(gElCanvas.width - textWidth - 10, currGMeme.lines[currTextLine].y + 5, textWidth + 10, 0 - textHeight - 5);
                    currArea = { startX: gElCanvas.width - textWidth - 10, startY: currGMeme.lines[currTextLine].y + 5, dx: textWidth + 10, dy: 0 - textHeight - 5 };
                    break;
            }
            gCtx.stroke();
            currGMeme.lines[currTextLine].area = currArea;
            addHandle();
        }
    };
    // loadImage(gMeme.selectedImgName);
}

function resizeCanvas(imgW, imgH) {
    var elTools = document.querySelector('.tools');
    let screenW = window.innerWidth;
    let screenH = window.innerHeight;
    var elContainer = document.querySelector('.canvas-container');
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
    // gElCanvas.width=canvasW;
    // gElCanvas.height=canvasH;
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
    currGMeme = {};
    document.querySelector('.meme-text').value = '';
    currGMeme.selectedImgId = imgId;
    currGMeme.selectedImgName = imgName;
    currGMeme.selectedLineIdx = 0;
    currGMeme.lines = [
        {
            size: 20,
            align: 'center',
            textColor: '#FFFFFF',
            strokeColor: '#000000',
            font: 'Impact',
            x: gElCanvas.width / 2,
            y: 30,
        },
    ];
    setGMeme(currGMeme);

    switchDisplay();
    if (!isMobile()) document.querySelector('.meme-text').focus();
}

function isMobile() {
    return window.innerWidth <= 500; // && window.innerHeight <= 600;
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
    if ('sticker' in currGMeme.lines[currTextLine]) {
        delete currGMeme.lines[currTextLine].sticker;
        if (currGMeme.lines[currTextLine].align === 'right') currGMeme.lines[currTextLine].x = gElCanvas.width - 6;
    }
    let txt = document.querySelector('.meme-text').value;
    addText(currTextLine, txt);
    renderCanvas();
}

function onAddText() {
    document.querySelector('.meme-text').value = '';
    currGMeme.lines.push({
        size: 20,
        align: 'center',
        textColor: '#FFFFFF',
        strokeColor: '#000000',
        font: document.querySelector('.font').value,
    });
    currTextLine = currGMeme.lines.length - 1;

    if (currTextLine === 0) currPos = { x: gElCanvas.width / 2, y: 30 };
    else if (currTextLine === 1) currPos = { x: gElCanvas.width / 2, y: gElCanvas.height - 30 };
    else currPos = { x: gElCanvas.width / 2, y: gElCanvas.height / 2 };
    currGMeme.lines[currTextLine].x = currPos.x;
    currGMeme.lines[currTextLine].y = currPos.y;
    document.querySelector('.text-stroke-icon').style.backgroundColor = currGMeme.lines[currTextLine].strokeColor;
    document.querySelector('.text-color-icon').style.backgroundColor = currGMeme.lines[currTextLine].textColor;
    renderCanvas();
    document.querySelector('.meme-text').focus();
}

function onUpDown() {
    currTextLine++;
    if (currTextLine >= currGMeme.lines.length) currTextLine = 0;
    if (!currGMeme.lines[currTextLine].txt && !('sticker' in currGMeme.lines[currTextLine])) return;
    if (!('sticker' in currGMeme.lines[currTextLine])) {
        document.querySelector('.meme-text').value = currGMeme.lines[currTextLine].txt;
        document.querySelector('.text-stroke-icon').style.backgroundColor = currGMeme.lines[currTextLine].strokeColor;
        document.querySelector('.text-color-icon').style.backgroundColor = currGMeme.lines[currTextLine].textColor;
        document.querySelector('.font').value = currGMeme.lines[currTextLine].font;
    } else document.querySelector('.meme-text').value = '';
    renderCanvas();
}

function onDeleteText() {
    currGMeme.lines.splice(currTextLine, 1);
    if (currGMeme.lines.length === 0) {
        onAddText();
        return;
    }
    onUpDown();
    renderCanvas();
    if (!isMobile()) document.querySelector('.meme-text').focus();
}

function onIncFont() {
    if ('sticker' in currGMeme.lines[currTextLine]) {
        currGMeme.lines[currTextLine].stickerDX++;
        currGMeme.lines[currTextLine].stickerDY++;
    } else {
        currGMeme.lines[currTextLine].size++;
    }
    renderCanvas();
}
function onDecFont() {
    if ('sticker' in currGMeme.lines[currTextLine]) {
        if (currGMeme.lines[currTextLine].stickerDX < 1 || currGMeme.lines[currTextLine].stickerDY < 1) return;
        currGMeme.lines[currTextLine].stickerDX--;
        currGMeme.lines[currTextLine].stickerDY--;
    } else {
        if (currGMeme.lines[currTextLine].size < 1) return;
        currGMeme.lines[currTextLine].size--;
    }
    renderCanvas();
}
function onAlign(align) {
    currGMeme.lines[currTextLine].align = align;
    switch (align) {
        case 'left':
            currGMeme.lines[currTextLine].x = 6;
            break;
        case 'center':
            currGMeme.lines[currTextLine].x = gElCanvas.width / 2;
            break;
        case 'right':
            if ('sticker' in currGMeme.lines[currTextLine]) currGMeme.lines[currTextLine].x = gElCanvas.width - currGMeme.lines[currTextLine].stickerDY - 6;
            else currGMeme.lines[currTextLine].x = gElCanvas.width - 6;
            break;
    }
    renderCanvas();
}

function onSelectFont(font) {
    currGMeme.lines[currTextLine].font = font;
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
    currGMeme.lines[currTextLine].strokeColor = el.value;
    renderCanvas();
}
function onFontColorSelect(el) {
    document.querySelector('.text-color-icon').style.backgroundColor = el.value;
    currGMeme.lines[currTextLine].textColor = el.value;
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
    let clickedLine = findTextClicked(pos);
    if (clickedLine >= 0) currTextLine = clickedLine;
    else return;
    currTextLine--;
    onUpDown();
    renderCanvas();
}

function onDown(ev) {
    ev.preventDefault();
    const pos = getEvPos(ev);
    let clickedLine = findTextClicked(pos);
    if (clickedLine >= 0) currTextLine = clickedLine;
    else return;
    if (isClickedOnHandle(pos)) setTextSize(true);
    else setTextDrag(true);
    gLastPos = pos;
    if (currGMeme.lines[currTextLine].align !== 'center') {
        currGMeme.lines[currTextLine].x = pos.x;
        currGMeme.lines[currTextLine].align = 'center';
    }
    document.body.style.cursor = 'grabbing';
    document.querySelector('.font').value = currGMeme.lines[currTextLine].font;
    document.querySelector('.text-stroke-icon').style.backgroundColor = currGMeme.lines[currTextLine].strokeColor;
    document.querySelector('.text-color-icon').style.backgroundColor = currGMeme.lines[currTextLine].textColor;
    document.querySelector('.meme-text').value = currGMeme.lines[currTextLine].txt;
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
        currGMeme.lines[currTextLine].area.dx += dx;
        currGMeme.lines[currTextLine].stickerDX += dx;
        currGMeme.lines[currTextLine].area.dy += dy;
        currGMeme.lines[currTextLine].stickerDY += dy;
        if (currGMeme.lines[currTextLine].size > 1 || currGMeme.lines[currTextLine].size + dx > 1) currGMeme.lines[currTextLine].size += dx;
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
    currGMeme.selectedLineIdx = currTextLine;
    currGMeme.thumbnail = gElCanvas.toDataURL('image/jpeg', 0.1);
    let userMemes = loadFromStorage('userMemes');
    if (userMemes) {
        // add to storage
        userMemes.push(currGMeme);
    } else {
        // create first storage
        userMemes = [currGMeme];
    }
    saveToStorage('userMemes', userMemes);
    createMemesMenu();
}

function onSearchMore() {
    if (document.querySelectorAll('.search-tags span').length > 5) {
        updateTags(5);
        document.querySelector('.search-container a').innerText = 'more...';
    } else {
        updateTags();
        document.querySelector('.search-container a').innerText = 'close!';
    }
    document.querySelector('.search-container').classList.toggle('more');
}

function onSearchKeywords(searchText) {
    let searchResults = findImgs(searchText);
    createGallery(searchResults);
}

function onSticker(stickerId) {
    document.querySelector('.meme-text').value = '';
    delete currGMeme.lines[currTextLine].txt;
    currGMeme.lines[currTextLine].sticker = stickerId;
    currGMeme.lines[currTextLine].x = gElCanvas.width / 2;
    currGMeme.lines[currTextLine].y = gElCanvas.height / 2;
    currGMeme.lines[currTextLine].stickerDX = 50;
    currGMeme.lines[currTextLine].stickerDY = 50;
    currGMeme.lines[currTextLine].align = 'center';
    renderCanvas();
}

function onUpload() {
    document.querySelector('.upload-file').click();
}

function onClearSearch() {
    document.querySelector('.search-container input').value = '';
    onSearchKeywords('');
}
