$(document).keyup(function(e) {
    console.log(e.keyCode);
    var kc = e.keyCode;

    switch(kc) {
    case 67:    // "c" as in [C]age AHRS
    case 97:    // "1"
        fetch("http://192.168.10.1/cageAHRS", {method: 'POST', mode: 'no-cors'}).then(console.log("POSTed http://192.168.10.1/cageAHRS"));
        break;
    case 65:    // "a" as in calibrate [A]HRS
    case 98:    // "2"
        fetch("http://192.168.10.1/calibrateAHRS", {method: 'POST', mode: 'no-cors'}).then(console.log("POSTed http://192.168.10.1/calibrateAHRS"));
        break;
    case 83:    // "s" as in re[S]tart
    case 99:    // "3"
        fetch("http://192.168.10.1/restart", {method: 'POST', mode: 'no-cors'}).then(console.log("POSTed http://192.168.10.1/restart"));
        break;
    case 71:    // "g" as in reset [G]meter
    case 100:   // "4"
        fetch("http://192.168.10.1/resetGMeter", {method: 'POST', mode: 'no-cors'}).then(console.log("POSTed http://192.168.10.1/resetGMeter"));
        break;
    case 66:    // "b" as in re[B]oot"
    case 101:   // "5"
        fetch("http://192.168.10.1/reboot",  {method: 'POST', mode: 'no-cors'}).then(console.log("POSTed http://192.168.10.1/reboot"));
        break;
    case 75:    // "k" as in [K]ill stratux
    case 102:   // "7"
        fetch("http://192.168.10.1/shutdown", {method: 'POST', mode: 'no-cors'}).then(console.log("POSTed http://192.168.10.1/shutdown"));
        break;
    case 76:    // "l" as in re[L]oad
    case 96:    // "0"
        location.reload();
        break;
    case 84:    // "t" as in [T]raffic  
    case 105:   // "9" - toggle traffic image
        showTraffic = !showTraffic;
        if (showTraffic) {   
            trafficList.css('visibility', 'visible');  
        }
        else {
            for (x = 0; x < 5; x++) {
                airplane[x].textContent = "";
                trafficList.css('visibility', 'hidden');
            }
        }
        break;
    }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//      JSON output returned by Stratux from a POST to http://192.168.10.1/getSituation (AHRS data)
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// {"GPSLastFixSinceMidnightUTC":0,"GPSLatitude":0,"GPSLongitude":0,"GPSFixQuality":0,"GPSHeightAboveEllipsoid":0,"GPSGeoidSep":0,
//  "GPSSatellites":0,"GPSSatellitesTracked":0,"GPSSatellitesSeen":2,"GPSHorizontalAccuracy":999999,"GPSNACp":0,"GPSAltitudeMSL":0,
//  "GPSVerticalAccuracy":999999,"GPSVerticalSpeed":0,"GPSLastFixLocalTime":"0001-01-01T00:00:00Z","GPSTrueCourse":0,"GPSTurnRate":0,
//  "GPSGroundSpeed":0,"GPSLastGroundTrackTime":"0001-01-01T00:00:00Z","GPSTime":"0001-01-01T00:00:00Z",
//  "GPSLastGPSTimeStratuxTime":"0001-01-01T00:00:00Z","GPSLastValidNMEAMessageTime":"0001-01-01T00:01:33.5Z",
//  "GPSLastValidNMEAMessage":"$PUBX,00,000122.90,0000.00000,N,00000.00000,E,0.000,NF,5303302,3750001,0.000,0.00,0.000,,99.99,99.99,99.99,0,0,0*20",
//  "GPSPositionSampleRate":0,"BaroTemperature":22.1,"BaroPressureAltitude":262.4665,"BaroVerticalSpeed":-0.6568238,
//  "BaroLastMeasurementTime":"0001-01-01T00:01:33.52Z","AHRSPitch":-1.7250436907060585,"AHRSRoll":1.086912223392926,
//  "AHRSGyroHeading":3276.7,"AHRSMagHeading":3276.7,"AHRSSlipSkid":-0.6697750324029778,"AHRSTurnRate":3276.7,
//  "AHRSGLoad":0.9825397416431592,"AHRSGLoadMin":0.9799488522426687,"AHRSGLoadMax":0.9828301105039375,
//  "AHRSLastAttitudeTime":"0001-01-01T00:01:33.55Z","AHRSStatus":6}
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// AHRS url
const urlAHRS = "http://192.168.10.1/getSituation";

// ADS-B traffic websocket url
const urlTraffic = "ws://192.168.10.1/traffic";
var showTraffic = false;
var speedtape = $('#speedtape');
var alttape = $('#alttape');
var headingtape = $('#headingtape');
var trafficList = $('#trafficList');
var attitude = $.flightIndicator('#attitude', 'attitude', {roll:50, pitch:-20, size:600, showBox : true});
var wsOpen = false;
var speed = 0;
var altitude = 0;
var heading = 0;
var gnumber = 0;

const spd_offset = 4.8;
const alt_offset = .4792;
const hdg_offset = 4.720;

var speedbox = document.getElementById('tspanSpeed');
var altitudebox = document.getElementById('tspanAltitude');
var headingbox = document.getElementById('tspanHeading');
var gbox = document.getElementById('tspanGMeter');

var airplane = [document.getElementById("tspanAirplane1"), 
                document.getElementById("tspanAirplane2"), 
                document.getElementById("tspanAirplane3"),
                document.getElementById("tspanAirplane4"),
                document.getElementById("tspanAirplane5")];

var rcvCount = 0;
var clrCount = 0;

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

////////////////////////////////////////////////////////////////////////////////////////
//
//                WEB SOCKET CONNECTION AND EVENT LISTENERS
//
////////////////////////////////////////////////////////////////////////////////////////
var trafficWebSocket;
var countCycle = 0;

if (window.WebSocket === undefined) {
    console.log("Websockets not supported!");
}
else {
    window.addEventListener("load", onLoad, false);
    for (x = 0; x < 5; x++) {
        airplane[x].textContent = "";
    }
}

function onLoad() {
    trafficWebSocket = new WebSocket(urlTraffic);
    trafficWebSocket.onopen = function(evt) { onOpen(evt) };
    trafficWebSocket.onclose = function(evt) { onClose(evt) };
    trafficWebSocket.onmessage = function(evt) { onMessage(evt) };
    trafficWebSocket.onerror = function(evt) { onError(evt) };
}
					
function onOpen(evt) {
    console.log("Websocket successfully connected to server!");
    wsOpen = true;
}
    
function onClose(evt) {
    console.log("Websocket CLOSED.");
    wsOpen = false;
}
        
function onMessage(evt) {
    var obj = JSON.parse(evt.data);
    var meters =  Number(obj.Distance.toFixed(1));
    var dist = Number(((meters * 3.28084) / 5280).toFixed(1));
    var brng = Number(Math.round(obj.Bearing.toFixed(0)));
    var reg = obj.Reg;
    var alt = Number(obj.Alt);
    var myAlt = Number(altitudebox.textContent);

    var tag = reg + "... Brg: " + brng + ".. Dist: " + dist + ".. Alt: " +  alt;

    if (clrCount < 100) {
        clrCount = clrCount + 1;
    }
    else if (clrCount >= 100)
    {
        clrCount = 0;
        for (x = 0; x < 5; x++) {
            airplane[x].textContent = "";
        }
    }

    if (rcvCount < 20) {
        rcvCount = rcvCount + 1;
    }
    else if (rcvCount >= 20) {
        console.log(tag);
        rcvCount = 0;

        if (dist <= 6) {
            if (alt < 10000) {
                if (brng > 0 ) {   
                    for (x = 0; x < 5; x++) {
                        if (airplane[x].textContent != tag) {
                            if (airplane[x].textContent.length == 0) {    
                                airplane[x].textContent = tag;
                            }
                        }
                    }
                }
            }
        }
    }
}

function sendKeepAlive(data) {
    var rs = trafficWebSocket.readyState;
    if (rs == 1) {
        trafficWebSocket.send(data);
    }
}

function onError(evt) {
    console.log("Websocket ERROR: " + evt.data);
}


/*-----------------------------------------------------------------------------------------    
                                 Traffic JSON sample 
-------------------------------------------------------------------------------------------
        {"Icao_addr":11316589,"Reg":"N916EV","Tail":"N916EV","Emitter_category":0,
        "OnGround":false,"Addr_type":0,"TargetType":0,"SignalLevel":-28.00244822746525,
        "Squawk":0,"Position_valid":false,"Lat":0,"Lng":0,"Alt":5550,"GnssDiffFromBaroAlt":0,
        "AltIsGNSS":false,"NIC":0,"NACp":0,"Track":0,"Speed":0,"Speed_valid":false,"Vvel":0,
        "Timestamp":"2019-03-12T13:32:30.563Z","PriorityStatus":0,"Age":18.2,"AgeLastAlt":1.83,
        "Last_seen":"0001-01-01T00:39:27.49Z","Last_alt":"0001-01-01T00:39:43.86Z",
        "Last_GnssDiff":"0001-01-01T00:00:00Z","Last_GnssDiffAlt":0,"Last_speed":"0001-01-01T00:00:00Z",
        "Last_source":1,"ExtrapolatedPosition":false,"BearingDist_valid":true,
        "Bearing":92.7782277589171,"Distance":9.616803034808295e+06}
--------------------------------------------------------------------------------------------*/

setInterval(function() {
     
    fetch(urlAHRS)
        .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
        
        var str = JSON.stringify(myJson)
        var obj = JSON.parse(str);

        // attitude pitch & roll
        attitude.setRoll(obj.AHRSRoll);
        attitude.setPitch(obj.AHRSPitch);
        
        // set the speed and altitude "box" values
        speed = Math.trunc(obj.GPSGroundSpeed);
        altitude = Math.trunc(obj.GPSAltitudeMSL);
        heading = Math.trunc(obj.GPSTrueCourse);
        gnumber = obj.AHRSGLoad.toFixed(1);
        speedbox.textContent = speed;
        altitudebox.textContent = altitude;
        headingbox.textContent = pad(heading, 3);
        gbox.textContent = gnumber;

        var speedticks = (speed * spd_offset);
        var altticks = (altitude * alt_offset);
        var hdgticks = (heading * hdg_offset) * -1;
        
        // set the coordinates of the tapes
        speedtape.css('transform', 'translateY(' + speedticks + 'px)');
        alttape.css('transform', 'translateY(' + altticks + 'px');
        headingtape.css('transform', 'translateX('+ hdgticks + 'px'); 
   });
    
    if (wsOpen) {
        // ping Stratux with some data (doesn't matter what, so just using UTC time)
        if (countCycle >= 80) {
            var data = new Date();
            countCycle = 0;
            sendKeepAlive(data.getTime());
            console.log("Sent Keep Alive, data = " + data.getTime());
        }
        countCycle ++;
    }

}, 50);