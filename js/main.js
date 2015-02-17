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
        });
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
        // if we are at the min, go to the last location
        console.log("loc counter was" + locCounter);    
        if (locCounter <= 0 ) 
            locCounter = locations.length-1;
        else 
            locCounter--;
        console.log("loc counter is now" + locCounter);    
        loadLocation();
    });

    $("#nav-right").click(function() {
        // if we are at the max, go to first locations
        console.log("loc counter was" + locCounter);    
        if ( locCounter >= (locations.length - 1))
            locCounter = 0;
        else 
            locCounter++;
        
        console.log("loc counter is now" + locCounter);    
        loadLocation();
    });


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
            console.log(event);
            console.log(nextSlide);
        });

        $('.slides').slick({
            dots: true,
            mobileFirst: true,
            infinite: false,
            speed: 700,
            fade: true,
            cssEase: 'ease-out',
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

            