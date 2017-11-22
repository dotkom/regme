# regme
App for self-registration at events.


## Getting started
1. Install NodeJS (and npm)
2. Install project dependencies ...\
  `npm install` or `make install` or `yarn`

3. Build the project and generate documentation ...\
  `npm run build` or `make`

4. Build the project and watch for changes, re-building on changes ...\
  `npm run watch` or `make watch`

5. For [hot module replacement](https://github.com/webpack/docs/wiki/hot-module-replacement-with-webpack) run webpack dev server ...\
  `npm run dev` or `make dev`


## Project structure
All the projects source files are located in app/src which is organized in a few different folders. src/assets contains all non javascript files including images, icons and stylesheets; src/common contains the shared independent javascript files like `constants`, so they're available all over the project;
src/services contains the services and their respective class models, these services acts as interfaces between the frontend and backend API; and the last folder src/components contains all the project's react components. src/index.js defines the root component App and is only responsible for bootstraping the app.

## Documentation
Build the project once and the documentation should be genrated to ./docs

## Config
All configuration is done via environment variables, note that the `/` at the end of all url's is required since urls are not cleaned at this point in time.
| Key | Description | Example | Default |
| --- | ---         | ---     | ---     |
| `RG_BASE` | The host entrypoint | `https://online.ntnu.no/` | `http://localhost:8000/` |
| `RG_API_BASE` | The API entrypoint relative to the host | `api/` | `api/v1/` |
| `RG_API_EVENT` | The API endpoint where events are fetched from | `events/` | `events/` |
| `RG_API_AUTH` | The API endpoint where auth token is fetched from if required by the API | `auth/` | `auth/` |
| `RG_API_ATTENDEES` | The API endpoint where attendees are fetched from | `attendees/` | `attendees/` |
| `RG_API_ATTEND` | The API endpoint where event registration requests are pushed to | `attend/` | `attend/` |
| `RG_API_USERS` | The API endpoint where userinformation is fetched from | `users/` | `users/` |
| `RG_CLIENT_SECRET` | The client secret used to fetch an auth token from RG_API_AUTH | `''` | `''` |
| `RG_CLIENT_ID` | The client id used to fetch an auth token from RG_API_AUTH | `''` | `''` |
| `RG_SENTRY_DSN` | Sentry's DSN token used to track js errors | `''` | `''` |
