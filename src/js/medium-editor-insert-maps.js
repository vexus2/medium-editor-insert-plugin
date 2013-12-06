/*! 
 * medium-editor-insert-plugin v0.1.1 - jQuery insert plugin for MediumEditor
 *
 * Maps Addon
 *
 * https://github.com/orthes/medium-editor-images-plugin
 * 
 * Copyright (c) 2013 Pavel Linkesch (http://linkesch.sk)
 * Released under the MIT license
 */

(function ($) {
    
  $.fn.mediumInsert.maps = {
    
    /**
    * Maps initial function
    * @return {void}
    */
      
    init: function () {
      this.$el = $.fn.mediumInsert.insert.$el;
      this.geocoder = new google.maps.Geocoder();
    },
    
    /**
    * Set map center according to geocoder results
    * @pamra {instance} map Instance of google.maps.Map
    * @param {array} results GeocoderResult https://developers.google.com/maps/documentation/javascript/reference#GeocoderResult
    * @param {instance} status GeocoderStatus https://developers.google.com/maps/documentation/javascript/reference#GeocoderStatus
    * @return {void}
    */
      
    setMapCenterForGeocoderResults: function(map, results, status) {
      var $mapEl = $(map.getDiv()),
          location = results[0].geometry.location;
          
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(location);
        $mapEl.attr('data-lat', location.lat())
          .attr('data-lng', location.lng());
      }
    },
    
    /**
    * Set map events
    * @param {instace} map Instance of google.maps.Map
    * @return {void}
    */
    
    setEvents: function (map) {
      var that = this,
          $mapEl = $(map.getDiv()),
          $placeholder = $mapEl.parents('.mediumInsert-maps');
      
      var getGeocoderResult = function(results, status) {
        that.setMapCenterForGeocoderResults(map, results, status);
      };
      
      
      $placeholder.on('click', '.mediumInsert-maps-search button', function () {
        var address = $('.mediumInsert-maps-search input', $placeholder).val();
        that.geocoder.geocode({ 'address': address }, getGeocoderResult);
      });
      
      $placeholder.on('keyup', '.mediumInsert-maps-search input', function (e) {
        if (e.keyCode === 13) {
          $(this).siblings('button').click();
        }
      });
    },
    
    /**
    * Map initialization
    * @param {element} $mapEl Element containing the map
    * @return {instance} map Instance of google.maps.Map
    */
    
    mapInit: function ($mapEl) {
      var lat = $mapEl.data('lat'),
          lng = $mapEl.data('lng'),
          mapOptions = {
            center: new google.maps.LatLng(lat, lng),
            zoom: 2,
            scrollwheel: false,
            //draggable: false, 
          },
          map = new google.maps.Map($mapEl.get(0), mapOptions);

      this.setEvents(map);
      
      return map;
    },
      
    /**
    * Add map to placeholder
    * @param {element} $placeholder Placeholder to add map to
    * @return {void}
    */
    
    add: function ($placeholder) {
      var $mapEl;
      
      $.fn.mediumInsert.insert.deselect();
      
      $placeholder.append('<div class="mediumInsert-maps">'+
        '<div class="mediumInsert-maps-search">'+
          '<input type="text" placeholder="Find on the map"><button>Find</button>'+
        '</div>'+
        '<div class="mediumInsert-map"></div>'+
        '</div>');
        
      $mapEl = $('.mediumInsert-map', $placeholder)
        .attr('data-lat', 40)
        .attr('data-lng', 0);
      
      this.mapInit($mapEl);
    }
    
  };
  
}(jQuery));