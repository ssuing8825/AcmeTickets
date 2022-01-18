# Introduction

UI Dashboard to Test NServiceBus Backend

## Getting Started

### Setup

1. Install Node.Js <https://nodejs.org/en/>

2. Install Angular Cli by running following in CLI (Open Powershell/CMD/Bash):

   ```CDM
      npm install -g @angular/cli
   ```

3. Open new Cli window in the project root and run following command to install the dependencies:

   ```CDM
      npm i --force
   ```

### Running Application

1. Open Cli window in the project root
2. Run following command:

   ```CDM
      ng serve
   ```

3. Open browser window and navigate to <http://localhost:4200/>
4. Login with admin/admin

#### Note

If you are running application on local with backend running on Azure, then update api urls in _./apps/acme-ui/src/environments/environment.ts_

#### App Configs

App configs files are available inside the folder ./apps/acme-ui/src/environments/. There are three files one for each environment. They contain api urls and other environment specific settings.

1. environment.ts - for localhost settings
2. environment.staging.ts - for staging environment
3. environment.prod.ts - for prod environment

### Build and Deploy

To build the app for the prod environment, run following command in the project root:

```CDM
  npm run build:prod:acme-ui
```

The prod build will use environment.prod.ts config file. The build artifacts (static files) should be in the path: _./dist/apps/acme-ui/_

Open ./dist/apps/acme-ui/ folder and zip all the contents of the folder. Deploy zip contents to the server (IIS/Node/NGINX...) for hosting the static files.

Current app is deployed at <https://eventellectui.azurewebsites.net/>
