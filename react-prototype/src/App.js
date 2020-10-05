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
      const newItem = {value: this.state.value, completed: false}
      this.setState({todos: this.state.todos.concat(newItem), value: ''})
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    if(this.state.value != ''){
      const newItem = {value: this.state.value, completed: false}
      this.setState({todos: this.state.todos.concat(newItem), value: ''})
    }
  }

  render(){
    return(
      <div className="App">
        <div className="App-Header">
          <h1>⚛️ To Do List</h1>
          <input type="text" value={this.state.value} onChange={this.handleChange} onKeyPress={this.handleEnter} placeholder="To do.."></input>
          <button onClick={this.handleSubmit}><FontAwesomeIcon icon={faPlus} /> Add item</button>
        </div>
          <TodoList list={this.state.todos}></TodoList>
      </div>
    )
  }
}

function TodoList(props){
  const list = props.list.map((item, index) => <TodoItem key={index} value={item.value} />)
  return(<ul>{list}</ul>)
}

function TodoItem(props){
  return(
    <li>
      {props.value}
      <div className="operations">
        <div className="complete" >
          <FontAwesomeIcon icon={faCheck} />
        </div>
        <div className="delete" >
          <FontAwesomeIcon icon={faTrash} />
        </div>
      </div>
    </li>
  )
}

export default App;
