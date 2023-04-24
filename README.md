# easyBiograph

This project aims to provide a modern web-based version of the easyBiograph.
The easyBiograph is a diagnostical visualization tool for social workers and
healthcare professionals based on the book
[Soziale Diagnostik](https://www.vandenhoeck-ruprecht-verlage.com/themen-entdecken/paedagogik-soziale-arbeit/soziale-arbeit/26908/soziale-diagnostik)
by Peter Pantuček-Eisenbacher.
This tool supports the collection, reflection, and analysis of biographical events
for social support.

This projects is a follow-up to:
* [easyBiograph 1.0](http://www.easybiograph.com/) developed in Java 6 by Nikolaus Kelis
* [master thesis](https://www.linkedin.com/in/michaela-buschberger-158477183/) by Michaela Buschberger

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

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Acknowledgments

<img align="right" src="https://user-images.githubusercontent.com/1217527/234003656-5afae206-1571-4df9-bb49-bfed89578085.png" alt="logo of the European Commission">

This work was partly funded by the Erasmus+ project [TransSoDia](https://research.fhstp.ac.at/en/projects/transsodia-transnational-and-digital-learning-and-teaching-in-cooperative-social-diagnostics) cofunded by the European Union.
