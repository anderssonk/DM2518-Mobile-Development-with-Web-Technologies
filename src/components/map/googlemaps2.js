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
            height: "70vh",
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
                <br />
                <span className="infoWindowName">
                  {selectedLocation.id ? selectedLocation.id : "My position"}
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
        <button
          onClick={() => {
            yourPosition();

            setMarkerPosition(yourLocation);
          }}
        >
          My position
        </button>

        <button
          onClick={() => {
            setAddingMarker(!addingMarker);
            //sets addingMarker to opposite boolean when clicked
          }}
        >
          {addingMarker ? "Confirm location" : "Move Marker"}
        </button>

        <button
          onClick={() => {
            getDataFromDB();
          }}
        >
          Add your friends to map TEST
        </button>

        <input type="text" id="msgInput" placeholder="Message"></input>

        <button
          onClick={() => {
            writeMsgToDb();
          }}
        >
          write msg to db
        </button>
      </Fragment>
    );
  };

  return isLoaded ? renderMap() : null;
};
export default GoogleMaps;

//get friend info from friendlist in Firestore DB real-time
// userRef.onSnapshot((userSnap) => {
//   //IF SOME DATA CHANGED ON USER IN DB

//   if (userSnap.data().friendList.length !== friendsArray.length) {
//     //NEW ADDED FRIEND SCENARIO
//     var moreFriendsArray = []; //array to be merged with friendsArray

//     //TODO not specific enough but works for now (example, length can be same but maybe not consist the same names?)
//     //handle when friend is added to friendlist => add to friendArray so marker can be updated!
//     console.log(
//       "Database friendList differs in length from friendsArray length"
//     );
//     console.log("There has been a change in the database?");

//     userSnap.data().friendList.forEach((friendFind) => {
//       firebaseSetup.db
//         .collection("users")
//         .where("name", "==", friendFind) //a query that gets your friends in database and retrieves their data.
//         .get()
//         .then((doc) => {
//           doc.forEach((friend) => {
//             console.log("friend", friend.data());

//             function contains(arr, id) {
//               //returns true or false depending if id contains in array or not
//               var contains = arr.filter((obj) => obj.id === id).length >= 1;
//               return contains;
//             }

//             if (!contains(friendsArray, friend.data().name)) {
//               console.log("addToMoreFriendsArray");
//               var addObject = {};
//               addObject.id = friend.data().name;
//               addObject.position = friend.data().location;
//               addObject.message = friend.data().message;
//               moreFriendsArray.push(addObject);
//               console.log("morefriendsarray:", moreFriendsArray);
//             }
//           });
//           setFriendsArray((prevState) => [
//             ...prevState,
//             ...moreFriendsArray,
//           ]);
//           console.log("friendsArray 123123123", friendsArray);
//         });
//     });

//     console.log("friendsArray 123123123___>>", friendsArray);
//   } else {
//   }
// });

//         .collection("users")
//         .where("name", "==", friend)
//         .onSnapshot((snapshot) => {
// });

// else {
//   console.log("Same length should not be updated");
// }
// console.log("ddddata", userSnap.data());

// console.log("userSnap", userSnap.data().friendList);

//     .data().
//     friendList.

//     forEach((friend) => {
//       firebaseSetup.db
//         .collection("users")
//         .where("name", "==", friend)
//         .onSnapshot((snapshot) => {
//           let changes = snapshot.docChanges(); //adds a listener to the firestore db
//           var addArray = [];

//         changes.forEach((change) => {
//           if (change.type === "added") {
//             console.log("1.FriendsArray", friendsArray);
//             console.log("Added: ", change.doc.data());
//             var addObject = {};
//             addObject.id = change.doc.data().name;
//             addObject.position = change.doc.data().location;
//             addObject.message = change.doc.data().message;

//             addArray.push(addObject);

//             // console.log("1.ADDED FRIENDSARRAY", friendsArray);
//           }
//           if (change.type === "removed") {
//             console.log("Removed: ", change.doc.data());
//           }
//           if (change.type === "modified") {
//             console.log("Modified: ", change.doc.data());

//             // var findIndex = friendsArray.findIndex(
//             //   (friend) => friend.id === change.doc.data().id
//             // );

//             // setTheArray(prevState => [...prevState, {change.doc.data().id: change.doc.data()}]);

//             // var changedArray =  Object.assign(friendsArray, change.doc.data()
//             //if findIndex =-1 means no duplicate id

//             // if (findIndex !== -1) {
//             //   var noDoubleIdArray = friendsArray.filter(
//             //     (friends) => friends.id !== change.doc.data().id
//             //   );
//             //   noDoubleIdArray.push(change.doc.data());
//             //   return (addArray = noDoubleIdArray);
//             // }
//           }
//           console.log("friendsArrayINSIDE", friendsArray);
//         });
//         setFriendsArray((prevState) => [...prevState, ...addArray]);
//       });
//   });
// });
// }
