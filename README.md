# Reduce Image Distraction

Chrome extension to reduce image distraction by applying filters.

### jmr todo

Work in shadow dom and iframe (maybe instead of whole iframe, apply to whole iframe initially then after it loads apply to images within and turn off iframe's whole filter)
Add whitelist/blacklist capability

Can run this in console to see what it'd look like:
let imgs=document.getElementsByTagName("img"); for(let i=0; i<imgs.length; i++) {imgs[i].style.filter = "contrast(20%) grayscale(90%)"};

This wouldn't affect images added via a css rule that set background-image (but does if it's set via style)

## License

All rights reserved.
