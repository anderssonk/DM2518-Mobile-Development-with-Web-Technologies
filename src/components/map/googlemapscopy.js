import React, { useState, Fragment } from "react";

// We will use these things from the lib
// https://react-google-maps-api-docs.netlify.com/
import {
  useLoadScript,
  GoogleMap,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

function GoogleMaps() {
  // The things we need to track in state
  const [mapRef, setMapRef] = useState(null); //A reference to the map instance
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [markerMap, setMarkerMap] = useState({});
  const [center, setCenter] = useState({ lat: 44.076613, lng: -98.362239833 });
  const [zoom, setZoom] = useState(5);
  const [clickedLatLng, setClickedLatLng] = useState(null);
  const [infoOpen, setInfoOpen] = useState(false);

  // Load the Google maps scripts
  const { isLoaded } = useLoadScript({
    // Enter your own Google Maps API key
    googleMapsApiKey: "AIzaSyC2yBzA3XpDwN9ZRcpwxGwcFfw1xH0SGxQ",
  });
  var somePlace = { lat: 39.09366509575983, lng: -94.58751660204751 };
  // The places I want to create markers for.
  // This could be a data-driven prop.
  const myPlaces = [
    { id: "place1", pos: { lat: 39.09366509575983, lng: -94.58751660204751 } },
    { id: "place2", pos: { lat: 39.10894664788252, lng: -94.57926449532226 } },
    { id: "place3", pos: { lat: 39.07602397235644, lng: -94.5184089401211 } },
    { id: "kth", pos: { lat: 59.347008, lng: 18.072181 } },
    { id: "medis", pos: { lat: 59.314044, lng: 18.071609 } },
  ];

  // Iterate myPlaces to size, center, and zoom map to contain all markers
  const fitBounds = (map) => {
    const bounds = new window.google.maps.LatLngBounds();
    myPlaces.map((place) => {
      bounds.extend(place.pos);
      return place.id;
    });
    map.fitBounds(bounds);
  };

  const loadHandler = (map) => {
    console.log("map", map);
    // Store a reference to the google map instance in state
    setMapRef(map);
    // Fit map bounds to contain all markers
    fitBounds(map);
  };

  // We have to create a mapping of our places to actual Marker objects
  const markerLoadHandler = (marker, place) => {
    return setMarkerMap((prevState) => {
      return { ...prevState, [place.id]: marker };
    });
  };

  const markerClickHandler = (event, place) => {
    // Remember which place was clicked
    setSelectedPlace(place);

    // Required so clicking a 2nd marker works as expected
    if (infoOpen) {
      setInfoOpen(false);
    }

    setInfoOpen(true);

    // If you want to zoom in a little on marker click
    if (zoom < 13) {
      setZoom(13);
    }

    // if you want to center the selected Marker
    //setCenter(place.pos)
  };

  const renderMap = () => {
    return (
      <Fragment>
        <GoogleMap
          // Do stuff on map initial laod
          onLoad={loadHandler}
          // Save the current center position in state
          //onCenterChanged={() => setCenter(mapRef.getCenter().toJSON())}
          // Save the user's map click position
          onClick={(e) => setClickedLatLng(e.latLng.toJSON())}
          center={mapRef ? mapRef.getCenter() : somePlace}
          zoom={zoom}
          mapContainerStyle={{
            height: "70vh",
            width: "100%",
          }}
        >
          {myPlaces.map((place) => (
            <Marker
              key={place.id}
              position={place.pos}
              onLoad={(marker) => markerLoadHandler(marker, place)}
              onClick={(event) => markerClickHandler(event, place)}
              // Not required, but if you want a custom icon:
              icon={{
                path:
                  "M12.75 0l-2.25 2.25 2.25 2.25-5.25 6h-5.25l4.125 4.125-6.375 8.452v0.923h0.923l8.452-6.375 4.125 4.125v-5.25l6-5.25 2.25 2.25 2.25-2.25-11.25-11.25zM10.5 12.75l-1.5-1.5 5.25-5.25 1.5 1.5-5.25 5.25z",
                fillColor: "#0000ff",
                fillOpacity: 1.0,
                strokeWeight: 0,
                scale: 1.25,
              }}
            />
          ))}

          {infoOpen && selectedPlace && (
            <InfoWindow
              anchor={markerMap[selectedPlace.id]}
              onCloseClick={() => setInfoOpen(false)}
            >
              <div>
                <h3>{selectedPlace.id}</h3>
                <div>This is your info window content</div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>

        {/* Our center position always in state */}
        <h3>
          Center {center.lat}, {center.lng}
        </h3>

        {/* Position of the user's map click */}
        {clickedLatLng && (
          <h3>
            You clicked: {clickedLatLng.lat}, {clickedLatLng.lng}
          </h3>
        )}

        {/* Position of the user's map click */}
        {selectedPlace && <h3>Selected Marker: {selectedPlace.id}</h3>}
        <button
          onClick={() => {
            console.log("yo", mapRef.getCenter());
          }}
        >
          clicme
        </button>
      </Fragment>
    );
  };

  return isLoaded ? renderMap() : null;
}
export default GoogleMaps;
