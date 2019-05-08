all:
	mkdir -p /var/www/hud
	mkdir -p /var/www/hud/css
	cp hud/css/*.css /var/www/css
	mkdir -p /var/www/hud/js
	cp hud/js/*.js /var/www/hud/js
	mkdir -p /var/www/hud/img
	cp hud/img/* /var/www/hud/img
	cp hud/hud.html /var/www/hud
	