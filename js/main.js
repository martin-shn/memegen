'use strict';

var gElCanvas,
    gCtx,
    gIsDown = false;

var colors;

function onInit() {
    gElCanvas = document.querySelector('canvas');
    gCtx = gElCanvas.getContext('2d');
    colors = { stroke: '#000000', text: '#FFFFFF' };
    resizeCanvas();
    gElCanvas.setAttribute('style', 'background-color:#FFF');
    createGallery();
    createTags();
    updateTags(5);
}
function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    gElCanvas.width = elContainer.offsetWidth;
    gElCanvas.height = elContainer.offsetHeight;
}
function onGallery(el) {
    switchDisplay();
}
function onMemes() {}

function onImageGallery(elImg) {
    loadImage(elImg);
    switchDisplay();
}

function onStrokeColor() {
    document.querySelector('.text-stroke').click();
}
function onFontColor() {
    document.querySelector('.text-color').click();
}

function onStrokeColorSelect(el) {
    document.querySelector('.text-stroke-icon').style.backgroundColor = el.value;
    colors.stroke = el.value;
}
function onFontColorSelect(el) {
    document.querySelector('.text-color-icon').style.backgroundColor = el.value;
    colors.text = el.value;
}

function switchDisplay() {
    document.querySelector('.editor').classList.toggle('flex');
    document.querySelector('.search-container').classList.toggle('hidden');
    document.querySelector('.about').classList.toggle('hidden');
    document.querySelector('.gallery').classList.toggle('hidden');
}
