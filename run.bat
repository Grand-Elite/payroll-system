@echo off

:: Use environment variables or fallback to default
set DB_HOST=%DB_HOST%
if "%DB_HOST%"=="" set DB_HOST=localhost

set DB_PORT=%DB_PORT%
if "%DB_PORT%"=="" set DB_PORT=3306

set DB_NAME=%DB_NAME%
if "%DB_NAME%"=="" set DB_NAME=grandelitepayrollsystem

set DB_USER=%DB_USER%
if "%DB_USER%"=="" set DB_USER=test

set DB_PASS=%DB_PASS%
if "%DB_PASS%"=="" set DB_PASS=test

echo Connecting to DB at %DB_HOST%:%DB_PORT%/%DB_NAME%

:: Run the Spring Boot application
java -jar ./dist/grand-elite-payroll-system.jar ^
  --spring.datasource.url=jdbc:mysql://%DB_HOST%:%DB_PORT%/%DB_NAME% ^
  --spring.datasource.username=%DB_USER% ^
  --spring.datasource.password=%DB_PASS%