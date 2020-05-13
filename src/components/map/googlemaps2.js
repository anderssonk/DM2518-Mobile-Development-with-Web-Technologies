import React, { useState, Fragment, useEffect, useRef } from "react";
import {
  useLoadScript,
  GoogleMap,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import customStyle from "./customStyles";
import * as firebaseSetup from "../../firebase.setup";

const GoogleMaps = ({ user }) => {
  let userRef = firebaseSetup.db.collection("users").doc(user.uid); //reference to users file in firestore

  // Load the Google maps scripts
  const { isLoaded } = useLoadScript({
    //TODO import folder with key, and add to gitignore
    googleMapsApiKey: "AIzaSyC2yBzA3XpDwN9ZRcpwxGwcFfw1xH0SGxQ",
  });

  const refArray = useRef([]);
  const [friendsArray, setFriendsArray] = useState([]); //array used for retrieving data about friends from firestore
  console.log("friends array state:", friendsArray);

  //GoogleMap
  const [mapRef, setMapRef] = useState(null); //A reference to the map instance (used for API map specific function like (getCenter() etc..))
  const [zoom, setZoom] = useState(13); //Zoom setting on map

  //Markers
  //----for rendering on map
  const [markerMap, setMarkerMap] = useState({}); // all marker objects from friends.
  const [yourMarkerMap, setYourMarkerMap] = useState({}); //used for referencing your own marker.

  // console.log("yourMarkerMap", yourMarkerMap);
  //---for setting positions and editing
  const [addingMarker, setAddingMarker] = useState(false); //boolean, is true when marker is in progress of being added, otherwise false.
  const [markerPosition, setMarkerPosition] = useState(); //the markers position, is set when user drags or clicks the map when addingMarker is true.
  //console.log("markerPosition", markerPosition);

  //InfoWindow
  const [selectedLocation, setSelectedLocation] = useState(null); //used for displaying info for InfoWindow
  const [infoOpen, setInfoOpen] = useState(false);

  //MyInputMessage
  const [messageState, setMessageState] = useState("");

  //Your location
  const [yourLocation, setYourLocation] = useState(); //used for setting your local position
  //console.log("yourLocation", yourLocation);

  //Hard coded locations
  var kth_location = { lat: 59.347008, lng: 18.072181 };
  useEffect(() => {
    getDataFromDB(friendsArray);
  }, [refArray]);

  const yourPosition = () => {
    //Function that ask permission for user location, and sets state yourLocation to that position.

    function success(position) {
      var newCoordinates = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      console.log("yourLocation added:", newCoordinates);

      //Add location to Firestore DB
      userRef.set(
        {
          location: newCoordinates,
        },
        { merge: true }
      );

      setYourLocation(newCoordinates);
      setMarkerPosition(newCoordinates);
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
      console.log("accepted geo location");
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

    //Add location to Firestore DB
    userRef.set(
      {
        location: newCoordinates,
      },
      { merge: true }
    );
  };

  function getDataFromDB() {
    console.log("getDataBase f() Start");
    userRef.get().then((doc) => {
      doc.data().friendList.forEach((friend) => {
        firebaseSetup.db
          .collection("users")
          .where("name", "==", friend)
          .onSnapshot((snapshot) => {
            let changes = snapshot.docChanges(); //adds a listener to the firestore db
            // var addArray = [];

            changes.forEach((change) => {
              if (change.type === "added") {
                console.log("1. FriendsArray", friendsArray);
                console.log("2. Added: ", change.doc.data());
                var addObject = {};
                addObject.id = change.doc.data().name;
                addObject.position = change.doc.data().location;
                addObject.message = change.doc.data().message;

                // addArray.push(addObject);
                refArray.current.push(addObject);
                console.log("1.ADDED FRIENDSARRAY", friendsArray);
              }
              if (change.type === "removed") {
                console.log("Removed: ", change.doc.data());
              }

              if (change.type === "modified") {
                console.log("MODIFIED");
                console.log("refArray.current", refArray.current);

                var findIndex = refArray.current.findIndex(
                  (friend) => friend.id === change.doc.data().name
                );
                // console.log(
                //   "findIndex of:",
                //   change.doc.data().name,
                //   "  :  ",
                //   findIndex
                // );

                var updArray = refArray.current;

                console.log("updArray before", updArray);
                var addObject = {};
                addObject.id = change.doc.data().name;
                addObject.position = change.doc.data().location;
                addObject.message = change.doc.data().message;

                refArray.current[findIndex] = addObject;
                updArray[findIndex] = addObject;

                console.log("updArray after", updArray);

                setFriendsArray(updArray);
                console.log("friendsarrayLAST", friendsArray);
              }
            });

            console.log("refArray.current", refArray.current);

            // setFriendsArray((prevState) => [...prevState, ...refArray.current]);
            setFriendsArray([...refArray.current]);

            // if (addArray.length > 0) {
            // }
          });
      });
    });
    console.log("getDataFromDB END");
  }

  // getDataFromDB();

  const loadHandler = (map) => {
    // Store a reference to the google map instance in state
    setMapRef(map);
  };

  const friendMarkerLoadHandler = (marker, place) => {
    console.log("place", place);
    //  Create a mapping of our friends places(locations) to actual Marker objects
    return setMarkerMap((prevState) => {
      return { ...prevState, [place.id]: marker };
    });
  };
  const myMarkerLoadHandler = (marker) => {
    //  Create a mapping of your places(locations) to actual Marker objects
    return setYourMarkerMap(marker);
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
      setZoom(14);
    }

    // if you want to center the selected Marker
    // setCenter(place.pos)
  };
  const writeMsgToDb = () => {
    //Add message to Firestore
    var msgInput = document.getElementById("msgInput").value;

    setMessageState(msgInput);
    userRef.set(
      {
        message: msgInput,
      },
      { merge: true }
    );
  };
  const renderMap = () => {
    return (
      <Fragment>
        <GoogleMap
          onLoad={loadHandler} // Sets a reference to the map when loaded.
          onClick={(ev) => {
            setInfoOpen(false);

            if (addingMarker) {
              //If user is in "placing marker-action (the marker is green and jumping)"
              setSelectedLocation(null);
              updateMarkerLocation(ev);
            }
          }}
          center={mapRef ? mapRef.getCenter() : kth_location}
          zoom={zoom}
          mapContainerStyle={{
            height: "75vh",
            width: "100%",
          }}
          options={{
            styles: customStyle,
          }}
        >
          {/* Generates friends markers */}
          {friendsArray &&
            friendsArray.map((place) => (
              <Marker
                key={place.id}
                position={place.position}
                onLoad={(marker) => friendMarkerLoadHandler(marker, place)}
                onClick={(event) => markerClickHandler(event, place)}
                // Custom icon
                icon={{
                  path:
                    "M12.75 0l-2.25 2.25 2.25 2.25-5.25 6h-5.25l4.125 4.125-6.375 8.452v0.923h0.923l8.452-6.375 4.125 4.125v-5.25l6-5.25 2.25 2.25 2.25-2.25-11.25-11.25zM10.5 12.75l-1.5-1.5 5.25-5.25 1.5 1.5-5.25 5.25z",
                  fillColor: "#0000ff",
                  fillOpacity: 1.0,
                  strokeWeight: 0,
                  scale: 1,
                }}
              />
            ))}

          {/* Generates your marker from markerPosition */}
          {(markerPosition || yourLocation) && (
            <Marker
              position={markerPosition ? markerPosition : yourLocation} //sets marker position as yourLocation if no marker has been set on the map already.
              onClick={(event) => {
                //triggered when click on marker, used for
                markerClickHandler(event, markerPosition);
              }}
              onLoad={(marker) => myMarkerLoadHandler(marker)}
              onDragEnd={(ev) => {
                //updateMarkerLocation when marker has been dragged.
                console.log("marker Drag End");

                updateMarkerLocation(ev);
              }}
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

          {infoOpen && selectedLocation && (
            //to update info on marker
            <InfoWindow
              anchor={
                markerMap[selectedLocation.id]
                  ? markerMap[selectedLocation.id]
                  : yourMarkerMap
              }
              onCloseClick={() => {
                setInfoOpen(false);
              }}
            >
              <div className="infoWindow">
                <span className="infoWindowName">
                  <h1>
                    {selectedLocation.id ? selectedLocation.id : "My position"}
                  </h1>
                </span>
                <br />

                <span className="infoWindowMsg">
                  {selectedLocation.message
                    ? selectedLocation.message
                    : messageState}
                </span>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
        <div className="map-buttons">
          <button
            id="drink-btn"
            className="btn drink-btn pulse"
            onClick={() => {
              yourPosition();
              setMarkerPosition(yourLocation);
              const element = document.getElementById("drink-btn");
              element.classList.toggle("pulse");
              element.classList.toggle("active-state");
              element.childNodes[0].classList.toggle("fa-wine-glass");
              element.childNodes[0].classList.toggle("fa-wine-glass-alt");
            }}
          >
            <i class="fas fa-wine-glass"></i>
          </button>

          <div>
            <button
              className="btn"
              onClick={() => {
                setAddingMarker(!addingMarker);
                //sets addingMarker to opposite boolean when clicked
              }}
            >
              {addingMarker ? "Confirm location" : "Move Marker"}
            </button>

            <input type="text" id="msgInput" placeholder="Message"></input>

            <button
              className="btn map-btn"
              onClick={() => {
                writeMsgToDb();
              }}
            >
              <i class="zmdi zmdi-comment"></i>
            </button>
          </div>
        </div>
      </Fragment>
    );
  };

  return isLoaded ? renderMap() : null;
};
export default GoogleMaps;
