function bannerAutoScroll(banner, slide_duration=3, options={}) {
    let autoslideID = makeid(6);
    let currentItem = options.current_slide ?? current_slide(banner);
    let carouselSlides = banner.children('.slide');
    let banner_counter;
    let timer = setInterval(() => {
        currentItem = nextSlide(current_slide(banner), carouselSlides.length);
        banner[0].scrollLeft = carouselSlides[currentItem].offsetLeft;
        if ('banner_counter' in options) banner_counter_update_direct(banner_counter, currentItem);
        // console.log('⏩ Slide ⏩ – autoSlideID#' + autoslideID);
    }, slide_duration*1000);
    if ('banner_counter' in options) {
        banner_counter = banner_counter_generate(banner, carouselSlides.length, currentItem, ((typeof options.banner_counter === 'object') ? options.banner_counter : {}), timer={timer: timer, gen: {banner, slide_duration, options}});
    }

    return timer;
}

function nextSlide(current, total) {
    // total = 6    // current = 5
    if (current === (total - 1)) return 0;
    return current + 1;
}

function prevSlide(current, total) {
    // total = 6    // current = 0
    if (current === 0) return (total - 1);
    return current - 1;
}

function current_slide(banner) {
    let current_slide;
    banner.children('.slide').each((index, slide) => {
        if ((banner[0].scrollLeft + (banner[0].clientWidth / 2)) > slide.offsetLeft) current_slide = index;
    });
    return current_slide;
}

function banner_counter_generate(banner, total, current, options={}, timer) {
    if ($('.slide_counter[data-banner_id="'+banner.attr('id')+'"]').length) $('.slide_counter[data-banner_id="'+banner.attr('id')+'"]').remove();
    let slide_counter = document.createElement('div');
    slide_counter.classList.add('slide_counter');
    slide_counter.setAttribute('data-banner_id', banner.attr('id'));

    if ('cls' in options) {
        let cls = options.cls.split(" ");
        cls.forEach(c => {
            (c === '') ? null : slide_counter.classList.add(c);
        });
    }

    for (let slides=0; slides < total; slides++) {
        let slide = document.createElement('div');
        slide.classList.add('slide');
        if (current === slides) slide.classList.add('current');
        slide.setAttribute('data-slide', (slides + 1));
        slide.setAttribute('data-total', total);
        slide.onclick = function() {
            clearInterval(timer.timer);
            timer.gen.options.current_slide = slides;
            bannerAutoScroll(timer.gen.banner, timer.gen.slide_duration, timer.gen.options);
            banner_counter_update_direct(slide_counter, (slides));
            banner[0].scrollLeft = banner.children('.slide')[(slides)].offsetLeft;
        }
        slide_counter.append(slide);
    } 

    banner.after(slide_counter);
    return slide_counter;
}

function banner_counter_update_direct(banner_counter, currentItem) {
    $(banner_counter).children().removeClass('current');
    $($(banner_counter).children('.slide')[currentItem]).addClass('current');
}