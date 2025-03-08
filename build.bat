@echo off
setlocal

:: Enable error handling
echo Starting build process...

:: Navigate to the frontend directory
if not exist frontend (
    echo Error: Frontend directory not found!
    pause
    exit /b
)
cd frontend

:: Install dependencies if needed
echo Running npm install...
call npm install
if %errorlevel% neq 0 (
    echo Error: npm install failed!
    pause
    exit /b
)

:: Run the build command
echo Running npm build...
call npm run build
if %errorlevel% neq 0 (
    echo Error: npm build failed!
    pause
    exit /b
)

:: Navigate back to the root directory
cd ..

:: Ensure the backend static directory exists before removing it
if exist backend\src\main\resources\static (
    echo Removing existing backend static directory...
    rmdir /s /q backend\src\main\resources\static
)

:: Copy the build folder to the backend static directory
echo Copying frontend build to backend...
xcopy frontend\build backend\src\main\resources\static /E /I /Q /Y
if %errorlevel% neq 0 (
    echo Error: Copying frontend build failed!
    pause
    exit /b
)

:: Navigate to the backend directory
if not exist backend (
    echo Error: Backend directory not found!
    pause
    exit /b
)
cd backend

:: Check if mvnw exists, otherwise use mvn
if exist mvnw (
    echo Running Maven build...
    call mvnw clean install package
) else (
    echo Running Maven build using mvn...
    call mvn clean install package
)

if %errorlevel% neq 0 (
    echo Error: Maven build failed!
    pause
    exit /b
)

:: Navigate back to the root directory
cd ..

:: Remove the dist directory if it exists
if exist dist (
    echo Removing existing dist directory...
    rmdir /s /q dist
)

:: Create a new dist directory
echo Creating dist directory...
mkdir dist

:: Copy the JAR file to the dist directory and rename it
if exist backend\target\payrollsystem-0.0.1-SNAPSHOT.jar (
    echo Copying JAR file to dist directory...
    copy backend\target\payrollsystem-0.0.1-SNAPSHOT.jar dist\grand-elite-payroll-system.jar
    if %errorlevel% neq 0 (
        echo Error: Copying JAR file failed!
        pause
        exit /b
    )
) else (
    echo Error: JAR file not found! Check if the Maven build succeeded.
    pause
    exit /b
)

echo Build process completed successfully!
pause
exit /b
