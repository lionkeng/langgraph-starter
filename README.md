# langgraph-starter

This is a mono-repo created to explore langgraphJS.

## tooling

- pnpm
- typescript
- tsx
- tsc
- swc
- lerna

## getting started

For simplicity in maintaining this as a mono-repo with multiple possible examples we are using _lerna_. Hence, "packages" in thi repo is named as _examples_. We also _workspace_ since all the examples will use the same dependencies installed at the _root_.

To run a specific example from the root directory.

1. Make sure you have all the required dependencies installed first.

```
pnpm i --frozen-lockfile
```

2. Then, to run an example named `getting-started`, run the following command from the root directory.

```
npx lerna run dev --scope getting-started
```

For development, we use _tsx_. For production, you can either use _tsc_ or _swc_ to build.

## configuration files

```
tsconfig.json
.swrc
```
