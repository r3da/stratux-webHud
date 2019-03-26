# stratux-webHud

stratux-webHud is a simple Html application that is displayed on a web page in the Chromium browser in Kiosk mode, running on the Stratux RPi itself.  You then use either a HDMI cable from the Stratux to a Hudly or other HDMI capable projector, or a 3.5mm TRRS cable from the composite video jack on the Stratux to the backup camera port on the Kivic HUD.   

An example of the 3.5mm  TRSS cable can be seen at http://www.l-com.com/audio-video-thinline-35mm-cable-assemblies-male-to-male-4-circuit-tip-ring-ring-sleeve-trrs


![Image of Screen](https://github.com/N129BZ/stratux-webHud/blob/master/bankScreenshot.png)
![Image of Stratux Jack](https://github.com/N129BZ/stratux-webHud/blob/master/PluggedIntoRPi.jpg)
![Image of Kivic Jack](https://github.com/N129BZ/stratux-webHud/blob/master/PluggedIntoKivic.jpg)

Rough instructions for an absolute minimum footprint install on the Stratux raspbian stretch lite OS:

I used the wired nic on the Stratux RPi for downloading updates. The steps below were taken directly from https://die-antwort.eu/techblog/2017-12-setup-raspberry-pi-for-kiosk-mode/  starting at the heading "Minimum Environment for GUI Applications" after steps 1 and 2 below.

   1. sudo apt-get update
   2. sudo apt-get upgrade
   3. sudo apt-get install --no-install-recommends xserver-xorg x11-xserver-utils xinit openbox
   4. sudo apt-get install --no-install-recommends chromium-browser
   5. sudo nano /etc/xdg/openbox/autostart
   6. add the contents of the autostart file in hud/scripts found in this repository
 
Recursively copy the hud folder to the stratux folder /var/www/
 
This should give you /var/www/hud/ and its subdirectories css, img, and js.
 
Reboot the Stratux RPi.  Using your favorite browser on iPad, phone, desktop, etc., join the stratux wifi network and go ahead and browse to http://192.168.10.1/hud/hud.html if everything is working, you should see an AHRS display with solid black background. Moving the Stratux should show very smooth movement of the AHRS (20 frames/sec.)
 
Once operation of the AHRS display is confirmed, plug your video cable and verify the HUD projector is working. (I'm using a Kivic HUD, I connected the Kivic HUD device via the 3.5mm TRSS composite video cable from the Stratux jack to the external camera jack on the back of the Kivic.)

If you need to tweak the view to your screen, the div.hud class in the hud.css file can be edited at the setting transform: scale(x, y)
to scale the 2 dimensions to your liking. It is suggested to not change values for masks and tapes, as they are calibrated by number of pixels to offset based on the speed, altitude, or heading values being applied.
![Image of ScaleSetting](https://github.com/N129BZ/stratux-webHud/blob/master/scalesetting.png)

The next steps I wuld like to do with this are:

(1) Get bluetooth functioning on the Stratux RPi so that a bluetooth numeric keypad can be paired. This will allow certain functions to be keyed in directly on the keypad. For example, keying the keing the ONE key could be used to re-cage the AHRS, or keying the TWO key could toggle a "nearest traffic list..." 

(2) Add a configuration page where the user can enter their aircraft's V-speeds. Those V-speeds will be used to programmatically add the appropriate color bands on the speed tape on the left.  For now it will require editing the speed_tape.svg file in the img folder, where it can be easily edited to conform to your desired specs, and then exported (I used Inkscape) as speed_tape.png. The uploaded speed_tape image has the V-speeds for my Zenith CH650.

(3) Add to configuration the ability to set the criteria for displaying a traffic alert flag, e.g., "If another aircraft comes within X miles of me and plus or minus X feet from my altitude, display a red alert box with the aircraft's detailed information, including the AC identifier, distance, altitude, speed, and relative bearing from me."  

A HUGE THANKS goes out to John Marzulli for his work on an aircraft HUD, which inspired me to do this as a web app on the stratux itself. John's work can be found at: https://github.com/JohnMarzulli/StratuxHud and I also give a HUGE THANKS to Sébastien Matton for his wonderful jQuery flight indicators examples. Sébastien's work can be found at https://github.com/sebmatton/jQuery-Flight-Indicators
