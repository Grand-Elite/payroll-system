cd ./frontend
npm run build

rm -rf ../backend/src/main/resources/static
cp -r ./build/ ../backend/src/main/resources/static
