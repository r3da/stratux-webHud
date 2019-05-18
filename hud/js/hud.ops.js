(function($) {
	function AttitudeIndicator( placeholder, options ) {
		var settings = $.extend({
			size : 600,	
			roll : 0,
			pitch : 0,
			showBox : true,
		}, options );

		var constants = {
			pitch_bound:90
		}

		placeholder.each(function(){
			$(this).html('<div class="instrument attitude"><div class="roll box"><img src="img/horizon_back.svg" class="box" alt="" /><div class="pitch box"><img src="img/horizon_ball.svg" class="box" alt="" /></div><img src="img/horizon_circle.svg" class="box" alt="" /></div><div class="mechanics box"><img src="img/horizon_airplane.svg" class="box" alt="" /></div></div>');
			_setRoll(settings.roll);
			_setPitch(settings.pitch);
			
			$(this).find('div.instrument').css({height : 500, width : 600}); 
			$(this).find('div.instrument img.box.background').toggle(settings.showBox);
		});

		function _setRoll(roll){
			placeholder.each(function(){
				$(this).find('div.instrument.attitude div.roll').css('transform', 'rotate('+roll+'deg)');
			});
		}

		function _setPitch(pitch){
			if(pitch>constants.pitch_bound){pitch = constants.pitch_bound;}
			else if(pitch<-constants.pitch_bound){pitch = -constants.pitch_bound;}
			placeholder.each(function(){
				$(this).find('div.instrument.attitude div.roll div.pitch').css('top', pitch*0.7 + '%');
			});
		}

		function _resize(size){
			placeholder.each(function(){
				$(this).find('div.instrument').css({height : size, width : size});
			});
		}

		function _showBox(){
			placeholder.each(function(){
				$(this).find('img.box.background').show();
			});
		}

		function _hideBox(){
			placeholder.each(function(){
				$(this).find('img.box.background').hide();
			});
		}

		this.setRoll = function(roll){_setRoll(roll);}
		this.setPitch = function(pitch){_setPitch(pitch);}
		this.resize = function(size){_resize(size);}
		this.showBox = function(){_showBox();}
		this.hideBox = function(){_hideBox();}

		return attitude;
	};

	$.attitudeIndicator = function(placeholder, options){
		var attitudeIndicator = new AttitudeIndicator($(placeholder), options)
		return attitudeIndicator;
	}

	$.fn.attitudeIndicator = function(options){
		return this.each(function(){
			$.attitudeIndicator(this, options);
		});
	}
}( jQuery ));

$(document).keyup(function(e) {
    console.log(e.keyCode);
    var kc = e.keyCode;

    switch(kc) {
    case 81: // "q" as in QWUAT IS THIS
        fetch("http://192.168.10.1/getSettings",{method: 'POST', mode: 'cors'}).then(function(response) {console.log(response.text)});
        break;
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
    case 87:    // "w" as in show proximity [W]arnings  
    case 105:   // "9" - toggle traffic image
        showWarning = !showWarning;
        setWarningBox();
        break;
    }
});

function setWarningBox() {
    var warningflag = $('#warningflag');
    showWarning == true ? warningflag.css('visibility','visible') : warningflag.css('visibility','hidden');
}
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
var showWarning = true;
var speedtape = $('#speedtape');
var alttape = $('#alttape');
var headingtape = $('#headingtape');
var ball = $('#ball');
var trafficWarning = $('#trafficWarning');
var attitude = $.attitudeIndicator('#attitude', 'attitude', {roll:50, pitch:-20, size:600, showBox : true});
var wsOpen = false;
var speed = 0;
var altitude = 0;
var heading = 0;
var gnumber = 0;
var vertspeed = 0;

/////////////////////////////////////////////////////////////////////////
//
// For now, I'm using hard coded criteria for the traffic warning...
// this needs to be replaced by user-defined criteria. 
//
/////////////////////////////////////////////////////////////////////////
var warning_distance = 2;   // miles
var warning_altitude = 800; // feet

// offsets, in pixels per unit of measure
const spd_offset = 4.8;    // Knots
const alt_offset = .4792;  // Feet MSL
const hdg_offset = 4.720;  // Degrees
const ball_offset = 3;     // Degrees
const ball_center = 433;   // this is "center" of the slip-skid indicator
const pitch_offset = 1.19; // this adjusts the pitch to match Stratux

var speedbox = document.getElementById('tspanSpeed');
var altitudebox = document.getElementById('tspanAltitude');
var headingbox = document.getElementById('tspanHeading');
var gbox = document.getElementById('tspanGMeter');
var vspeedbox = document.getElementById('tspanVertspeed');
var varrowbox = document.getElementById('tspanArrow');

// arrays for averaging displayed values (keeps tapes from jumping around)
var avgSpdArray = [0,0,0,0,0,0,0,0,0,0];
var avgAltArray = [0,0,0,0,0,0,0,0,0,0];
var avgHdgArray = [0,0,0,0,0,0,0,0,0,0];
var avgVspArray = [0,0,0,0,0,0,0,0,0,0];
var avgCounter = 0;
var spd = 0;
var alt = 0;
var hdg = 0;
var vsp = 0;
const divisor = 5;

