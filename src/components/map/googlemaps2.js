import React, { useState, Fragment } from "react";
import {
  useLoadScript,
  GoogleMap,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

const GoogleMaps = () => {
  // The things we need to track in state

  const [mapRef, setMapRef] = useState(null); //A reference to the map instance
  //const [selectedPlace, setSelectedPlace] = useState(null); //Used for displaying marker info
  const [markerMap, setMarkerMap] = useState({});
  //const [center, setCenter] = useState(kth_location);
  const [zoom, setZoom] = useState(5);
  //   const [clickedLatLng, setClickedLatLng] = useState(null);
  const [infoOpen, setInfoOpen] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState(null); //used for displaying info for InfoWindow
  const [yourLocation, setYourLocation] = useState(); //used for setting your local position
  const [markerPosition, setMarkerPosition] = useState(); //the markers position, is set when user drags or clicks the map when addingMarker is true.
  const [addingMarker, setAddingMarker] = useState(false); //boolean, is true when marker is in progress of being added, otherwise false.

  //Locations
  var kth_location = { lat: 59.347008, lng: 18.072181 };
  var center_location = { lat: 59.314044, lng: 18.071609 };

  // Load the Google maps scripts
  const { isLoaded } = useLoadScript({
    // Enter your own Google Maps API key
    googleMapsApiKey: "AIzaSyC2yBzA3XpDwN9ZRcpwxGwcFfw1xH0SGxQ",
  });

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

  // The places I want to create markers for.
  // This could be a data-driven prop.

  //   const myPlaces = [
  //     { id: "kth", pos: { lat: 59.347008, lng: 18.072181 } },
  //     { id: "medis", pos: { lat: 59.314044, lng: 18.071609 } },
  //   ];

  // Iterate myPlaces to size, center, and zoom map to contain all markers
  //   const fitBounds = (map) => {
  //     const bounds = new window.google.maps.LatLngBounds();
  //     myPlaces.map((place) => {
  //       bounds.extend(place.pos);
  //       return place.id;
  //     });
  //     map.fitBounds(bounds);
  //   };

  const loadHandler = (map) => {
    console.log("map", map);
    // Store a reference to the google map instance in state
    setMapRef(map);
    // Fit map bounds to contain all markers
    // fitBounds(map);
  };

  //  Create a mapping of our places to actual Marker objects
  //   const markerLoadHandler = (marker, place) => {
  //     return setMarkerMap((prevState) => {
  //       return { ...prevState, [place.id]: marker };
  //     });
  //   };

  //   const markerClickHandler = (event, place) => {
  //     // Remember which place was clicked
  //     setSelectedPlace(place);

  //     // Required so clicking a 2nd marker works as expected
  //     if (infoOpen) {
  //       setInfoOpen(false);
  //     }

  //     setInfoOpen(true);

  //     // If you want to zoom in a little on marker click
  //     if (zoom < 13) {
  //       setZoom(13);
  //     }

  //     // if you want to center the selected Marker
  //     //setCenter(place.pos)
  //   };

  const renderMap = () => {
    return (
      <Fragment>
        <GoogleMap
          // Do stuff on map initial laod
          onLoad={loadHandler}
          // Save the current center position in state
          //onCenterChanged={() => setCenter(mapRef.getCenter().toJSON())}
          // Save the user's map click position
          onClick={(ev) => {
            {
              /* setClickedLatLng(ev.latLng.toJSON()); */
            }
            if (addingMarker) {
              setSelectedLocation(null);
              updateMarkerLocation(ev);
            }
          }}
          center={mapRef ? mapRef.getCenter() : kth_location}
          zoom={zoom}
          mapContainerStyle={{
            height: "70vh",
            width: "100%",
          }}
        >
          {/* {myPlaces.map((place) => (
            <Marker
              key={place.id}
              position={place.pos}
              onLoad={(marker) => markerLoadHandler(marker, place)}
              onClick={(event) => markerClickHandler(event, place)}
              // Custom icon
              icon={{
                path:
                  "M12.75 0l-2.25 2.25 2.25 2.25-5.25 6h-5.25l4.125 4.125-6.375 8.452v0.923h0.923l8.452-6.375 4.125 4.125v-5.25l6-5.25 2.25 2.25 2.25-2.25-11.25-11.25zM10.5 12.75l-1.5-1.5 5.25-5.25 1.5 1.5-5.25 5.25z",
                fillColor: "#0000ff",
                fillOpacity: 1.0,
                strokeWeight: 0,
                scale: 1.25,
              }}
            />
          ))} */}

          {/* Generates your marker from markerPosition */}
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

          {/* {infoOpen && selectedPlace && (
            <InfoWindow
              anchor={markerMap[selectedPlace.id]}
              onCloseClick={() => setInfoOpen(false)}
            >
              <div>
                <h3>{selectedPlace.id}</h3>
                <div>This is your info window content</div>
              </div>
            </InfoWindow>
          )} */}

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
              <div className="infoWindow">
                <span className="infoWindowName">Name</span>
                <span className="infoWindowLocation">Name</span>
                <span className="infoWindowMsg">Name</span>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
        <button
          onClick={() => {
            setAddingMarker(!addingMarker); //sets addingMarker to opposite boolean when clicked, also runs yourPosition() which sets yourLocation
            yourPosition();
          }}
        >
          {addingMarker ? "Confirm location" : "Add Bar Location"}
        </button>
        <input type="text" placeholder="bar"></input>
        {/* Position of the user's map click */}
        {/* {clickedLatLng && (
          <h3>
            You clicked: {clickedLatLng.lat}, {clickedLatLng.lng}
          </h3>
        )} */}

        {/* Position of the user's map click */}
        {/* {selectedPlace && <h3>Selected Marker: {selectedPlace.id}</h3>} */}
      </Fragment>
    );
  };

  return isLoaded ? renderMap() : null;
};
export default GoogleMaps;
