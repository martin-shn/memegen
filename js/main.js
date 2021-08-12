'use strict';

var gElCanvas,
    gCtx,
    gIsDown = false,
    currArea;

const gTouchEvs = ['touchstart', 'touchmove', 'touchend'];

var currTextLine = 0,
    currPos = {},
    gMeme = {},
    gLastPos;

function onInit() {
    gElCanvas = document.querySelector('canvas');
    gCtx = gElCanvas.getContext('2d');
    createGallery();
    createTags();
    updateTags(5);
    createMemesMenu();
    addListeners();
}

function renderCanvas(isOutline = true) {
    // gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height);
    var img = new Image();
    img.src = `img/gallery/${gMeme.selectedImgName}`;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height); //img,x,y,xend,yend
        gMeme.lines.forEach(function (line) {
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
            }
        });
        //draw the outline of the selected text
        if (isOutline) {
            if ('sticker' in gMeme.lines[currTextLine]) {
                // draw outline for sticker
                gCtx.beginPath();
                gCtx.strokeStyle = '#FF0000';
                gCtx.rect(gMeme.lines[currTextLine].x - 5, gMeme.lines[currTextLine].y - 5, gMeme.lines[currTextLine].stickerDX + 10, gMeme.lines[currTextLine].stickerDY + 10);
                currArea = { startX: gMeme.lines[currTextLine].x - 5, startY: gMeme.lines[currTextLine].y + gMeme.lines[currTextLine].stickerDY + 5, dx: gMeme.lines[currTextLine].stickerDX + 10, dy: 0 - gMeme.lines[currTextLine].stickerDY - 10 };
                gMeme.lines[currTextLine].area = currArea;
                gCtx.stroke();
                return;
            }
            if (!gMeme.lines[currTextLine].txt) return;
            gCtx.beginPath();
            gCtx.strokeStyle = '#FF0000';
            let textWidth = gCtx.measureText(gMeme.lines[currTextLine].txt).width;
            let textHeight = gMeme.lines[currTextLine].size;
            switch (gMeme.lines[currTextLine].align) {
                case 'left':
                    gCtx.rect(0, gMeme.lines[currTextLine].y + 5, textWidth + 10, 0 - textHeight - 5);
                    currArea = { startX: 0, startY: gMeme.lines[currTextLine].y + 5, dx: textWidth + 10, dy: 0 - textHeight - 5 };
                    break;
                case 'center':
                    gCtx.rect(gMeme.lines[currTextLine].x - textWidth / 2 - 5, gMeme.lines[currTextLine].y + 5, textWidth + 10, 0 - textHeight - 5);
                    currArea = { startX: gMeme.lines[currTextLine].x - textWidth / 2 - 5, startY: gMeme.lines[currTextLine].y + 5, dx: textWidth + 10, dy: 0 - textHeight - 5 };
                    break;
                case 'right':
                    gCtx.rect(gElCanvas.width - textWidth - 10, gMeme.lines[currTextLine].y + 5, textWidth + 10, 0 - textHeight - 5);
                    currArea = { startX: gElCanvas.width - textWidth - 10, startY: gMeme.lines[currTextLine].y + 5, dx: textWidth + 10, dy: 0 - textHeight - 5 };
                    break;
            }
            gCtx.stroke();
            gMeme.lines[currTextLine].area = currArea;
        }
    };
    // loadImage(gMeme.selectedImgName);
}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    gElCanvas.width = elContainer.offsetWidth;
    gElCanvas.height = elContainer.offsetHeight;
}

function onGallery(el) {
    switchDisplay();
    onOpenMenu();
}

function onMemes() {
    document.querySelector('.memes').classList.toggle('hidden');
}

