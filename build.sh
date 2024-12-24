cd ./frontend
npm run build
rm -rf ../backend/src/main/resources/static
cp -r ./build/ ../backend/src/main/resources/static

cd ../backend
./mvnw clean install package

cd ..
rm -rf ./dist
mkdir dist
cp ./backend/target/payrollsystem-0.0.1-SNAPSHOT.jar ./dist/grand-elite-payroll-system.jar