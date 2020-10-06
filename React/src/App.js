import React from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
var classNames = require('classnames');

class App extends React.Component {

  componentDidMount(){
    document.title = 'To Do List'
  }

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
      const newList = this.state.todos
      newList.unshift(newItem)
      this.setState({todos: newList, value: ''})
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    if(this.state.value != ''){
      const newItem = {value: this.state.value, completed: false}
      const newList = this.state.todos
      newList.unshift(newItem)
      this.setState({todos: newList, value: ''})
    }
  }

  handleDelete = (index) => {
    const newList = this.state.todos
    newList.splice(index, 1)
    this.setState({todos: newList})
  }

  handleComplete = (index) => {
    const newList = Array.from(this.state.todos)

    let lastCompleted = newList.find(obj => obj.completed == true);

    const newItem = newList[index]
    newItem.completed = true

    if(index + 1 == newList.length){
      newList[index] = newItem
    } else if(lastCompleted != undefined){
      newList.splice(index, 1)
      let newIndex = newList.indexOf(lastCompleted)
      newList.splice(newIndex, 0, newItem)
    } else{
      newList.splice(index, 1)
      newList.push(newItem)
    }

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
          <TodoList list={this.state.todos} deleteMethod={this.handleDelete} completeMethod={this.handleComplete}></TodoList>
      </div>
    )
  }
}

function TodoList(props){
  const list = props.list.map((item, index) => <TodoItem key={index} index={index} item={item} deleteMethod={props.deleteMethod} completeMethod={props.completeMethod}/>)
  return(<ul>{list}</ul>)
}

class TodoItem extends React.Component{

  constructor(props){
    super(props)
    this.state = ({deleted: false})
  }

  handleDelete = () => {
    this.setState({deleted: true})
    setTimeout(() => {
      this.setState({deleted: false})
      this.props.deleteMethod(this.props.index)
    }, 300)
  }

  handleComplete = () => {
    this.props.completeMethod(this.props.index)
  }

  render(){
    var classes = classNames({
      'deleted': this.state.deleted,
      'completed': this.props.item.completed
    })
    return(
    <li className={classes}>
      {this.props.item.value}
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