function onImageGallery(imgName, imgId) {
    loadImage(imgName);
    currTextLine = 0;
    currPos = {};
    gMeme = {};
    document.querySelector('.meme-text').value = '';
    gMeme.selectedImgId = imgId;
    gMeme.selectedImgName = imgName;
    gMeme.selectedLineIdx = 0;
    gMeme.lines = [
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

    switchDisplay();
    document.querySelector('.meme-text').focus();
}

function switchDisplay() {
    document.querySelector('.editor').classList.toggle('flex');
    document.querySelector('.search-container').classList.toggle('hidden');
    document.querySelector('.about').classList.toggle('hidden');
    document.querySelector('.gallery').classList.toggle('hidden');
}

function onUpdateText() {
    if ('sticker' in gMeme.lines[currTextLine]) delete gMeme.lines[currTextLine].sticker;
    let txt = document.querySelector('.meme-text').value;
    addText(currTextLine, txt);
    renderCanvas();
}

function onAddText() {
    document.querySelector('.meme-text').value = '';
    gMeme.lines.push({
        size: 20,
        align: 'center',
        textColor: '#FFFFFF',
        strokeColor: '#000000',
        font: document.querySelector('.font').value,
    });
    currTextLine = gMeme.lines.length - 1;

    if (currTextLine === 0) currPos = { x: gElCanvas.width / 2, y: 30 };
    else if (currTextLine === 1) currPos = { x: gElCanvas.width / 2, y: gElCanvas.height - 30 };
    else currPos = { x: gElCanvas.width / 2, y: gElCanvas.height / 2 };
    gMeme.lines[currTextLine].x = currPos.x;
    gMeme.lines[currTextLine].y = currPos.y;
    document.querySelector('.text-stroke-icon').style.backgroundColor = gMeme.lines[currTextLine].strokeColor;
    document.querySelector('.text-color-icon').style.backgroundColor = gMeme.lines[currTextLine].textColor;
    renderCanvas();
    document.querySelector('.meme-text').focus();
}

function onUpDown() {
    currTextLine++;
    if (currTextLine >= gMeme.lines.length) currTextLine = 0;
    if (!gMeme.lines[currTextLine].txt) return;
    document.querySelector('.meme-text').value = gMeme.lines[currTextLine].txt;
    document.querySelector('.text-stroke-icon').style.backgroundColor = gMeme.lines[currTextLine].strokeColor;
    document.querySelector('.text-color-icon').style.backgroundColor = gMeme.lines[currTextLine].textColor;
    document.querySelector('.font').value = gMeme.lines[currTextLine].font;
    renderCanvas();
}

function onDeleteText() {
    gMeme.lines.splice(currTextLine, 1);
    if (gMeme.lines.length === 0) {
        onAddText();
        return;
    }
    onUpDown();
    renderCanvas();
    document.querySelector('.meme-text').focus();
}

function onIncFont() {
    // if (gMeme.lines[currTextLine].size > 30) return;
    gMeme.lines[currTextLine].size++;
    renderCanvas();
}
function onDecFont() {
    if (gMeme.lines[currTextLine].size < 1) return;
    gMeme.lines[currTextLine].size--;
    renderCanvas();
}
function onAlign(align) {
    gMeme.lines[currTextLine].align = align;
    switch (align) {
        case 'left':
            gMeme.lines[currTextLine].x = 5;
            break;
        case 'center':
            gMeme.lines[currTextLine].x = gElCanvas.width / 2;
            break;
        case 'right':
            gMeme.lines[currTextLine].x = gElCanvas.width - 5;
            break;
    }
    renderCanvas();
}

function onSelectFont(font) {
    gMeme.lines[currTextLine].font = font;
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
    gMeme.lines[currTextLine].strokeColor = el.value;
    renderCanvas();
}
function onFontColorSelect(el) {
    document.querySelector('.text-color-icon').style.backgroundColor = el.value;
    gMeme.lines[currTextLine].textColor = el.value;
    renderCanvas();
}

function addListeners() {
    addMouseListeners();
    addTouchListeners();
    // window.addEventListener('resize', () => {
    //     resizeCanvas();
    //     renderCanvas();
    // });
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
    setTextDrag(true);
    gLastPos = pos;
    document.body.style.cursor = 'grabbing';
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
}

function onUp(ev) {
    setTextDrag(false);
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
    gMeme.selectedLineIdx = currTextLine;
    gMeme.thumbnail = gElCanvas.toDataURL('image/jpeg', 0.1);
    let userMemes = loadFromStorage('userMemes');
    if (userMemes) {
        // add to storage
        userMemes.push(gMeme);
    } else {
        // create first storage
        userMemes = [gMeme];
    }
    saveToStorage('userMemes', userMemes);
    createMemesMenu();
}

function onOpenMenu() {
    document.querySelector('nav').classList.toggle('shown');
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
    delete gMeme.lines[currTextLine].txt;
    gMeme.lines[currTextLine].sticker = stickerId;
    gMeme.lines[currTextLine].x = gElCanvas.width / 2;
    gMeme.lines[currTextLine].y = gElCanvas.height / 2;
    gMeme.lines[currTextLine].stickerDX = 50;
    gMeme.lines[currTextLine].stickerDY = 50;
    renderCanvas();
}
