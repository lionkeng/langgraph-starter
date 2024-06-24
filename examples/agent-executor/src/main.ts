import {
  AgentAction,
  AgentFinish,
  AgentStep,
  createOpenAIFunctionsAgent,
} from 'langchain/agents'
import { ChatOpenAI } from '@langchain/openai'
import { TavilySearchResults } from '@langchain/community/tools/tavily_search'
import { pull } from 'langchain/hub'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { BaseMessage } from '@langchain/core/messages'
import { ToolExecutor } from '@langchain/langgraph/prebuilt'
import { RunnableLambda, type RunnableConfig } from '@langchain/core/runnables'
import { END, START, StateGraph } from '@langchain/langgraph'
import { unknown } from 'zod'
import { Channel } from 'diagnostics_channel'

const tools = [new TavilySearchResults({ maxResults: 1 })]

async function run() {
  // Get the prompt to use - you can modify this!
  const prompt = await pull<ChatPromptTemplate>(
    'hwchase17/openai-functions-agent'
  )

  // Choose the LLM that will drive the agent
  const llm = new ChatOpenAI({
    modelName: 'gpt-4o',
    temperature: 0,
  })

  // Construct the OpenAI Functions agent
  const agentRunnable = await createOpenAIFunctionsAgent({
    llm,
    tools,
    prompt,
  })

  const agentState = {
    input: {
      value: null,
    },
    steps: {
      value: (x, y) => x.concat(y),
      default: () => [],
    },
    agentOutcome: {
      value: null,
    },
  }

  interface AgentStateBase {
    agentOutcome?: AgentAction | AgentFinish
    steps: Array<AgentStep>
  }

  interface AgentState extends AgentStateBase {
    input: string
    chatHistory?: BaseMessage[]
  }

  const toolExecutor = new ToolExecutor({
    tools,
  })

  // Define logic that will be used to determine which conditional edge to go down
  const shouldContinue = (data: AgentState) => {
    if (data.agentOutcome && 'returnValues' in data.agentOutcome) {
      return 'end'
    }
    return 'continue'
  }

  const runAgent = async (data: AgentState, config?: RunnableConfig) => {
    const agentOutcome = await agentRunnable.invoke(data, config)
    return {
      agentOutcome,
    }
  }

  const executeTools = async (data: AgentState, config?: RunnableConfig) => {
    const agentAction = data.agentOutcome
    if (!agentAction || 'returnValues' in agentAction) {
      throw new Error('Agent has not been run yet')
    }
    const output = await toolExecutor.invoke(agentAction, config)
    return {
      steps: [{ action: agentAction, observation: JSON.stringify(output) }],
    }
  }

  // Define a new graph
  const workflow = new StateGraph({
    channels: agentState,
  })

  // Define the two nodes we will cycle between
  workflow.addNode('agent', new RunnableLambda({ func: runAgent }))
  workflow.addNode('action', new RunnableLambda({ func: executeTools }))

  // Set the entrypoint as `agent`
  // This means that this node is the first one called
  workflow.addEdge(START, 'agent')

  // We now add a conditional edge
  workflow.addConditionalEdges(
    // First, we define the start node. We use `agent`.
    // This means these are the edges taken after the `agent` node is called.
    'agent',
    // Next, we pass in the function that will determine which node is called next.
    shouldContinue,
    // Finally we pass in a mapping.
    // The keys are strings, and the values are other nodes.
    // END is a special node marking that the graph should finish.
    // What will happen is we will call `should_continue`, and then the output of that
    // will be matched against the keys in this mapping.
    // Based on which one it matches, that node will then be called.
    {
      // If `tools`, then we call the tool node.
      continue: 'action',
      // Otherwise we finish.
      end: END,
    }
  )

  // We now add a normal edge from `tools` to `agent`.
  // This means that after `tools` is called, `agent` node is called next.
  workflow.addEdge('action', 'agent')

  const app = workflow.compile()

  const inputs = { input: 'what is the weather in sf' }
  for await (const s of await app.stream(inputs)) {
    console.log(s)
    console.log('----\n')
  }
}

run()
