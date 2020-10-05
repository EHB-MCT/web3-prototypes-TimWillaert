import React from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {todos: [], value: ''}
  }

  handleChange = (event) =>{
    this.setState({value: event.target.value})
  }

  handleEnter = (event) => {
    if(this.state.value != '' && event.key == 'Enter'){
      const newItem = this.state.value
      const newList = this.state.todos
      newList.push(newItem)
      this.setState({todos: newList, value: ''})
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    if(this.state.value != ''){
      const newItem = this.state.value
      const newList = this.state.todos
      newList.push(newItem)
      this.setState({todos: newList, value: ''})
    }
  }

  handleDelete = (index) => {
    const newList = this.state.todos
    newList.splice(index, 1)
    this.setState({todos: newList})
  }

  render(){
    return(
      <div className="App">
        <div className="App-Header">
          <h1>⚛️ To Do List</h1>
          <input type="text" value={this.state.value} onChange={this.handleChange} onKeyPress={this.handleEnter} placeholder="To do.."></input>
          <button onClick={this.handleSubmit}><FontAwesomeIcon icon={faPlus} /> Add item</button>
        </div>
          <TodoList list={this.state.todos} deleteMethod={this.handleDelete}></TodoList>
      </div>
    )
  }
}

function TodoList(props){
  const list = props.list.map((item, index) => <TodoItem key={index} index={index} value={item} deleteMethod={props.deleteMethod}/>)
  return(<ul>{list}</ul>)
}

class TodoItem extends React.Component{

  constructor(props){
    super(props)
    this.state = ({deleted: false, completed: false})
  }

  handleDelete = () => {
    this.setState({deleted: true})
    setTimeout(() => {
      this.setState({deleted: false})
      this.props.deleteMethod(this.props.index)
    }, 500)
  }

  handleComplete = () => {
    this.setState({completed: true})
  }

  render(){
    return(
    <li className= {this.state.deleted ? "deleted" : "", this.state.completed ? "completed" : ""}>
      {this.props.value}
      <div className="operations">
        <div className="complete" onClick={this.handleComplete}>
          <FontAwesomeIcon icon={faCheck} />
        </div>
        <div className="delete" onClick={this.handleDelete}>
          <FontAwesomeIcon icon={faTrash} />
        </div>
      </div>
    </li>
    )
  }
}

export default App;
