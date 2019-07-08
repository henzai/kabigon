get-config:
	firebase functions:config:get > ./.firebase.config.json

test:
	cd functions && npm t