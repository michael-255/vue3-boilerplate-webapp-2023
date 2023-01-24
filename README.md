# vue3-boilerplate-webapp-2023

This template should help get you started developing with Vue 3 in Vite.

## Steps to Setup

Details on the steps I took to setup this project.

1. Create an empty repository in GitHub with a `PROJECT_NAME`
1. Run `npm init @vue/latest` in your local Projects directory
   - Name the project `PROJECT_NAME`
   - TypeScript - Yes
   - JSX - No
   - Vue Router - Yes
   - Pinia - Yes
   - ViTest - Yes
   - End-to-End Testing - No
   - ESLint - Yes
   - Prettier - Yes
1. `-----------Record other steps to get this project ready!`
1. `Mention the linting and formating files you included...`
1. Run `git init` inside your project directory
1. Commit all changes to the project into it's initial commit
1. Run the follow commands to push the new project to your GitHub repo:
    ```sh
    git remote add origin https://github.com/GITHUB_USER/PROJECT_NAME.git
    git branch -M main
    git push -u origin main
    ```


## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
