# Vue 3 Web App Template (WORK IN PROGRESS)

This Vue 3 Typescript project can be used as a template to help you get started developing smaller
projects. Read through this README to have a better understanding of how this project is setup.

## Todos (\*\*\*)

- Refactoring and Cleanup

- [ ] `log.info` details should include information about the operation that just occurred

- [ ] `ParentStatus` determines what shows up on the Dashboard Parent Cards (Enabled/Disabled)

- Dashboard List Cards

- [ ] Finish the `Inspect Action` (most fun part!)

- [ ] Work on the `Edit Action`

- [ ] Work on the `Charts Action`

  - [ ] Select or slider for date range?

- Dashboard List Functionality

- [ ] `Quasar`

  - [ ] Quasar Icon Genie CLI to generate a more complete icon list

  - [ ] See if you can make use of the Quasar configs for dialogs and notifys (`main.ts`)

  - [ ] Use Quasar Loading plugin when waiting on data tables

  - [ ] Use Quasar Meta plugin to improve SEO

- [ ] `Charts`

  - [ ] Improve defaults generator with records of different dates so you can test charts

  - [ ] How to handle two records of the same Parent on the same day in the chart graph

- [ ] `Possible Features & Updates`

  - [ ] Add more tags to the repository

  - [ ] `useRules` Composable for input rules and validators

  - [ ] Script to quickly updates certain values across the app

- [ ] `Final Steps`

  - [ ] `Text/Copy Pass` Review app text for good flow and grammer

  - [ ] `Add Tests`
        <https://www.youtube.com/watch?v=FJRuG85tXV0&list=WL&index=18&ab_channel=ProgramWithErik>

## Post Cloning Steps (Remove after completion)

- [ ] Update `package.json`

  - [ ] `name`
  - [ ] `description`
  - [ ] `version`
  - [ ] `repository`
  - [ ] `bugs`
  - [ ] `homepage`

- [ ] Update certain code files

  - [ ] Update `base` in `~/vite.config.ts` to your repository name for deployments to work
  - [ ] Update `AppText` enums in `~/src/constants/ui/string-enums.ts` to represent your app
  - [ ] Update `title` in `~/index.html` to reflect the app name you use in `ui-enums.ts`
  - [ ] Update `name` and `short_name` in `~/public/manifest.json` the app name
  - [ ] Update `start_url` in `~/public/manifest.json` to deployed website address (home)

- [ ] Update `GitHub` repository settings

  - [ ] Add a Description
  - [ ] Add the Website
  - [ ] Add Topics
  - [ ] Update the `Include in the home page` section

    - [ ] Uncheck `Releases`
    - [ ] Uncheck `Packages`
    - [ ] Uncheck `Environments`

- [ ] Generate a new Favicon here: <https://favicon.io/> (credit original artists)

- [ ] Update `README.md`

  - [ ] Change README main heading to your project name
  - [ ] Add detailed project description
  - [ ] Update the `Credits` section as needed
  - [ ] Remove unneeded sections (including this one)

## Table of Contents

- [Usage](#usage)
- [Project Creation Steps](#project-creation-steps)
- [Additional Notes](#additional-notes)
- [Credits](#credits)

## Usage

Install the project dependencies.

```sh
npm i
```

Launch the dev server site.

```sh
npm run dev
```

Build the project `dist` directory.

```sh
npm run build
```

Run tests and coverage report (press `q` to quit).

```sh
npm test
```

Build and deploy the `dist` directory.

```sh
npm run deploy
```

Check for outdated packages.

```sh
npm outdated
```

Update packages based on `package.json` version settings. Test updates to ensure they worked.

```sh
npm upgrade
```

## Project Creation Steps

Details on the steps I took to setup this project.

1. Create an empty repository in GitHub with a `PROJECT_NAME`
1. Run `npm init @vue/latest` in your local Projects directory:
   - Name the project `PROJECT_NAME`
   - TypeScript - Yes
   - JSX - No
   - Vue Router - Yes
   - Pinia - Yes
   - ViTest - Yes
   - End-to-End Testing - No
   - ESLint - Yes
   - Prettier - Yes
1. Install useful dependencies:
   - `npm i slugify` - For making URL slug from text
   - `npm i dexie` - IndexedDB wrapper
   - `npm i -D gh-pages` - GitHub Pages deployment
   - `npm i -D @vitest/coverage-c8` - test coverage output
   - `npm i @vueuse/core` - Vue component utilities
   - `npm i chart.js vue-chartjs` - Chart.js with a Vue wrapper
   - `npm i -D @types/chart.js`
   - `npm i quasar @quasar/extras` - Vue component framework
   - `npm i -D @quasar/vite-plugin`
1. Use Quasar configurator tool to help setup Quasar for your specific project:
   - <https://quasar.dev/start/vite-plugin>
1. Setup the following files based on Quasar configurator tool selections:
   - `mains.ts`
   - `vite.config.ts`
1. Additional scripts for `package.json` file. The `deploy` script makes a copy of the `index.html`
   in `dist` as `404.html` to address complications related to routing. This let's you avoid using
   hash based routing.
   ```json
   {
     "scripts": {
       "test": "vitest --environment jsdom --root src/",
       "test:coverage": "vitest --environment jsdom --coverage --root src/",
       "deploy": "npm run build && cd dist && cp index.html 404.html && cd .. && gh-pages -d dist -m Deployment"
     }
   }
   ```
1. Setup other config files as desired:
   - `/.vscode/extensions.json` - Include extensions you recommend for your version
   - `tsconfig.app.json` - Setup for ES2020+ support
   - `tsconfig.vitest.json` - Setup for ES2020+ support
   - `.eslintrc.cjs`
   - `.gitignore`
   - `.prettierignore`
   - `.prettier.json`
1. Add icons, manifest file, and update `index.html` for the project:
   - `manifest.json`
   - `favicon.ico`
   - (other icons)
   - ```html
     <meta name="theme-color" content="#1976D2" />
     <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png" />
     <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png" />
     <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png" />
     <link rel="manifest" href="manifest.json" />
     <title>Vue 3 Web App Template</title>
     ```
1. Run `git init` inside your project directory
1. Commit all changes to the project into it's initial commit
1. Run the follow commands to push the new project to your GitHub repo:
   ```sh
   git remote add origin https://github.com/GITHUB_USER/PROJECT_NAME.git
   git branch -M main
   git push -u origin main
   ```

## Additional Notes

### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) +
[Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) +
[TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

### Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI
with `vue-tsc` for type checking. In editors, we need
[TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a
[Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669)
that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select
      `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

### Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Credits

Recognize the work of anyone whose material you used in the project here.
