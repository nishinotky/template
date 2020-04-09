// UA
let _ua = (function (u) {
  return {
  Tablet:(u.indexOf("windows") != -1 && u.indexOf("touch") != -1 && u.indexOf("tablet pc") == -1)
    || u.indexOf("ipad") != -1
    || (u.indexOf("android") != -1 && u.indexOf("mobile") == -1)
    || (u.indexOf("firefox") != -1 && u.indexOf("tablet") != -1)
    || u.indexOf("kindle") != -1
    || u.indexOf("silk") != -1
    || u.indexOf("playbook") != -1,
  Mobile:(u.indexOf("windows") != -1 && u.indexOf("phone") != -1)
    || u.indexOf("iphone") != -1
    || u.indexOf("ipod") != -1
    || (u.indexOf("android") != -1 && u.indexOf("mobile") != -1)
    || (u.indexOf("firefox") != -1 && u.indexOf("mobile") != -1)
  || u.indexOf("blackberry") != -1
  }
})(window.navigator.userAgent.toLowerCase());

// Load
window.onload = function () {
  // UA
  let userAgent = window.navigator.userAgent.toLowerCase();
  if(userAgent.indexOf('msie') != -1 || userAgent.indexOf('trident') != -1) {
    document.body.classList.add('msie');
  } else if(userAgent.indexOf('edge') != -1) {
    document.body.classList.add('edge');
  } else if(userAgent.indexOf('chrome') != -1) {
    document.body.classList.add('chrome');
  } else if(userAgent.indexOf('safari') != -1) {
    document.body.classList.add('safari');
  } else if(userAgent.indexOf('firefox') != -1) {
    document.body.classList.add('firefox');
  } else if(userAgent.indexOf('opera') != -1) {
    document.body.classList.add('opera');
  }

  //  SVG
  var desvg = function(selector, removeInlineCss) {
      removeInlineCss = removeInlineCss || false;

      var images,
          imagesLength,
          sortImages = {},

          // load svg file
          loadSvg = function (imgURL, replaceImages) {
              // set up the AJAX request
              var xhr = new XMLHttpRequest();
              xhr.open('GET', imgURL, true);

              xhr.onload = function() {
                  var xml,
                      svg,
                      paths,
                      replaceImagesLength;

                  // get the response in XML format
                  xml = xhr.responseXML;
                  replaceImagesLength = replaceImages.length;

                  // bail if no XML
                  if (!xml) {
                      return;
                  }

                  // this will be the <svg />
                  svg = xml.documentElement;

                  // get all the SVG paths
                  paths = svg.querySelectorAll('path');

                  if (removeInlineCss) {
                      // if `removeInlineCss` is true then remove the style attributes from the SVG paths
                      for (var i = 0; i < paths.length; i++) {
                          paths[i].removeAttribute('style');
                      }
                  }
                  svg.removeAttribute('xmlns:a');

                  while(replaceImagesLength--) {
                      replaceImgWithSvg(replaceImages[replaceImagesLength], svg.cloneNode(true));
                  }
              };

              xhr.send();
          },

          // replace the original <img /> with the new <svg />
          replaceImgWithSvg = function (img, svg) {
              var imgID = img.id,
                  imgClasses = img.getAttribute('class');

              if (imgID) {
                  // re-assign the ID attribute from the <img />
                  svg.id = imgID;
              }

              if (imgClasses) {
                  // re-assign the class attribute from the <img />
                  svg.setAttribute('class', imgClasses + ' replaced-svg');
              }

              img.parentNode.replaceChild(svg, img);
          };



      // grab all the elements from the document matching the passed in selector
      images = document.querySelectorAll(selector);
      imagesLength = images.length;

      // sort images array by image url
      while (imagesLength--) {
          var _img = images[imagesLength],
            _imgURL;

          if (_img.getAttribute('data-src')) {
            _imgURL = _img.getAttribute('data-src')
          } else {
            _imgURL = _img.getAttribute('src')
          }

          if (sortImages[_imgURL]) {
              sortImages[_imgURL].push(_img);
          } else {
              sortImages[_imgURL] = [_img];
          }
      }

      // loops over the matched urls
      for (var key in sortImages) {
          if (sortImages.hasOwnProperty(key)) {
              loadSvg(key, sortImages[key]);
          }
      }

  };

  window.deSVG = desvg;
  deSVG('.svg_img', true);
}
