# langgraph-starter

You can use this repo as a basic template with all the tooling to start a nodeJS project with Typescript and Langgraph.

This is a mono-repo created to explore [langgraphJS](https://github.com/langchain-ai/langgraphjs). Examples in the Langgraph repo are provided as Jupyter notebooks. In this repo, we are hashing out (similar) examples but with all the tooling to run them as nodeJS scripts.

## tooling

- pnpm
- typescript
- tsx
- tsc
- swc
- lerna

## getting started

For simplicity in maintaining this as a mono-repo with multiple possible examples we are using _lerna_. Hence, "packages" in this repo is named as _examples_. Since all the examples will use the same dependencies, we are installing all the dependencies at the _workspace_ / _root_ level.

To run a specific example from the root directory.

1. Make sure you have all the required dependencies installed first.

```
pnpm i --frozen-lockfile
```

2. Create a .env file

All the examples here use the OpenAI LLM models. Make sure you have an API key with OpenAI.

```bash
OPENAI_API_KEY=<Your_OPENAI_API_KEY>
```

In some examples, you will also need an API KEY from [Tavily Search](https://tavily.com/)

```bash
TAVILY_API_KEY=<Your_TAVILY_API_KEY>
```

3. Then, to run the named examples, use lerna from the root directory. For example, to run the example `getting-started`, run the following command from the root directory.

```bash
npx lerna run dev --scope getting-started
```

If you prefer to run the examples with _node_, do the following instead. First, transpile the typescript code.

```bash
npx lerna run build-swc --scope getting-started
```

Then, to run the example, execute the following script:

```bash
npx lerna run start --scope getting-started
```

## configuration files

```
tsconfig.json
.swrc
```
