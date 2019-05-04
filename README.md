# stratux-webHud

stratux-webHud is a simple Html application that is displayed on a web page in the Chromium browser in Kiosk mode, running on the Stratux RPi itself.  You then use either a HDMI cable from the Stratux to a Hudly or other HDMI capable projector, or a 3.5mm TRRS cable from the composite video jack on the Stratux to the backup camera port on the Kivic HUD.   

This application has been tested on Raspberry pi 2B and 3B.  I am currently testing on a Pi Zero W, using a USB expansion card, and also working on a configuration layer that will be accessible from the Stratux settings web page.

An example of the 3.5mm  TRSS cable can be seen at http://www.l-com.com/audio-video-thinline-35mm-cable-assemblies-male-to-male-4-circuit-tip-ring-ring-sleeve-trrs

![Image of Screen1](https://github.com/N129BZ/stratux-webHud/blob/master/readme_images/InTurn.png)
![Image of Screen2](https://github.com/N129BZ/stratux-webHud/blob/master/readme_images/WithSlipSkid2.png)
![Image of Stratux Jack](https://github.com/N129BZ/stratux-webHud/blob/master/readme_images/PluggedIntoRPi.jpg)
![Image of Kivic Jack](https://github.com/N129BZ/stratux-webHud/blob/master/readme_images/PluggedIntoKivic.jpg)

# Instructions for a minimum footprint install on the Stratux image:

I used the wired nic on the Stratux RPi for downloading updates. Terminal into the pi using ssh from Linux or Apple, or on Windows 10 use a terminal program like puTTY, and complete the following steps. 

1.  Expand the filesystem:
````
sudo raspi-config  
select Advanced Options
select Expand Filesystem
exit and allow system reboot.
````
2.  Install all of the necessary packages:
````
sudo apt-get install ntp   
sudo apt-get update       
sudo apt-get dist-upgrade
sudo apt-get install unclutter
sudo apt-get install xorg
sudo apt-get install --no-install-recommends chromium-browser
````
3.  Create ~/.bash_profile file and add the following startup commands:
````
# Disable any form of screen saver / screen blanking / power management
xset s off
xset s noblank
xset -dpms

unclutter &

# Start Chromium in kiosk mode
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' ~/.config/chromium/'Local State'
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/; s/"exit_type":"[^"]\+"/"exit_type":"Normal"/' ~/.config/chromium/Default/Preferences
chromium-browser --kiosk 'http://localhost/hud/hud.html' --disable-notifications --noerrdialogs --disable-infobars --incognito --disable-features=TranslateUI --disk-cache-dir=/dev/null
````
4. Recursively copy the hud folder from your clone (or .zip) to a new hud folder under /var/www/. This should give you /var/www/hud/ and its subdirectories css, img, and js.

5.  Set the pi for console auto-login:
````
sudo raspi-config
select Boot Options
select Console Autologin, automatically logged in as ‘pi’ user
````

Reboot the Stratux RPi.  Using your favorite browser on iPad, phone, desktop, etc., join the stratux wifi network and browse to http://192.168.10.1/hud/hud.html if everything is working, you should see the AHRS display with solid black background. Physically moving the Stratux should show very smooth movement of the AHRS on the web page. (20 frames/sec.)
 
Once operation of the AHRS display is confirmed, plug in your hud video cable and verify the projector is working. (I'm using a Kivic HUD, I connected the Kivic HUD device via the 3.5mm TRSS composite video cable from the Stratux jack to the external camera jack on the back of the Kivic.)

If you need to tweak the view of the HUD screen, the div.hud class in the hud.css file can be edited at the setting transform: scale(x, y) to scale the 2 dimensions to your liking, or even rotate 180° if mounting the HUD from the top of the windscreen. It is suggested to not change values for masks and tapes, as they are calibrated by number of pixels to offset based on the speed, altitude, or heading values being applied.

![Image of ScaleSetting](https://github.com/N129BZ/stratux-webHud/blob/master/readme_images/hudcss1.png)

![Image of ScaleSetting](https://github.com/N129BZ/stratux-webHud/blob/master/readme_images/hudcss2.png)

![Image of UpsideDown](https://github.com/N129BZ/stratux-webHud/blob/master/readme_images/upsideDown.png)

There are also keydown events that are trapped in javascript, for performing most of the functions exposed by Stratux's REST interface. Currently, these will only work when viewing the HUD screen on your laptop/desktop:

    "c" or numeric keypad "1" will [C]age AHRS
    "a" or numeric keypad "2" will calibrate [A]HRS
    "s" or numeric keypad "3" will re[S]tart
    "g" or numeric keypad "4" will reset [G]meter
    "b" or numeric keypad "5" will re[B]oot"
    "k" or numeric keypad "7" will [K]ill (shutdown) stratux
    "l" or numeric keypad "0" will re[L]oad the web page (like after making adjustment to scale, etc.)
    "w" or numeric keypad "9" will toggle a [W]arn flag, this lets you know the HUD is in Proximity Warning Mode  
        
(Note: I am currently testing Bluetooth functionality on the Stratux RPi with a paired bluetooth numeric keypad. This would allow the functions above to be keyed in when in flight. Preliminary results are mixed. The Stratux has bluetooth disabled by default, it appears this is for optimization of the UART for the 2 SDR's. After enabling bluetooth, the keypad response is sluggish and hit or miss.)

The next steps I would like to do with this are:

(1) Add a configuration page where the user can enter their aircraft's V-speeds. Those V-speeds will be used to programmatically add the appropriate color bands on the speed tape on the left.  For now it will require editing either the /img/speed_tape.png image directly, or edit /img/speed_tape.svg and save it as a png image. The current speed_tape.png image has the V-speeds for my Zenith CH650. (Note, the blue color at 60KT and the letters "BG" above that is the Best Glide speed for the CH650.)

(2) Add to configuration the ability to set the criteria for displaying a traffic alert flag, e.g., "If another aircraft comes within X miles of me and plus or minus X feet from my altitude, display a red alert box with the aircraft's detailed information, including the AC identifier, distance, altitude, speed, and relative bearing from me."  

A HUGE THANKS goes out to John Marzulli for his work on an aircraft HUD, which inspired me to do this as a web app on the stratux itself. John's work can be found at: https://github.com/JohnMarzulli/StratuxHud.
