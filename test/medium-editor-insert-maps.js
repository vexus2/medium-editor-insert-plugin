/**
* Maps
*/

module("maps", {
  setup: function() {
    $.fn.mediumInsert.settings.editor = new MediumEditor('.editable');
    $.fn.mediumInsert.maps.$el = $('#qunit-fixture');
  }
});


// add

test("add creates map", function () {
  var $el = $('#qunit-fixture').html('<div class="mediumInsert-placeholder"></div>'),
      $mapEl;

  $.fn.mediumInsert.maps.add($('.mediumInsert-placeholder', $el));
  $mapEl = $('.mediumInsert-map', $el);
  
  equal($mapEl.length, 1, 'map created');
  equal($mapEl.attr('data-lat') !== undefined, true, 'data-lat added to map');
  equal($mapEl.attr('data-lng') !== undefined, true, 'data-lng added to map');
});

asyncTest("add calls mapInit", function () {
  var $el = $('#qunit-fixture').html('<div class="mediumInsert-placeholder"></div>'),
      stub = this.stub($.fn.mediumInsert.maps, 'add', function () {
        ok(1, 'mapInit called');
        $.fn.mediumInsert.maps.add.restore();
        start();
      });

  $.fn.mediumInsert.maps.add($('.mediumInsert-placeholder', $el));
});


// mapInit

test("mapInit initializes a map", function () {
  var $el = $('#qunit-fixture').html('<div class="mediumInsert-map" data-lat="20" data-lng="30"></div>'),
      $mapEl = $('.mediumInsert-map', $el),
      map, center;
  
  map = $.fn.mediumInsert.maps.mapInit($mapEl);
  center = map.getCenter();

  equal(center.lat(), 20, 'map initialized, lat set');
  equal(center.lng(), 30, 'map initialized, lng set');
});

asyncTest('mapInit calls setEvents', function () {
  var $el = $('#qunit-fixture').html('<div class="mediumInsert-map" data-lat="20" data-lng="30"></div>'),
      $mapEl = $('.mediumInsert-map', $el), 
      stub = this.stub($.fn.mediumInsert.maps, 'setEvents', function () {
        ok(1, 'setEvents called');
        $.fn.mediumInsert.maps.setEvents.restore();
        start();
      });
  
  $.fn.mediumInsert.maps.mapInit($mapEl);  
});


// setEvents

asyncTest('setEvents creates click event on .mediumInsert-maps-search button', function () {
  var $el = $('#qunit-fixture').html('<div class="mediumInsert-maps">'+
        '<div class="mediumInsert-maps-search">'+
          '<input type="text" value="NYC"><button>Find</button>'+
        '</div>'+
        '<div class="mediumInsert-map" data-lat="20" data-lng="30"></div>'+
      '</div>'),
      $mapEl = $('.mediumInsert-map', $el), 
      map = new google.maps.Map($mapEl.get(0), {
        center: new google.maps.LatLng(0, 0),
        zoom: 2,
      }),
      stub, center;
      
  $.fn.mediumInsert.maps.geocoder = new google.maps.Geocoder();
  
  stub = this.stub($.fn.mediumInsert.maps.geocoder, 'geocode', function () {
    ok(1, 'geocoder called');
    $.fn.mediumInsert.maps.geocoder.geocode.restore();
    start();
  });

  $.fn.mediumInsert.maps.setEvents(map);

  $('.mediumInsert-maps-search button', $el).click();
  
  
  
  $.fn.mediumInsert.maps.setMapCenterForGeocoderResults(map, [{ geometry: { location: new google.maps.LatLng(50, 100) }}], google.maps.GeocoderStatus.OK); 
  center = map.getCenter();

  equal(center.lat(), 50, 'lat changed');
  equal(center.lng(), 100, 'lng changed'); 
  equal($mapEl.attr('data-lat'), 50, 'data-lat changed');
  equal($mapEl.attr('data-lng'), 100, 'data-lng changed');
});

asyncTest('setEvents creates keyup event on .mediumInsert-maps-search input', function () {
  var $el = $('#qunit-fixture').html('<div class="mediumInsert-maps">'+
        '<div class="mediumInsert-maps-search">'+
          '<input type="text" value="NYC"><button>Find</button>'+
        '</div>'+
        '<div class="mediumInsert-map" data-lat="20" data-lng="30"></div>'+
      '</div>'),
      $mapEl = $('.mediumInsert-map', $el), 
      map = new google.maps.Map($mapEl.get(0), {
        center: new google.maps.LatLng(0, 0),
        zoom: 2,
      }),
      $event;
      
  $.fn.mediumInsert.maps.setEvents(map);

  $(document).one('click', '.mediumInsert-maps-search button', function () {
    ok(1, 'enter on input called click event on button');
    start();
  });

  $event = $.Event("keyup");
  $event.keyCode = 13;
  $('.mediumInsert-maps-search input').trigger($event);
});