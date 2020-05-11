import React, { useState, Fragment } from "react";
import {
  useLoadScript,
  GoogleMap,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import customStyle from "./customStyles";

const GoogleMaps = ({user, firebaseSetup}) => {
  // Load the Google maps scripts
  const { isLoaded } = useLoadScript({
    //TODO import folder with key, and add to gitignore
    // Enter your own Google Maps API key
    googleMapsApiKey: "AIzaSyC2yBzA3XpDwN9ZRcpwxGwcFfw1xH0SGxQ",
  });

  const [mapRef, setMapRef] = useState(null); //A reference to the map instance
  const [zoom, setZoom] = useState(13);

  const [markerMap, setMarkerMap] = useState({}); //object with all marker locations will be used when loading in friends marker positions.

  //States
  const [selectedLocation, setSelectedLocation] = useState(null); //used for displaying info for InfoWindow
  const [yourLocation, setYourLocation] = useState(); //used for setting your local position
  const [markerPosition, setMarkerPosition] = useState(); //the markers position, is set when user drags or clicks the map when addingMarker is true.
  const [addingMarker, setAddingMarker] = useState(false); //boolean, is true when marker is in progress of being added, otherwise false.

  const [infoOpen, setInfoOpen] = useState(false);

  console.log("yourLocation", yourLocation);
  console.log("markerPosition", markerPosition);

  //Locations
  var kth_location = { lat: 59.347008, lng: 18.072181 };
  var center_location = { lat: 59.314044, lng: 18.071609 };

  const yourPosition = () => {
    //Function that ask permission for user location, and sets state yourLocation to that position.

    function success(position) {
      var newCoordinates = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      console.log("yourLocation added:", newCoordinates);

      // let userRef = firebaseSetup.db.collection('users').doc(user.uid);

      // let setLocation = userRef.set({
      //   location: newCoordinates
      // }, {merge: true});

      setYourLocation(newCoordinates);

      if (!markerPosition) {
        // To solve an error that occurs first time a marker is placed.
        setMarkerPosition(yourLocation);
      }
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
    if (navigator.geolocation) {
      // if user accepts to share location
      navigator.geolocation.getCurrentPosition(success, showError);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  const updateMarkerLocation = (ev) => {
    //updates markerPosition with event triggered from click on <GoogleMap>.
    const location = ev.latLng;
    const newCoordinates = {
      lat: location.lat(),
      lng: location.lng(),
    };
    setMarkerPosition(newCoordinates);

    let userRef = firebaseSetup.db.collection('users').doc(user.uid);

    let setLocation = userRef.set({
      location: newCoordinates
    }, {merge: true});
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
  const markerLoadHandler = (marker, place) => {
    // console.log("mark", marker);
    return setMarkerMap((prevState) => {
      return { ...prevState, ["place.id"]: marker };
    });
  };

  const markerClickHandler = (event, place) => {
    // Remember which place was clicked
    setSelectedLocation(place);

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
  const getInput = () => {
    var barInput = document.getElementById("barInput").value;
    var msgInput = document.getElementById("msgInput").value;
    return { barInput, msgInput };
  };
  const renderMap = () => {
    return (
      <Fragment>
        <GoogleMap
          onLoad={loadHandler} // Sets a reference to the map when loaded.
          onClick={(ev) => {
            if (addingMarker) {
              //If user is in placing marker
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
          options={{
            styles: customStyle,
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
              onClick={(event) => {
                //triggered when click on marker, used for
                markerClickHandler(event, markerPosition);
              }}
              onDragEnd={(ev) => {
                //updateMarkerLocation when marker has been dragged.
                console.log("marker Drag End");

                updateMarkerLocation(ev);
              }}
              onLoad={(marker) => markerLoadHandler(marker)}
              draggable={addingMarker ? true : false}
              animation={addingMarker ? 1 : 2} //1 = BOUNCE, 2=DROP
              icon={{
                url: addingMarker
                  ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                  : "http://maps.google.com/mapfiles/ms/micons/bar.png",

                fillOpacity: 1.0,
                strokeWeight: 0,
                scale: 1.25,
              }}
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

          {infoOpen &&
          selectedLocation && ( //to update info on marker
              <InfoWindow
                anchor={markerMap["place.id"]}
                position={{
                  lat: selectedLocation.lat,
                  lng: selectedLocation.lng,
                }}
                onCloseClick={() => {
                  setInfoOpen(false);
                }}
                pixelOffset={(0, 100)}
              >
                <div className="infoWindow">
                  <br />
                  <span className="infoWindowName">Name</span>
                  <br />
                  <span className="infoWindowLocation">Location</span>
                  <br />
                  <span className="infoWindowMsg">Msg</span>
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
        <input type="text" id="barInput" placeholder="Bar"></input>
        <input type="text" id="msgInput" placeholder="Message"></input>
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
