# Frontend

Contains an Angular-project for our Subletic-Frontend.

## Usage

In some cases it can help to use `cmd` instead of the `powershell`, if `npm` or `ng` is not found.

| Description | Command |
|-------------|---------|
| Install Node.js | `winget install OpenJS.NodeJS` |
| Check if Node.js installation was successful | `npm --version` |
| Install angular-cli | `npm install -g @angular/cli` |
| Check if Angular installation was successful | `ng version` |
| Load all dependency's |`npm update` |
| Start Angular in development-mode | `ng serve -o` or <br> `ng serve -o --configuration=development` |
| Run UnitTests | `ng test` |

## Ports and Connection

| Software     | HTTP-Port  | HTTPS-Port  |
|--------------|------------|-------------|
| Frontend     | 40110 (80) | 40111 (443) |
| Backend      | 40114      | 40115       |