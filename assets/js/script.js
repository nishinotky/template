// settings
const findProperty = function obj() {
  const el = document.createElement('div')

  for (let key in obj) {
    if (obj.hasOwnProperty(key) && el.style[key] !== undefined) {
      return obj[key]
    }
  }
}

window.transitionEnd = findProperty({
  transition: 'transitionend',
  MozTransition: 'transitionend',
  WebkitTransition: 'webkitTransitionEnd'
})

window.animationEnd = findProperty({
  animation: 'animationend',
  MozAnimation: 'mozAnimationEnd',
  WebkitAnimation: 'webkitAnimationEnd'
})

$(document).ready(function ($) {

  function after_load() {
    $('#site_loader_spinner').delay(300).fadeOut(600);
    $('#site_loader_overlay').delay(600).fadeOut(900);
    $('#site_wrap').css('display', 'block');
  }

  $(window).load(function () {
    after_load();
  });

  $(function () {
    setTimeout(function () {
      if( $('#site_loader_overlay').is(':visible') ) {
        after_load();
      }
    }, 10000);
  });
});

// Smooth Scroll
const smoothScrollTrigger = document.querySelectorAll('a[href^="#"]');
for (let i = 0; i < smoothScrollTrigger.length; i++){
  smoothScrollTrigger[i].addEventListener('click', function (e) {
    e.preventDefault();
    let href = smoothScrollTrigger[i].getAttribute('href');
      let targetElement = document.getElementById(href.replace('#', ''));
    const rect = targetElement.getBoundingClientRect().top;
    const offset = window.pageYOffset;
    // let gap;
    // if (window.matchMedia('(max-width: 767px)').matches) {
    //   gap = 70;
    // } else if (window.matchMedia('(min-width:768px)').matches) {
    //   gap = 50;
    // }
    // const target = rect + offset - gap;
    const target = rect + offset;
    window.scrollTo({
      top: target,
      behavior: 'smooth',
    });
  });
}
