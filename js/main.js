var DEV_MODE = true;

$(function() {
    FastClick.attach(document.body);
});

$(document).ready(function(){
    // 1 - based on ipad, get list of addresses.
    // 2 - load current page with first in list
    //     a - construct slideshow divs from images array
    // 3 - when next-back, load new list and reset/cleanupr
    var locations;
    var currentLocation;
    var locCounter = 0;
    var isFirstLoad = true;
    var timer;
    var nextSceneTimer;
    var timerDuration = 3000;
    var isAutoplay = false;
    var autoplaySpeed = 5000;

    loadJSON();

    function loadJSON() { 
        // TODO: sanity check here
        var deviceId = (getDeviceID('id')) ?  parseInt(getDeviceID('id')) : 1;
        deviceId--;
        console.log("device id is " + deviceId);
        $.getJSON( "js/config.json", function( data ) {
            locations = data.devices[deviceId].locations;
            loadLocation();
            isFirstLoad = false;
            resetTimer();
        });
    }

    // start on last touch
    function resetTimer() {
        console.log("reset timer");

        clearTimeout(timer);
        clearTimeout(nextSceneTimer);

        timer = setTimeout(function(){
            startAutoplay();
        }, timerDuration );
    }

    function startAutoplay() {
        console.log("start autoplay");
        // fasde out elemnents
        // $('.main-nav').fadeTo("fast",.5);
        // $('.slick-dots').fadeTo("fast",.5); // Not working when scene changes
        // 
        // handle autoplay on last slide
        var autoplayStartSlide = $('.slides').slick('slickCurrentSlide');
        if (autoplayStartSlide == currentLocation.images.length-1 ) {
            goNext();
        }
        else {
            $('.slides').slick('slickPlay'); 
        }
        isAutoplay = true;
    }

    function stopAutoplay() {
        resetTimer();
        if (isAutoplay) {
            console.log("stop autoplay");
            $('.slides').slick('slickPause');
            isAutoplay = false;
        }
        // fade in ui
    }

    function loadLocation() {

        unloadSlick(isFirstLoad,function(){
            console.log("unloaded");
            currentLocation = locations[locCounter];
            console.log(currentLocation);
            var slides = [];
            $.each( currentLocation.images, function( key, val ) {
                var imgPath = currentLocation.path + val.url;
                var date    = val.month +"-"+ val.year;
                slides.push( '<div><img data-lazy=\"' + imgPath + '\" alt=\"'+date+'\"/></div>');
            });
            $('.address').text(currentLocation.address);
            $('.slides').append(slides);
            console.log("loading");
            loadSlick();
        });
    }

    $("#nav-left").click(function() {
        goPrev();
    });

    $("#nav-right").click(function() {
        goNext(); 
    });

    $(document).on('touchstart', function(){
        console.log("touch start");
        stopAutoplay();
    });

    function goPrev() {
        // if we are at the min, go to the last location
        console.log("loc counter was " + locCounter);    
        if (locCounter <= 0 ) 
            locCounter = locations.length-1;
        else 
            locCounter--;
        console.log("loc counter is now " + locCounter);    
        loadLocation();
    }

    function goNext() {
        // if we are at the max, go to first locations
        console.log("loc counter was " + locCounter);    
        if ( locCounter >= (locations.length - 1))
            locCounter = 0;
        else 
            locCounter++;
        
        console.log("loc counter is now " + locCounter);    
        loadLocation();
    }


    /*
    -- Slick -- 
    */ 

    function unloadSlick(isFirstLoad,cb){
        console.log("unloading");
        if (isFirstLoad) {
            cb();
            return;
        }

        $('.main-container').animate({ opacity: 0 }, 700, "linear", function() {
            $('.slides').unbind();           // need to unbind slick events
            $('.slides').slick('unslick');   // unload slick
            $('.slides').empty();            // empty slides
            cb();
        });
    }

    function loadSlick() {
        console.log("load slick");
        // On re-initialize
        $('.slides').on('init', function(event, slick, direction){
            console.log("init");
            $('.main-container').animate({ opacity: 1 },700,"linear",function(){
                if (isAutoplay) {
                    $('.slides').slick('slickPlay');
                    console.log("-- new scene --");
                }   
            });
        });

        // On swipe event
        $('.slides').on('swipe', function(event, slick, direction){
          console.log(direction);
          // left
        });

        // On edge hit
        $('.slides').on('edge', function(event, slick, direction){
          console.log('edge was hit')
        });

        // On before slide change
        $('.slides').on('beforeChange', function(event, slick, currentSlide, nextSlide){
        });

        $('.slides').on('afterChange', function(event, slick, currentSlide, nextSlide){
            if (!isAutoplay)
                return;
            // switch if we reach the end -- do i need to do a check in goNext to prevent
            // the call if autoplay is not longer on by the time someone interacts again?
            if (currentSlide == currentLocation.images.length-1) {
                $('.slides').slick('slickPause');
                nextSceneTimer = setTimeout(goNext,autoplaySpeed);
            }
            console.log("slide: " + currentSlide +"/"+ parseInt(currentLocation.images.length-1));
        });

        // Get the current slide        

        $('.slides').slick({
            dots: true,
            mobileFirst: true,
            // useCSS: true,
            // cssEase: 'linear',
            infinite: false,
            speed: 900,
            fade: true,
            autoplay: false,
            autoplaySpeed: autoplaySpeed,
            lazyLoad: 'progressive',
            arrows: false,
            customPaging: function(slick,index) {
                var image_title = slick.$slides.eq(index).find('img').attr('alt') || '';
                return '<span>' + image_title + '</span>';
            }
        });
    }

    function log(text){
        if (DEV_MODE) {
            console.log(arguments.callee.caller);
            console.log(text);
        }
    }
});

function getDeviceID() {
   var iPadID = "";
   try {
      iPadID = kioskpro_id.toString();
   }
   catch(e){
        return getUrlParameter("id");      
   }
   return iPadID;
}

function getUrlParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}          

            