# stratux-webHud
Html content for adding a HUD to the Stratux RPi that gets it's display directly from the Stratux.


Rough instructions:

Use the wired network on the Stratux RPi. See https://die-antwort.eu/techblog/2017-12-setup-raspberry-pi-for-kiosk-mode/
   1. sudo apt-get update
   2. sudo apt-get upgrade
   3. sudo apt-get install --no-install-recommends xserver-xorg x11-xserver-utils xinit openbox
   4. sudo apt-get install --no-install-recommends chromium-browser
   5. sudo nano /etc/xdg/openbox/autostart
   6. add the contents of the autostart file in hud/scripts found in this repository
 
Recursively copy the hud directory to the stratux folder /var/www/
 
This should give you /var/www/hud/ and its subdirectories css, img, and js.
 
Reboot the Stratux RPi.  Using your favorite browser on iPad, phone, desktop, etc., join the stratux wifi network and go ahead and browse to http://192.168.10.1/hud/hud.html if everything is working, you should see an AHRS display with solid black background. Moving the Stratux should show very smooth movement of the AHRS (20 frames/sec.)
 
Once operation of the AHRS display is confirmed, connect the Kivic HUD device via a 3.5 composite video cable from the Stratux jack to the external camera jack on the back of the Kivic.

Viewing through the HUD, the black background will be clear and you can obviously then see right through it...

The next steps I want to do with this are to add a configuration page where the user can enter their aircraft's V-speeds, setup criteria for displaying a traffic alert flag, e.g., "If another aircraft comes within X miles of me and plus or minus X feet from my altitude, display a red alert box with the aircraft's exact information, including distance, altitude, speed, and relative bearing from me."  

The V-speeds will add the appropriate color bands on the speed tape on the left.  For now it will require editing the speed_tape.svg file in the img folder, where it can be easily edited to conform to your desired specs, and then exported (I used Inkscape) as speed_tape.png 
