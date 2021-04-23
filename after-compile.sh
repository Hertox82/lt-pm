#! /bin/bash

npm run build-lt
cp -rf src/ dist/
find ./src/ -name "*.js" -type f -delete
find ./src/ -name "*.js.map" -type f -delete 
find ./src/ -name "*.d.ts" -type f -delete
cp package.json dist/
cp README.md dist/ 
