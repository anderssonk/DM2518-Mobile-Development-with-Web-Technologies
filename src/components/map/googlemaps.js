import React, { useState, Fragment } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

const GoogleMaps = () => {
  const [mapRef, setMapRef] = useState(null); //to save a reference to the map

  const loadHandler = (map) => {
    console.log("map", map);
    setMapRef(map);
    console.log("mapRef", mapRef);
  };

  //locations
  var kth_location = { lat: 59.347008, lng: 18.072181 };
  var center_location = { lat: 59.314044, lng: 18.071609 };

  const [yourLocation, setYourLocation] = useState(); //used for setting your local position
  console.log("yourLocation:", yourLocation);

  const [selectedLocation, setSelectedLocation] = useState(null); //used for displaying info for InfoWindow

  const [markerPosition, setMarkerPosition] = useState(); //the markers position, is set when user drags or clicks the map when addingMarker is true.
  console.log("markerPosition:", markerPosition);

  const [addingMarker, setAddingMarker] = useState(false); //boolean, is true when marker is in progress of being added, otherwise false.
  // console.log("addingMarker:", addingMarker);

  function yourPosition() {
    //sends your position to addPosition function that sets it as hook state
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => addPosition(position),
        showError
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }

    //Error handling for yourPosition function
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
        default: //do nothing
      }
    }
  }

  const addPosition = (position) => {
    //position: object with position data from yourPosition() function callback.
    var newCoordinates = {};

    newCoordinates = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    console.log("addPosition:", newCoordinates);
    setYourLocation(newCoordinates);
  };

  const updateMarkerLocation = (ev) => {
    //updates markerPosition with event triggered from click on <GoogleMap>.
    const location = ev.latLng;
    const newCoordinates = {
      lat: location.lat(),
      lng: location.lng(),
    };
    setMarkerPosition(newCoordinates);
  };

  return (
    <Fragment>
      <LoadScript
        id="script-loader"
        googleMapsApiKey="AIzaSyC2yBzA3XpDwN9ZRcpwxGwcFfw1xH0SGxQ"
      >
        <GoogleMap
          onload={loadHandler}
          id="googleMap"
          mapContainerStyle={{
            //map needs to have a width and a height to display anything
            height: "90vh",
            width: "100wh",
          }}
          zoom={14}
          center={mapRef ? mapRef.getCenter() : yourLocation} //TODO needs to fix getCenter() function
          onClick={(ev) => {
            if (addingMarker) {
              console.log("onClick Map Event: addingMarker");
              setSelectedLocation(null);
              updateMarkerLocation(ev);
            }
          }}
        >
          {/* Generates markers from markerPosition */}
          {(markerPosition || yourLocation) && (
            <Marker
              position={markerPosition ? markerPosition : yourLocation} //sets marker position as yourLocation if no marker has been set on the map already.
              onClick={() => {
                //triggered when click on marker, used for
                setSelectedLocation({
                  lat: markerPosition.lat,
                  lng: markerPosition.lng,
                });
              }}
              onDragEnd={(ev) => {
                //updateMarkerLocation when marker has been dragged.
                console.log("marker Drag End");

                updateMarkerLocation(ev);
              }}
              draggable={addingMarker ? true : false}
              animation={addingMarker ? 1 : 2} //1 = BOUNCE, 2=DROP
              icon={
                //changes icon if marker is being added or not.
                addingMarker
                  ? {
                      url:
                        "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                    }
                  : { url: "http://maps.google.com/mapfiles/ms/micons/bar.png" }
              }
            />
          )}
          {selectedLocation && ( //to update info on marker
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
      <Fragment>
        <button
          onClick={() => {
            setAddingMarker(!addingMarker); //sets addingMarker to opposite boolean when clicked, also runs yourPosition() which sets yourLocation
            yourPosition();
          }}
        >
          {addingMarker ? "Confirm location" : "Add Bar Location"}
        </button>
        {/* <button onClick={yourPosition}>adddd</button> */}
      </Fragment>
    </Fragment>
  );
};

export default GoogleMaps;
