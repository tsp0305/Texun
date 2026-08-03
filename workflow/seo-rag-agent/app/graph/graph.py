from langgraph.graph import StateGraph, END
from app.graph.state import GraphState
from app.graph.nodes import prompt_node, rag_node, writer_node, humanizer_node

def build_graph():
    workflow = StateGraph(GraphState)

    workflow.add_node("prompt_agent", prompt_node)
    workflow.add_node("rag_agent", rag_node)
    workflow.add_node("writer_agent", writer_node)
    workflow.add_node("humanizer_agent", humanizer_node)

    workflow.set_entry_point("prompt_agent")
    workflow.add_edge("prompt_agent", "rag_agent")
    workflow.add_edge("rag_agent", "writer_agent")
    workflow.add_edge("writer_agent", "humanizer_agent")
    workflow.add_edge("humanizer_agent", END)

    return workflow.compile()

compiled_graph = build_graph()