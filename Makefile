get-config:
	firebase functions:config:get > ./functions/config/default.json

test:
	cd functions && npm t

build:
	cd functions && npm run build