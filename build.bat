@echo off

:: Navigate to the frontend directory
cd frontend

:: Run the build command
npm run build

:: Remove the static directory in the backend
rmdir /s /q ..\backend\src\main\resources\static

:: Copy the build folder to the backend static directory
xcopy build ..\backend\src\main\resources\static /E /I /Q /Y

:: Navigate to the backend directory
cd ..\backend

:: Run the Maven clean install package command
mvnw clean install package

:: Navigate back to the root directory
cd ..

:: Remove the dist directory if it exists
rmdir /s /q dist

:: Create a new dist directory
mkdir dist

:: Copy the JAR file to the dist directory and rename it
copy backend\target\payrollsystem-0.0.1-SNAPSHOT.jar dist\grand-elite-payroll-system.jar
