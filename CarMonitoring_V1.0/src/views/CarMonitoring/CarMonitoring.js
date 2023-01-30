/*global google*/
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  SkeletonText,
} from "@chakra-ui/react";
import Alert from 'react-bootstrap/Alert';
import React, { Component, useEffect } from "react";
import axios from "axios";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
  InfoWindow,
  en,
} from "@react-google-maps/api";
import { useRef, useState } from "react";
import Geocode from "react-geocode";
import { decode, encode } from "@googlemaps/polyline-codec";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

Geocode.setApiKey("AIzaSyCAV1aQa73wNEK3u2DYil1s3EseuXVnjcI");
Geocode.enableDebug();

var polyline;
function App() {
  const [caraddress, setcaraddress] = useState("Loading ...");
  const [flag, setflag] = useState(0);
  const [getflag, setgetflag] = useState(0);
  const [center2, setcenter2] = useState({});
  const [center, setcenter] = useState({ lat: 12.9492, lng: 80.2547 });
  const [carDetails, setcarDetails] = useState([]);
  const [waypointsdata, setwaypointsdata] = useState([]);
  const [originValue, setoriginValue] = useState("");
  const [destinationValue, setdestinationValue] = useState("");
  const [locationStoredData, setlocationStoredData] = useState([]);
  const [focusFlag, setFocusFlag] = useState(false);
  const [isFollowing,setisFollowing] = useState(false);


  const [orgincenter, setorgincenter] = useState({
    lat: 12.9492,
    lng: 80.2547,
  });
  const [destinationcenter, setdestinationcenter] = useState({
    lat: 12.9492,
    lng: 80.2547,
  });

  useEffect(() => {
    if (flag == 0) {
      navigator.geolocation.getCurrentPosition(function (position) {
        console.log("Latitude is :", position.coords.latitude);
        console.log("Longitude is :", position.coords.longitude);
        setcenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setorgincenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setdestinationcenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });

      if (
        localStorage.getItem("orginValue") != "initial" &&
        localStorage.getItem("destinationValue") != "initial" &&
        localStorage.getItem("waypoints").length > 0
      ) {
        calculateRouteNewInitial();
      }

      getLocationData();
    }

     if (focusFlag) {

    	setTimeout(() => {
    		console.log("Teting ++++++++" + getflag)
     		getTopicData()
    		setgetflag(getflag + 1)

    	}, 5000)

    }
  }, [flag, getflag,focusFlag]);




  async function getLocationData() {
    const getStocksData = {
      url: "http://localhost:5000/location",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios(getStocksData)
      .then((response) => {
        //console.log(response.data.data);
        var locationArray = response.data.data.map((option,index)=>{
          return {value:option,label:'Route '+index}
        })
       
        console.log("Location Array : ",locationArray)



        setlocationStoredData(locationArray);
        
      })
      .catch(function (e) {
        console.log(e.message);
        if (e.message === "Network Error") {
          alert("No Internet Found. Please check your internet connection");
        } else {
          alert(
            "Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support."
          );
        }
      });
  }
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCAV1aQa73wNEK3u2DYil1s3EseuXVnjcI",
    libraries: ["places"],
  });
  

  function onDirectionLoad (directionRendererInstance){
    setDirectionInstance(directionRendererInstance);
  }

  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [directionInstance, setDirectionInstance] = useState(null);
  const [topic_name, settopic_name] = useState("");
  const [car_alert, setcar_alert] = useState(0);

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef();

  if (!isLoaded) {
    return <SkeletonText />;
  }

  function focusFunction() {
    setFocusFlag(!focusFlag)
    getTopicData()
  }

  

  async function getTopicData() {
    if (topic_name == "") {
      alert("Please Enter Topic Name");
    } else {
      const getStocksData = {
        url: "http://localhost:5000/publish",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          topic: topic_name,
        }),
      };
      axios(getStocksData)
        .then((response) => {
          // console.log("+++++++++++++++");
          // console.log(response.data);
          // console.log("+++++++++++++++");
          setcarDetails(response.data.data);
          try {
            if (response.data.data.speed >= response.data.threshold) {
              // alert("Correct" + response.data.data.speed)

              setcar_alert(1);
            } else {
              // alert("error" + response.data.data.speed)
              setcar_alert(0);
            }
          } catch {
            setcar_alert(0);

            // alert("catch" + response.data.data.speed)
          }

          let new_location = {
            lat: response.data.data.lat,
            lng: response.data.data.lon,
          };
          setcenter(new_location);
          setcenter2(new_location);

          var myPosition = new google.maps.LatLng(new_location.lat,new_location.lng)

          if(myPosition,polyline)
          {
            var isFollowing = google.maps.geometry.poly.isLocationOnEdge(myPosition,polyline,0.001) //0.00001
            setisFollowing(isFollowing)
          }
          
          console.log("Is the car following the route? ",isFollowing)
          
          //setting an alert if the car is not on the path
          //if(isFollowing===false)
          if(isFollowing===false)
          {
            /* setTimeout(() => {
              console.log("The car is not follwong the path")
              alert("The car is not following the path")
            }, 10000) */

            alert("The car is not following the path")
            console.log("The car is not following the path")
            
          }

          






          Geocode.fromLatLng(
            response.data.data.lat,
            response.data.data.lon
          ).then(
            (response) => {
              const address = response.results[0].formatted_address;

              console.log(address);
              setcaraddress(address);
            },
            (error) => {
              console.error(error);
            }
          );
        })
        .catch(function (e) {
          console.log(e.message);
          if (e.message === "Network Error") {
            alert("No Internet Found. Please check your internet connection");
          } else {
            alert(
              "Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support."
            );
          }
        });
    }
  }

  async function calculateRoute() {
    
    if (originRef.current.value === "" || destiantionRef.current.value === "") {
      alert("Please Enter Required Details!");
    }

    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
      waypoints: waypointsdata,
      provideRouteAlternatives: true,
    });

   

    setoriginValue(originRef.current.value);
    setdestinationValue(destiantionRef.current.value);
    console.log("results");
    console.log(results);
    console.log("results");

    localStorage.setItem("waypoints", JSON.stringify(results));
    localStorage.setItem("orginValue", originRef.current.value);
    localStorage.setItem("destinationValue", destiantionRef.current.value);

    setDirectionsResponse(results);

    // setflag(flag + 1);
    // setgetflag(getflag + 1);

    window.location.reload();
  }

  async function calculateRouteNewInitial() {
    
    // setoriginValue(localStorage.getItem("orginValue"))
    // setdestinationValue(localStorage.getItem("destinationValue"))
    // originRef = localStorage.getItem("orginValue")

    // setdestinationValue(localStorage.getItem("waypoints"))
    setDirectionsResponse(JSON.parse(localStorage.getItem("waypoints")));
    // setorgincenter(JSON.parse(localStorage.getItem("orginCenter")));
    // originRef.current = "VGP"
    setoriginValue(localStorage.getItem("originValue"));
    setdestinationValue(localStorage.getItem("destinationValue"));

    // setdestinationcenter(JSON.parse(localStorage.getItem("destinationCenter")));

    // console.log(JSON.localStorage.getItem("orginValue"))
    setflag(flag + 1);
    setgetflag(getflag + 1);
  }

  async function decodeLocationData(encoded) {
    let dec = decode(encoded, 5);
    let latitude = "";
    let longitude = [];
    let wayp = [];
    dec.map((data, i) => {
      if (i == 0) {
        Geocode.fromLatLng(dec[i][0], dec[i][1]).then(
          (response) => {
            const address4 = response.results[0].formatted_address;

            localStorage.setItem("address4", address4);
          },
          (error) => {
            console.error(error);
          }
        );
      } else if (i == 1) {
        Geocode.fromLatLng(dec[i][0], dec[i][1]).then(
          (response) => {
            const address5 = response.results[0].formatted_address;
            localStorage.setItem("address5", address5);
          },
          (error) => {
            console.error(error);
          }
        );
      } else {
        wayp.push({
          location: { lat: dec[i][0], lng: dec[i][1] },
        });
      }
    });
    console.log("sdkfjhdsf");
    console.log(localStorage.getItem("address4"));
    console.log(localStorage.getItem("address5"));
    console.log(wayp);
    console.log("sdkfjhdsf");
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: localStorage.getItem("address4"),
      destination: localStorage.getItem("address5"),
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
      waypoints: wayp,
      provideRouteAlternatives: true,
    });

    localStorage.setItem("waypoints", JSON.stringify(results));
    setDirectionsResponse(results);
    setflag(flag + 1);
    setgetflag(getflag + 1);
  }

  async function encodeLocationData() {
    var listOfCoordinates = []
    let response = directionInstance?.getDirections()
    //console.log("directions instance ",response)
    let legs = response?.routes[0].legs

    for(var i=0;i<legs.length;i++)
    {
      //console.log(legs.length)
      
      if(legs.length===1)
      {
        //console.log("Enter here is the leg is 1")
        var start_location = [legs[i]?.start_location.lat(),legs[i]?.start_location.lng()]
        var end_location = [legs[i]?.end_location.lat(),legs[i]?.end_location.lng()]
        listOfCoordinates.push(start_location,end_location)
      }
      else if(legs.length>1){
        //console.log("Enter here is the leg is > 1")
        var start_location = [legs[i]?.start_location.lat(),legs[i]?.start_location.lng()]
        listOfCoordinates.push(start_location)
        if(i===legs.length-1)
        {
          //console.log("Enter for the last leg")
          var end_location = [legs[i]?.end_location.lat(),legs[i]?.end_location.lng()]
          listOfCoordinates.push(end_location)
        }
      }
      
    }

    //console.log("List of coordinates ::",listOfCoordinates)

    let encoded2 = encode(listOfCoordinates, 5);
    console.log("Encoded 2 ",listOfCoordinates)






    Geocode.fromAddress(localStorage.getItem("orginValue")).then(
      (response) => {
        const address1 = response.results[0].geometry.location;

        Geocode.fromAddress(localStorage.getItem("destinationValue")).then(
          async (response) => {
            const address2 = response.results[0].geometry.location;

            let encryting_data = [
              [address1.lat, address1.lng],
              [address2.lat, address1.lng],
            ];

            let new_data = [];

            waypointsdata.map((data) => {
              let value = [data.location.lat, data.location.lng];
              new_data.push(value);
            });


            

            let encoded = encode(encryting_data.concat(new_data), 20);
            console.log("Encode data ",encryting_data.concat(new_data))

            const getStocksData = {
              url: "http://localhost:5000/location",
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              data: JSON.stringify({
                location: encoded2,
              }),
            };
            axios(getStocksData)
              .then((response) => {
                console.log(response.data);
              })
              .catch(function (e) {
                console.log(e.message);
                if (e.message === "Network Error") {
                  alert(
                    "No Internet Found. Please check your internet connection"
                  );
                } else {
                  alert(
                    "Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support."
                  );
                }
              });
          },
          (error) => {
            console.error(error);
          }
        );
        // setcaraddress(address);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  async function calculateRouteNew() {
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originValue,
      destination: destinationValue,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
      waypoints: waypointsdata,
      provideRouteAlternatives: true,
    });

    localStorage.setItem("waypoints", JSON.stringify(results));

    setDirectionsResponse(results);

    setflag(flag + 1);
    setgetflag(getflag + 1);
  }

  function clearRoute() {
    setDirectionsResponse(null);

    originRef.current.value = "";
    destiantionRef.current.value = "";
  }

  return (
    <Flex
      position="relative"
      flexDirection="column"
      alignItems="center"
      h="98vh"
      // w='100vw'
    >
      <Box position="absolute" left={0} top={0} h="100%" w="100%">
        {/* Google Map Box */}
        <GoogleMap
          center={center}
          zoom={18}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onClick={async (coord) => {
            if (
              originRef.current.value === "" ||
              destiantionRef.current.value === ""
            ) {
              const { latLng } = coord;
              const lat = latLng.lat();
              const lng = latLng.lng();

              let newwaypoint = waypointsdata;

              waypointsdata.push({
                location: { lat: lat, lng: lng },
              });

              const directionsService = new google.maps.DirectionsService();
              const results = await directionsService.route({
                origin: originValue,
                destination: destinationValue,
                // eslint-disable-next-line no-undef
                travelMode: google.maps.TravelMode.DRIVING,
                waypoints: newwaypoint,
                provideRouteAlternatives: true,
              });

              localStorage.setItem("waypoints", JSON.stringify(results));
              setDirectionsResponse(results);

              setflag(flag + 1);
              setgetflag(getflag + 1);
            } 
            
            else {
              const { latLng } = coord;
              const lat = latLng.lat();
              const lng = latLng.lng();

              let newwaypoint = waypointsdata;

              waypointsdata.push({
                location: { lat: lat, lng: lng },
              });

              const directionsService = new google.maps.DirectionsService();
              const results = await directionsService.route({
                origin: originRef.current.value,
                destination: destiantionRef.current.value,
                // eslint-disable-next-line no-undef
                travelMode: google.maps.TravelMode.DRIVING,
                waypoints: newwaypoint,
                provideRouteAlternatives: true,
              });

              localStorage.setItem("waypoints", JSON.stringify(results));

              setDirectionsResponse(results);

              setflag(flag + 1);
              setgetflag(getflag + 1);
            }
          }}
          onLoad={(map) => setMap(map)}
        >
          <Marker
            position={destinationcenter}
            draggable={true}
            icon={{
              url: require("./destination.png"),
              scaledSize: { width: 60, height: 60 },
            }}
            onDragEnd={(coord) => {
              const { latLng } = coord;
              const lat = latLng.lat();
              const lng = latLng.lng();

              setdestinationcenter({
                lat: lat,
                lng: lng,
              });

              localStorage.setItem(
                "destinationCenter",
                JSON.stringify({
                  lat: lat,
                  lng: lng,
                })
              );

              Geocode.fromLatLng(lat, lng).then(
                (response) => {
                  const address = response.results[0].formatted_address;
                  setoriginValue(address);

                  console.log(address);

                  localStorage.setItem("orginValue", address);
                },
                (error) => {
                  console.error(error);
                }
              );
            }}
            onDblClick={calculateRouteNew}
          />

          <Marker
            position={orgincenter}
            draggable={true}
            icon={{
              url: require("./orgin.png"),
              scaledSize: { width: 50, height: 60 },
            }}
            onDragEnd={(coord) => {
              const { latLng } = coord;
              const lat = latLng.lat();
              const lng = latLng.lng();

              setorgincenter({
                lat: lat,
                lng: lng,
              });

              localStorage.setItem(
                "orginCenter",
                JSON.stringify({
                  lat: lat,
                  lng: lng,
                })
              );

              Geocode.fromLatLng(lat, lng).then(
                (response) => {
                  const address = response.results[0].formatted_address;
                  setdestinationValue(address);
                  localStorage.setItem("destinationValue", address);
                },
                (error) => {
                  console.error(error);
                }
              );
            }}
          />

          <Marker
            position={center2}
            icon={{
              url: require(car_alert == 0 ? "./cargreen.png" : "./carred.png"),
              scaledSize: { width: 60, height: 60 },
            }}
          >
            <InfoWindow position={center2}>
              <div>
                <span>
                  {"Address: " +
                    caraddress +
                    ", Azimuth - " +
                    carDetails.azimuth +
                    ", DevId - " +
                    carDetails.devId +
                    ", Satelites - " +
                    carDetails.satelites +
                    ", SatelitesError - " +
                    carDetails.satelitesError +
                    ", SoftVersion" +
                    carDetails.softVersion +
                    ", Time - " +
                    carDetails.time +
                    ", Speed - " +
                    carDetails.speed}
                </span>
              </div>
            </InfoWindow>
          </Marker>

          {directionsResponse && (
            <DirectionsRenderer
              directions={directionsResponse}
              onLoad={onDirectionLoad}
              options={{
                draggable:true,
                polylineOptions: {
                  strokeOpacity: 12,
                  strokeColor: "#1641a6",
                  strokeWeight: 8,
                },
              }}
              onDirectionsChanged = {() => {
                if(directionInstance){
                  console.log("Entering directions instance")
                  let response =directionInstance?.getDirections();
                  if (polyline) {
                    // if polyline already exists, remove it from the map.
                    polyline.setMap(null)
                  }
  
                  if(response)
                  {
                     var path = google.maps.geometry.encoding.decodePath(response.routes[0].overview_polyline)
                     
    
                      polyline = new google.maps.Polyline(
                          {
                            path:path,
                            map : map
                          }
                        )
                  }
                  


                  
                  var listOfCoordinates = []
   
                  let legs = response?.routes[0].legs

                   for(var i=0;i<legs.length;i++){

                    if(legs.length===1){
                    //console.log("Enter here is the leg is 1")
                    var start_location = [legs[i]?.start_location.lat(),legs[i]?.start_location.lng()]
                    var end_location = [legs[i]?.end_location.lat(),legs[i]?.end_location.lng()]
                    listOfCoordinates.push(start_location,end_location)
                    
                    setoriginValue(legs[i]?.start_address)
                    setdestinationValue(legs[i]?.end_address)

                    
                    }

                     else if(legs.length>1){
                    //console.log("Enter here is the leg is > 1")
                     setoriginValue(legs[0]?.start_address)

                     var start_location = [legs[i]?.start_location.lat(),legs[i]?.start_location.lng()]
                     listOfCoordinates.push(start_location)

                     if(i===legs.length-1){
                    //console.log("Enter for the last leg")
                    var end_location = [legs[i]?.end_location.lat(),legs[i]?.end_location.lng()]
                    listOfCoordinates.push(end_location)
                    setdestinationValue(legs[i]?.end_address)
                  }

                }
              }
              var waypoints1 = []
              

              for(var i=1;i<((listOfCoordinates.length)-1);i++)
              {
                var waypoint = {location:{lat:listOfCoordinates[i][0],lng:listOfCoordinates[i][1]}}
                waypoints1.push(waypoint)
              }


                  //originValue
                  //destinationValue
                  //waypoints
                  console.log("response ",response.routes[0].legs[0].end_address)


                  localStorage.setItem("waypoints",JSON.stringify(response))
                  localStorage.setItem("originValue",response.routes[0].legs[0].start_address)
                  localStorage.setItem("destinationValue",response.routes[0].legs[0].end_address)
                  

                }
                else {
                  console.log("Getting directions response")

                  //var path = google.maps.geometry.encoding.decodePath(directionsResponse.routes[0].overview_polyline)
                     
                }

              }}
            />
          )}
        </GoogleMap>
      </Box>
      <Box
        p={2}
        borderRadius="lg"
        m={4}
        bgColor="#348feb"
        shadow="base"
        minW="container.md"
        zIndex="2"
        style={{ padding: 20, borderRadius: 20 }}
      >
        <HStack spacing={2} justifyContent="space-between">
          <Box flexGrow={1}>
            <Autocomplete>
              <Input
                style={{
                  padding: 10,
                  borderRadius: 8,
                  backgroundColor: "white",
                  color: "darkblue",
                  width: 400,
                }}
                type="text"
                placeholder="Origin"
                ref={originRef}
                value={originValue}
                onChange={(e) => {
                  setoriginValue(e.target.value);
                  setdestinationValue(destiantionRef.current.value);
                }}
              />
            </Autocomplete>
          </Box>
          <Box flexGrow={1}>
            <Autocomplete>
              <Input
                style={{
                  padding: 10,
                  borderRadius: 8,
                  backgroundColor: "white",
                  color: "darkblue",
                  width: 400,
                }}
                type="text"
                placeholder="Destination"
                ref={destiantionRef}
                value={destinationValue}
                onChange={(e) => {
                  setdestinationValue(e.target.value);
                  setoriginValue(originRef.current.value);
                  console.log(originRef.current);
                }}
              />
            </Autocomplete>
          </Box>
          <Button
            colorScheme="pink"
            type="submit"
            onClick={calculateRoute}
            style={{
              padding: 10,
              borderRadius: 8,
              backgroundColor: "green",
              color: "white",
              fontWeight: "bold",
            }}
          >
            SUBMIT
          </Button>
          <Box flexGrow={1}>
            <Input
              style={{
                padding: 10,
                borderRadius: 8,
                backgroundColor: "white",
                color: "darkblue",
                width: 200,
                fontWeight: "bold",
              }}
              type="text"
              placeholder="Topic Name"
              value={topic_name}
              onChange={(e) => settopic_name(e.target.value)}
            />
            <Button
              colorScheme="pink"
              type="submit"
              onClick={focusFunction}
              style={{
                padding: 10,
                borderRadius: 8,
                backgroundColor: "red",
                color: "white",
                fontWeight: "bold",
              }}
            >
              FOCUS
            </Button>
          </Box>

          <ButtonGroup>
            <Button
              colorScheme="pink"
              type="submit"
              onClick={async () => {
                let newwaypoint = waypointsdata;
                console.log("Waypoints list ",newwaypoint)
                newwaypoint.pop();
                const directionsService = new google.maps.DirectionsService();
                const results = await directionsService.route({
                  origin: originValue,
                  destination: destinationValue,
                  // eslint-disable-next-line no-undef
                  travelMode: google.maps.TravelMode.DRIVING,
                  waypoints: newwaypoint,
                  provideRouteAlternatives: true,
                });

                // console.log(originValue)
                // console.log(destinationValue)
                // console.log(results)

                setoriginValue(originRef.current.value);
                setdestinationValue(destiantionRef.current.value);

                localStorage.setItem("waypoints", JSON.stringify(results));
                localStorage.setItem("orginValue", originRef.current.value);
                localStorage.setItem(
                  "destinationValue",
                  destiantionRef.current.value
                );

                setDirectionsResponse(results);
              }}
              style={{
                padding: 10,
                borderRadius: 8,
                backgroundColor: "orange",
                color: "white",
                fontWeight: "bold",
              }}
            >
              W-DEL
            </Button>
            <Button
              colorScheme="pink"
              type="submit"
              onClick={() => {
                setcar_alert(0);
              }}
              style={{
                padding: 10,
                borderRadius: 8,
                backgroundColor: "darkblue",
                color: "white",
                fontWeight: "bold",
              }}
            >
              RESET
            </Button>
            <Button
              colorScheme="pink"
              type="submit"
              onClick={async () => {
                localStorage.setItem("waypoints", []);
                localStorage.setItem("orginValue", "initial");
                localStorage.setItem("destinationValue", "initial");
                localStorage.setItem("orginCenter", {});
                localStorage.setItem("destinationCenter", {});
                window.location.reload()
              }}
              style={{
                padding: 10,
                borderRadius: 8,
                backgroundColor: "red",
                color: "white",
                fontWeight: "bold",
              }}
            >
              CLEAR ALL
            </Button>
          </ButtonGroup>
        </HStack>

        <HStack spacing={3} justifyContent="flex-start">
          {locationStoredData.length > 0 ? (
            <Dropdown
              options={locationStoredData}
              onChange={(e) => {
                decodeLocationData(e.value);
              }}
              //  value={defaultOption}
              placeholder="SELECT LOCATION"
              style={{ borderRadius: 20 }}
            />
          ) : null}

          <Button
            colorScheme="pink"
            type="submit"
            onClick={() => {
              confirmAlert({
                title: "Save Location",
                message: "Are you sure to do this.",
                buttons: [
                  {
                    label: "Yes",
                    onClick: async () => {
                      encodeLocationData();
                    },
                  },
                  {
                    label: "No",
                    onClick: () => console.log("Click No"),
                  },
                ],
              });
            }}
            style={{
              padding: 10,
              borderRadius: 8,
              backgroundColor: "red",
              color: "white",
              fontWeight: "bold",
            }}
          >
            SAVE LOCATION
          </Button>
        </HStack>
      </Box>
    </Flex>
  );
}

export default App;
