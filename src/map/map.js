import React, { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

const Map = () => {
  //locations
  var kth_location = { lat: 59.347008, lng: 18.072181 };
  // var hem_location = { lat: 59.312061, lng: 18.07448 };
  var center_location = { lat: 59.314044, lng: 18.071609 };

  const [selectedLocation, setSelectedLocation] = useState(null); //used for InfoWindow

  const [markerPosition, setMarkerPosition] = useState(); //the markers position

  const [addingMarker, setAddingMarker] = useState(false); //boolean, is true when marker is in progress of being added, otherwise false.
  console.log("addingMarker:", addingMarker);

  // const markerAnimation = () => {
  //   console.log(markerPosition);
  //   if (!markerPosition && addingMarker) {
  //     return 2;
  //   } else if (markerPosition && addingMarker) {
  //     return 1;
  //   } else {
  //     return null;
  //   }
  // };

  function yourPosition() {
    if (navigator.geolocation) {
      console.log(
        navigator.geolocation.getCurrentPosition(
          (position) => addPosition(position),
          showError
        )
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      return center_location;
    }

    //Error handling for getLocation function
    function showError(error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          console.log("User denied the request for Geolocation.");
          // x.innerHTML = "User denied the request for Geolocation."
          break;
        case error.POSITION_UNAVAILABLE:
          console.log("Location information is unavailable.");
          // x.innerHTML = "Location information is unavailable."
          break;
        case error.TIMEOUT:
          console.log("The request to get user location timed out.");
          // x.innerHTML = "The request to get user location timed out."
          break;
        case error.UNKNOWN_ERROR:
          console.log("An unknown error occurred.");
          // x.innerHTML = "An unknown error occurred."
          break;
      }
    }
  }

  const addPosition = (position) => {
    //position: object with position data,
    console.log("addPosition:", position);
    var newCoordinates = {};

    newCoordinates = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    // return newCoordinates;
  };

  const updateMarkerLocation = (ev) => {
    const location = ev.latLng;
    const newCoordinates = {
      lat: location.lat(),
      lng: location.lng(),
    };
    setMarkerPosition(newCoordinates);
  };

  return (
    <div>
      <LoadScript
        id="script-loader"
        googleMapsApiKey="AIzaSyC2yBzA3XpDwN9ZRcpwxGwcFfw1xH0SGxQ"
      >
        <GoogleMap
          id="googleMap"
          mapContainerStyle={{
            height: "90vh",
            width: "100wh",
          }}
          zoom={14}
          center={markerPosition ? center_location : center_location}
          onClick={(ev) => {
            if (addingMarker) {
              console.log("onClick Map Event: addingMarker");
              setSelectedLocation(null);
              updateMarkerLocation(ev);
            }
          }}
        >
          {/* Generates markers from markerPosition */}
          {markerPosition && (
            <Marker
              position={{ lat: markerPosition.lat, lng: markerPosition.lng }}
              onClick={() => {
                setSelectedLocation({
                  lat: markerPosition.lat,
                  lng: markerPosition.lng,
                });
              }}
              onDragEnd={(ev) => {
                console.log("marker Drag End");

                updateMarkerLocation(ev);
              }}
              draggable={addingMarker ? true : false}
              animation={addingMarker ? 1 : 2}
              icon={
                addingMarker
                  ? {
                      url:
                        "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                    }
                  : { url: "http://maps.google.com/mapfiles/ms/micons/bar.png" }
              }
            />
          )}
          {selectedLocation && (
            <InfoWindow
              position={{
                lat: selectedLocation.lat,
                lng: selectedLocation.lng,
              }}
              onCloseClick={() => {
                setSelectedLocation(null);
              }}
            >
              <div>heyyy</div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
      <div>
        <input id="bar" type="text" placeholder="What bar?.." />

        <button onClick={() => setAddingMarker(!addingMarker)}>
          {addingMarker ? "Confirm location" : "Add Bar Location"}
        </button>
        {/* <button onClick={console.log("gmap:", gmap.current)}>adddd</button> */}
      </div>
    </div>
  );
};

export default Map;
