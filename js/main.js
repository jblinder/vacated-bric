/* jQuery Slider */

$( ".full-width-slider" ).bind( "change", fadeImage);

function fadeImage(event, ui) {
    var sliderValue = event.target.valueAsNumber;
    console.log(sliderValue);
}

$('.slides').slick({
    dots: true,
    infinite: true,
    speed: 500,
    fade: true,
    cssEase: 'linear',
    arrows: false,
    customPaging: function(slick,index) {
        var image_title = slick.$slides.eq(index).find('img').attr('alt') || '';
        return '<b> ' + image_title + '</b>';

        }
});
