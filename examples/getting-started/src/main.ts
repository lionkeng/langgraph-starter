import { ChatOpenAI } from '@langchain/openai'
import { END, MessageGraph, START } from '@langchain/langgraph'
import { BaseMessage, HumanMessage } from '@langchain/core/messages'

const model = new ChatOpenAI({ temperature: 0 })

const graph = new MessageGraph()
const node: string = 'oracle'
graph.addNode(node, async (state: BaseMessage[]) => {
  return model.invoke(state)
})

graph.addEdge(node as unknown as '__start__', END)
graph.addEdge(START, node as unknown as '__end__')

const runnable = graph.compile()

async function run() {
  const res = await runnable.invoke(new HumanMessage('What is 1 + 1?'))
  // Add any further code here that depends on the result
  console.log(res)
}

run()
