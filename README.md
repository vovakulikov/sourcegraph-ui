# Svelte Sourcegraph UI library

**Status:** In development

The main place where Sourcegraph UI components live. This shared UI-kit package 
provides set of styled UI components, Design Tokens and frontend documentation. 

## Install 

1. Install package via NPM 

```shell
pnpm add @sourcegrah/ui
```
2. Make sure you add sourcegraph/ui global styles (somewhere in the root of you app)

```sveltehtml
import "@sourcegrah/ui/init"
```

3. Later in UI you can freely use components from the package

```sveltehtml
import { Button } from "@sourcegrah/ui"
```

## Developing

Once you've created a project and installed dependencies with `pnpm install` , start
a development server:

```bash
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

Everything inside `src/lib` is part of your library, everything inside `src/routes`
can be used as a showcase or preview app.

## Building

To build your library:

```bash
pnpm run package
```

To create a production version of your showcase app:

```bash
pnpm run build
```

You can preview the production build with `pnpm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Publishing

Go into the `package.json` and give your package the desired name through the `"name"` 
option. Also consider adding a `"license"` field and point it to a `LICENSE` file 
which you can create from a template (one popular option is the [MIT license](https://opensource.org/license/mit/)).

To publish your library to [npm](https://www.npmjs.com):

```bash
npm publish
```