var warningIdentity = document.getElementById("tspanWarnIdentity"); 
var warningAltitude = document.getElementById("tspanWarnAltitude");
var warningDistance = document.getElementById("tspanWarnDistance");
var warningBearing = document.getElementById("tspanWarnBearing");

// variables for proximity warning calculations
var lastIdent = "";
var lastAlt = 0;
var lastDist = 0;
var lastBrng = 0;
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
    var obj = JSON.parse(evt.data);
    var meters =  Number(obj.Distance.toFixed(1));
    var dist = Number(((meters * 3.28084) / 5280).toFixed(1));
    var brng = Number(Math.round(obj.Bearing.toFixed(0)));
    var reg = obj.Reg;
    var alt = Number(obj.Alt);
    var myAlt = Number(altitudebox.textContent);
    var isWarning = false;

    if (!showWarning) {
        trafficWarning.css('visibility', 'hidden')
        return;
    }
    
    // we're only going to consider traffic that has been continuously reported for 20 cycles (1 second)
    if (rcvCount < 20) {
        rcvCount = rcvCount + 1;
    }
    else if (rcvCount >= 20) {
        console.log("Show Warning = " + showWarning + ", " +  reg + " - Brg: " + brng + ", Dist: " + dist + ", Alt: " +  alt);
        rcvCount = 0;
        if (dist > warning_distance && reg == lastIdent) {
            isWarning = false;
            lastIdent = "";
            lastAlt = 0;
            lastDist = 0;
            lastBrng = 0;
            trafficWarning.css('visibility', 'hidden');
        }
        else if (dist <= warning_distance) {
            if (alt <= myAlt + warning_altitude && alt >= myAlt - warning_altitude && reg != lastIdent) {
                if (brng != 0 ) { 
                    isWarning = true;
                    warningIdentity.textContent = reg;
                    warningAltitude.textContent = alt;
                    warningDistance.textContent = dist;
                    warningBearing.textContent = brng;
                    lastIdent = reg;
                    lastAlt = alt;
                    lastDist = dist;
                    lastBrng = brng;
                }
            }
        }
    }

    if (isWarning) {
        trafficWarning.css('visibility', 'visible');
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

setInterval(function() {
    
    fetch(urlAHRS)
        .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
        
        var str = JSON.stringify(myJson)
        var obj = JSON.parse(str);

        // attitude pitch & roll
        attitude.setRoll(obj.AHRSRoll * -1);
        attitude.setPitch(obj.AHRSPitch * pitch_offset);
        
        // set these values to a reasonable precision
        gnumber = obj.AHRSGLoad.toFixed(1);
        slipskid = Math.trunc(obj.AHRSSlipSkid);
        
        if (avgCounter < divisor) {
            avgSpdArray[avgCounter] = obj.GPSGroundSpeed * 1.151; // mph multiplier
            avgAltArray[avgCounter] = obj.GPSAltitudeMSL;
            avgHdgArray[avgCounter] = obj.GPSTrueCourse;
            avgVspArray[avgCounter] = obj.GPSVerticalSpeed;
            avgCounter = avgCounter + 1;
        } 
        else if (avgCounter >= divisor) {
            avgCounter = 0;
            spd = 0;
            alt = 0;
            hdg = 0;
            vsp = 0;

            for (i = 0; i < divisor; i++) {
                spd = spd + avgSpdArray[i];
                alt = alt + avgAltArray[i];
                hdg = hdg + avgHdgArray[i];
                vsp = vsp + avgVspArray[i];

                // reset array elements to zero
                avgSpdArray[i] = 0;
                avgAltArray[i] = 0;
                avgHdgArray[i] = 0
                avgVspArray[i] = 0;
            }

            // set the speed, altitude, heading, and GMeter values
            speed = Math.trunc(spd/divisor);
            altitude = Math.trunc(alt/divisor);
            heading = pad(Math.trunc(hdg/divisor), 3);
            vertspeed = Math.trunc(vsp/divisor);
            speedbox.textContent = speed;
            altitudebox.textContent = altitude;
            headingbox.textContent = heading;
            vspeedbox.textContent = Math.abs(vertspeed) + " FPM";
            varrowbox.textContent = (vertspeed < 0 ? "▼" : "▲");
            
            var speedticks = (speed * spd_offset);
            var altticks = (altitude * alt_offset);
            var hdgticks = (heading * hdg_offset) * -1;
            
            // set the coordinates of the tapes
            speedtape.css('transform', 'translateY(' + speedticks + 'px)');
            alttape.css('transform', 'translateY(' + altticks + 'px');
            headingtape.css('transform', 'translateX('+ hdgticks + 'px');
        }

        gbox.textContent = gnumber + " G";
      
        // set the skid-slip ball position
        if (slipskid < -17) {
            slipskid = -17;
        }
        else if (slipskid > 17) {
            slipskid = 17;
        }
        var ballposition = ball_center + (slipskid * ball_offset);
        //console.log("slipskid: " + slipskid + ", ball position: " + ballposition)
        ball.css('left', ballposition + 'px');

   });
    
    if (wsOpen) {
        // ping Stratux with some data (doesn't matter what, so just using UTC time)
        if (countCycle >= 80) {
            var data = new Date().getTime();
            countCycle = 0;
            sendKeepAlive(data);
            console.log("Sent Keep Alive, data = " + data);
        }
        countCycle ++;
    }

}, 50);
