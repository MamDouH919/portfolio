$(document).ready(function () {
    let nav = $("#navbar_list"),
        icon = $("#icon");
    $(icon).click(function () {
        if (nav.className === "navbar_list") {
            $(nav).slideDown();
            nav.className += " responsive";
            $(icon).addClass(" close");
        } else {
            $(nav).slideUp();
            nav.className = "navbar_list"
            $(icon).removeClass("close");
        }
    });
    $(window).resize(function () {
        var width = $(window).width();
        if (width < 600) {
            $(nav).hide();
        }
        else {
            $(nav).show();
            $(icon).removeClass("close");
        }
    });





    var slideshowDuration = 4000;
    var slideshow = $('.slideshow_content .slideshow');

    function slideshowSwitch(slideshow, index, auto) {
        if (slideshow.data('wait')) return;

        var slides = slideshow.find('.slide');
        var pages = slideshow.find('.pagination_x');
        var activeSlide = slides.filter('.is-active');
        var activeSlideImage = activeSlide.find('.image-container');
        var newSlide = slides.eq(index);
        var newSlideImage = newSlide.find('.image-container');
        var newSlideContent = newSlide.find('.slide-content');
        var newSlideElements = newSlide.find('.caption > *');
        if (newSlide.is(activeSlide)) return;

        newSlide.addClass('is-new');
        var timeout = slideshow.data('timeout');
        clearTimeout(timeout);
        slideshow.data('wait', true);
        var transition = slideshow.attr('data-transition');
        if (transition == 'fade') {
            newSlide.css({
                display: 'block',
                zIndex: 2
            });
            newSlideImage.css({
                opacity: 0
            });

            TweenMax.to(newSlideImage, 1, {
                alpha: 1,
                onComplete: function () {
                    newSlide.addClass('is-active').removeClass('is-new');
                    activeSlide.removeClass('is-active');
                    newSlide.css({ display: '', zIndex: '' });
                    newSlideImage.css({ opacity: '' });
                    slideshow.find('.pagination_x').trigger('check');
                    slideshow.data('wait', false);
                    if (auto) {
                        timeout = setTimeout(function () {
                            slideshowNext(slideshow, false, true);
                        }, slideshowDuration);
                        slideshow.data('timeout', timeout);
                    }
                }
            });
        } else {
            if (newSlide.index() > activeSlide.index()) {
                var newSlideRight = 0;
                var newSlideLeft = 'auto';
                var newSlideImageRight = -slideshow.width() / 8;
                var newSlideImageLeft = 'auto';
                var newSlideImageToRight = 0;
                var newSlideImageToLeft = 'auto';
                var newSlideContentLeft = 'auto';
                var newSlideContentRight = 0;
                var activeSlideImageLeft = -slideshow.width() / 4;
            } else {
                var newSlideRight = '';
                var newSlideLeft = 0;
                var newSlideImageRight = 'auto';
                var newSlideImageLeft = -slideshow.width() / 8;
                var newSlideImageToRight = '';
                var newSlideImageToLeft = 0;
                var newSlideContentLeft = 0;
                var newSlideContentRight = 'auto';
                var activeSlideImageLeft = slideshow.width() / 4;
            }

            newSlide.css({
                display: 'block',
                width: 0,
                right: newSlideRight,
                left: newSlideLeft
                , zIndex: 2
            });

            newSlideImage.css({
                width: slideshow.width(),
                right: newSlideImageRight,
                left: newSlideImageLeft
            });

            newSlideContent.css({
                width: slideshow.width(),
                left: newSlideContentLeft,
                right: newSlideContentRight
            });

            activeSlideImage.css({
                left: 0
            });

            TweenMax.set(newSlideElements, { y: 20, force3D: true });
            TweenMax.to(activeSlideImage, 1, {
                left: activeSlideImageLeft,
                ease: Power3.easeInOut
            });

            TweenMax.to(newSlide, 1, {
                width: slideshow.width(),
                ease: Power3.easeInOut
            });

            TweenMax.to(newSlideImage, 1, {
                right: newSlideImageToRight,
                left: newSlideImageToLeft,
                ease: Power3.easeInOut
            });

            TweenMax.staggerFromTo(newSlideElements, 0.8, { alpha: 0, y: 60 }, { alpha: 1, y: 0, ease: Power3.easeOut, force3D: true, delay: 0.6 }, 0.1, function () {
                newSlide.addClass('is-active').removeClass('is-new');
                activeSlide.removeClass('is-active');
                newSlide.css({
                    display: '',
                    width: '',
                    left: '',
                    zIndex: ''
                });

                newSlideImage.css({
                    width: '',
                    right: '',
                    left: ''
                });

                newSlideContent.css({
                    width: '',
                    left: ''
                });

                newSlideElements.css({
                    opacity: '',
                    transform: ''
                });

                activeSlideImage.css({
                    left: ''
                });

                slideshow.find('.pagination_x').trigger('check');
                slideshow.data('wait', false);
                if (auto) {
                    timeout = setTimeout(function () {
                        slideshowNext(slideshow, false, true);
                    }, slideshowDuration);
                    slideshow.data('timeout', timeout);
                }
            });
        }
    }

    function slideshowNext(slideshow, previous, auto) {
        var slides = slideshow.find('.slide');
        var activeSlide = slides.filter('.is-active');
        var newSlide = null;
        if (previous) {
            newSlide = activeSlide.prev('.slide');
            if (newSlide.length === 0) {
                newSlide = slides.last();
            }
        } else {
            newSlide = activeSlide.next('.slide');
            if (newSlide.length == 0)
                newSlide = slides.filter('.slide').first();
        }

        slideshowSwitch(slideshow, newSlide.index(), auto);
    }

    function homeSlideshowParallax() {
        var scrollTop = $(window).scrollTop();
        if (scrollTop > windowHeight) return;
        var inner = slideshow.find('.slideshow-inner');
        var newHeight = windowHeight - (scrollTop / 2);
        var newTop = scrollTop * 0.8;

        inner.css({
            transform: 'translateY(' + newTop + 'px)', height: newHeight
        });
    }

    $('.slide').addClass('is-loaded');

    $('.slideshow .arrows .arrow').on('click', function () {
        slideshowNext($(this).closest('.slideshow'), $(this).hasClass('prev'));
    });

    $('.slideshow .pagination_x .itemx').on('click', function () {
        slideshowSwitch($(this).closest('.slideshow'), $(this).index());
    });

    $('.slideshow .pagination_x').on('check', function () {
        var slideshow = $(this).closest('.slideshow');
        var pages = $(this).find('.itemx');
        var index = slideshow.find('.slides .is-active').index();
        pages.removeClass('is-active');
        pages.eq(index).addClass('is-active');
    });

    /* Lazyloading
    $('.slideshow').each(function(){
      var slideshow=$(this);
      var images=slideshow.find('.image').not('.is-loaded');
      images.on('loaded',function(){
        var image=$(this);
        var slide=image.closest('.slide');
        slide.addClass('is-loaded');
      });
    */

    var timeout = setTimeout(function () {
        slideshowNext(slideshow, false, true);
    }, slideshowDuration);

    slideshow.data('timeout', timeout);

    if ($('.slideshow_content .slideshow').length > 1) {
        $(window).on('scroll', homeSlideshowParallax);
    }

    // open video
    videoContainer = $('.video_container')

    $('#toplay').click(function () {
        $(videoContainer).fadeIn();
        $(videoContainer).css({
            display: 'flex',
            height: '100%'
        });
        $('#video').get(0).play()

        $(window).click(function (event) {
            if (event.target.className == $(videoContainer).attr('class')) {
                $('#video').get(0).pause();
                $(videoContainer).fadeOut();
            }
        })

    });
    $('#close').click(function () {
        $('#video').get(0).pause();
        $(videoContainer).fadeOut();
    })

    //projects
    $('.owl-carousel').owlCarousel({
        loop: true,
        dots: false,
        margin: 15,
        items: 1,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        nav: true,
        navText: [
            '<i class="fa fa-chevron-left"></i>',
            '<i class="fa fa-chevron-right"></i>'
        ],
        responsive: {
            0: {
                items: 1,
                center: true,
            },
            768: {
                items: 2,
                center: true
            },
            1000: {
                items: 3
            }
        }
    })
    // var owl = $('.owl-carousel');
    // owl.owlCarousel({
    //     loop: true,
    //     nav: true,
    //     margin: 10,
    //     responsive: {
    //         0: {
    //             items: 1
    //         },
    //         600: {
    //             items: 3
    //         },
    //         960: {
    //             items: 5
    //         },
    //         1200: {
    //             items: 6
    //         }
    //     }
    // });
    // owl.on('mousewheel', '.owl-stage', function (e) {
    //     if (e.deltaY > 0) {
    //         owl.trigger('next.owl');
    //     } else {
    //         owl.trigger('prev.owl');
    //     }
    //     e.preventDefault();
    // });
    // var owl = $('.owl-carousel');
    // owl.owlCarousel({
    //     items: 1,
    //     loop: true,
    //     margin: 10,
    //     autoplay: true,
    //     autoplayTimeout: 1000,
    //     autoplayHoverPause: false
    // });
    // jQuery.event.special.touchstart = { setup: function (_, ns, handle) { if (ns.includes("noPreventDefault")) { this.addEventListener("touchstart", handle, { passive: false }); } else { this.addEventListener("touchstart", handle, { passive: true }); } } };
});