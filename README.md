# Reduce Ad and Image Distraction

Reduce distraction by applying filters to iframes (which often serve ads) and images with low CPU and memory impact. Control filtering per website.

### jmr todo

Work in shadow dom and iframe (maybe instead of whole iframe, apply to whole iframe initially then after it loads apply to images within and turn off iframe's whole filter)
Add whitelist/blacklist capability

Can run this in console to see what it'd look like:
let imgs=document.getElementsByTagName("img"); for(let i=0; i<imgs.length; i++) {imgs[i].style.filter = "contrast(20%) grayscale(90%)"};

This wouldn't affect images added via a css rule that set background-image (but does if it's set via style). For example, a css rule
.class {background: url(some_img)} and .class {background-image: url(some_img)} both will NOT be affected

## License

All rights reserved.
