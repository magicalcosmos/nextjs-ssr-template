build:
	yarn build
deploy:
	rm -rf yarn.lock
	rm -rf node_modules
	yarn
	yarn build
	yarn pm2:start
 