var data = {
  locations:[
    {
        title: "Choudhary Sweets", location: {lat: 30.483739, lng: 76.593220},
        display: true, selected: false,
    },
    {
      title: "Jamia Masjid", location: {lat: 30.483439, lng: 76.592608},
      display: true, selected: false,
    },
    {
      title: "Purbe Plaza", location: {lat: 30.483982, lng: 76.593965},
      display: true, selected: false,
    },
    {
      title: "Danik Bhaskar", location: {lat: 30.484116, lng: 76.593176},
      display: true, selected: false,
    },
    {
      title: "Punjab National Bank", location: {lat: 30.483613, lng: 76.592890},
      display: true, selected: false,
    },
    {
      title: "Airtel Banking Point", location: {lat: 30.483992, lng: 76.593003},
      display: true, selected: false,
    }
  ],
  styles: [
    {Night: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ]},
          {default: null}
  ]
};


var custom = undefined;
var map;
var markers = [];
var hidebutton = document.getElementById('hide-options-button');


//Shows Message if map doesn't load.
function mapError(){
  document.getElementById('map').innerHTML = "Something went wrong!!";
}


//Initialise the map
function initMap(){
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 30.483901, lng: 76.593370},
    zoom: 13,
    mapTypeControl: false,
    styles: data.styles[0].default
  });
  markerInfoWindow = new google.maps.InfoWindow();
  ko.applyBindings(new dataHandler());
};


//viewModel of the knockout-3
function dataHandler(){
  var that = this;

  // Changing style of the map on click of the map
  that.Name = ko.observable("Night Mode On");
  NightMode = function(){
    if(that.Name()==="Night Mode Off"){
      map.setOptions({styles: data.styles[0].default});
      that.Name("Night Mode On");
    }
    else {
      map.setOptions({styles: data.styles[0].Night});
      that.Name("Night Mode Off")
    }
  };

  // Hide/Show the side options bar
  that.hide = ko.observable(false);
  that.hText = ko.observable("Show Advanced Options");
  HideOptions = function() {
    if(that.hText() === "Show Advanced Options"){
      that.hText("Hide Advanced Options");
      that.hide(true);
    }
    else {
      that.hide(false);
      that.hText("Show Advanced Options");
    }
  }

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(hidebutton);

  var mapBounds = new google.maps.LatLngBounds();
  that.searchValue = ko.observable();

  for(var i = 0; i < data.locations.length; i++){
    var title = data.locations[i].title;
    var position = data.locations[i].location;
    var marker = new google.maps.Marker({
      map: map,
      name: title,
      position: position,
      animation: google.maps.Animation.DROP,
      display: ko.observable(data.locations[i].display),
      selected: ko.observable(data.locations[i].selected)
    });

    markers.push(marker);
    mapBounds.extend(marker.position);
    markers[markers.length - 1].setVisible(markers[markers.length - 1].display());
  }

  // Adding addlistener events to the markers
  for (var i = 0; i < markers.length; i++){
    (function(marker) {
      marker.addListener('click', function() {
        that.setSelected(marker);
      });
    })(markers[i]);
  };

  // Adding search function for the user
  that.search = function() {
    markerInfoWindow.close();
    var text = that.searchValue();
    if (text === '') {
      that.displayAll(true);
    }
    else {
      for (var i = 0; i < markers.length; i++) {
        if (markers[i].name.toLowerCase().indexOf(text.toLowerCase()) > -1) {
          markers[i].setVisible(true);
          markers[i].display(true);
        }
        else {
          markers[i].setVisible(false);
          markers[i].display(false);
        }
      }
    }
    markerInfoWindow.close();
  };


  // Adding a function to display all markers
  that.displayAll = function(show) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].display(show);
      markers[i].setVisible(show);
    }
  };


  // Adding a function to unselect all markers
  that.unselectAll = function() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].selected(false);
    }
  };

  that.setSelected = function(marker){
    that.unselectAll();
    marker.selected(true);
    that.presentMarker = marker;
    that.wikiStr = that.presentMarker.name;

    var wikiUrl1 = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='
                    + that.wikiStr + '&format=json&callback=wikiCallback';
    var wikiRequestTimeout = setTimeout(function(){
      markerInfoWindow.setContent("<h4>" + that.presentMarker.name + "</h4>" +
                                    "<p>Something went wrong</p>");
    },10000);

    $.ajax({
      url: wikiUrl1,
      dataType: "jsonp",
      success: function( response ) {
        var articleList = response[1];
        var url = 'http://en.wikipedia.org/wiki/' + articleList[0];
        if(articleList[0]===undefined){
          markerInfoWindow.setContent("<h4>" + that.presentMarker.name + "</h4>" +
                                        "<p>Article not found</p>");
        }
        else{
          markerInfoWindow.setContent("<h4>" + that.presentMarker.name + "</h4>" +
           "<div><li><a target='_blank' href='" + url + "'>" + articleList[0] +
           "</a></li><br></div>");
        }
        clearTimeout(wikiRequestTimeout);
      }
    });
    that.wikiStr = "";
    markerInfoWindow.open(map, marker);

    that.animatedMarker = function(marker) {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function() {
        marker.setAnimation(null);
      }, 680);
    };
    that.animatedMarker(marker);
  };

  map.fitBounds(mapBounds);

  //Function to search for area other than the markers
  that.searchArea = function() {
    // Initialize the geocoder.
    var geocoder = new google.maps.Geocoder();
    // Get the address or place that the user entered.
    var address = that.searchValue();
    // Make sure the address isn't blank.
    if (address == '') {
      window.alert('You must enter an area, or address.');
    }
    else {
      // Geocode the address/area entered to get the center. Then, center the map
      // on it and zoom in
      geocoder.geocode(
        { address: address,
        }, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            map.setZoom(13);
          } else {
            window.alert('We could not find that location - try entering a more' +
                ' specific place.');
          }
        });
    }
  };

  // This function will loop through the markers array and display them all.
  that.showListings = function() {
    that.searchValue();
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
      bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
  }
  // This function will loop through the listings and hide them all.
  that.hideListings = function() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  };

  // Handler for wikipedia articles
  that.wikiname = ko.observable();
  that.url = ko.observable();
  that.error= ko.observable();
  that.articles = function(){
    that.wikiname('');
    that.url('');
    var cityStr = that.searchValue();
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='
                    + cityStr + '&format=json&callback=wikiCallback';
    if(cityStr === undefined || cityStr === ""){
      alert("Please enter an area to search")
    }
    else{
      var wikiRequestTimeout = setTimeout(function(){
        that.error("failed to get wikipedia resources");
      },10000);

      $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        success: function( response ) {
          var articleList = response[1];
          var url = 'http://en.wikipedia.org/wiki/' + articleList[0];
          if(articleList[0]===undefined){
            that.error('Articles not found');
          }
          else{
            that.url(url);
            that.wikiname(articleList[0]);
          }
          clearTimeout(wikiRequestTimeout);
        }
      });
      return false;
    };
  }

}
