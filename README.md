# langgraph-starter

This is a bare minimum template for create a nodeJS project with typescript, nodeJS 18 and langgraph.

## getting started

- The location of your source code is expected to live under the `src` directory.
- The main entry-point to your node application is `src/main.ts`
- Your compiled JS code will be in the `dist` directory.

for development:

```
pnpm dev
```

for production:

```
pnpm build
pnpm start
```

or, if you want to give `swc` a try, you can build your bundle with `swc`.

```
pnpm build-swc
pnpm start
```

## tooling

- pnpm
- typescript
- tsx
- tsc
- swc

For development, we use _tsx_. For production, you can either use _tsc_ or _swc_ to build.

## configuration files

```
tsconfig.json
.swrc
```
