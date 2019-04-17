var $ = require("jquery");
global.jQuery = $;

import modernizr from 'modernizr';
import slick from 'slick-carousel';
import anime from 'animejs/lib/anime';

$(document).ready(function() {
  // CANVAS ASIDE RIGHT
  $(".js-nav-toggler--right").click(function(e) {
    e.preventDefault;
    $(".canvas").toggleClass("is-shifted shift-right");
  });
  $(".js-nav-close").click(function(e) {
    e.preventDefault;
    $(".canvas").removeClass("is-shifted shift-left shift-right");
  });

  // CAROUSEL WITH SLICK
  $(".gallery-news__carousel").slick({
    mobileFirst: true,
    slidesToShow: 1,
    dots: true,
    arrows: true,
    infinite: true,
    autoplay: false,
    speed: 1100,
    fade: true,
    rows: 0,
    prevArrow: $(".gallery-news__carousel .slick-prev-gallery"),
    nextArrow: $(".gallery-news__carousel .slick-next-gallery")
  });

  $('.milestone-carousel').slick({
    mobileFirst: true,
    infinite: true,
    arrows: true,
    dots: false,
    autoplay: false,
    speed: 1100,
    centerMode: true,
    slidesToShow: 3,
    slidesToScroll: 3,
    rows: 0,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 320,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  });

  $(".info-gallery__gallery").slick({
    mobileFirst: true,
    slidesToShow: 1,
    dots: false,
    arrows: true,
    infinite: true,
    autoplay: false,
    speed: 1100,
    fade: true,
    rows: 0
  });


//  anime({
//    targets: '.site-nav__logo',
//    translateX: 0,
//    rotate: '1turn',
//    duration: 1200
//  });
});
