import React from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import AddIcon from '@material-ui/icons/Add';
import axios from 'axios';
import LinearProgress from '@material-ui/core/LinearProgress';

const filesize = window.filesize;

class App extends React.Component {

  componentDidMount(){
    document.title = 'Video Storage'
  }

  constructor(props){
    super(props)
    this.state = {
      choosingFiles: false,
      chosenFiles: [],
      uploading: false
    }
  }

  chooseFileHandler = (event) => {
    const newList = this.state.chosenFiles

    for(let i = 0; i < event.target.files.length; i++){
      const newItem = {file: event.target.files[i], progress: 0}
      newList.push(newItem)
    }

    this.setState({
      chosenFiles: newList
    })
    
  }

  uploadFilesHandler = () => {
    this.setState({
      uploading: true
    })

    const newList = this.state.chosenFiles

    for(let i = 0; i < newList.length; i++){
      const data = new FormData();

      data.append('file', newList[i].file)
  
      axios.post("http://localhost:8000/upload", data, { 
        onUploadProgress: ProgressEvent => {
          const updatedProgress = newList[i];
          updatedProgress.progress = (ProgressEvent.loaded / ProgressEvent.total*100)
          newList[i] = updatedProgress
          this.setState({
            chosenFiles: newList
          })
        }
      }).then(res => { 
        const isFinished = (value) => value.progress == 100
        if(this.state.chosenFiles.every(isFinished)){
          setTimeout(() => {
            this.setState({
              choosingFiles: false,
              chosenFiles: [],
              uploading: false
            })
          }, 3000)
        }
      })
    }

    this.setState({
      chosenFiles: newList
    })
  }

  toggleUploadMenu = () => {
    this.setState({choosingFiles: !this.state.choosingFiles})
  }

  render(){
    return (
      <div className="App">

        {
          this.state.choosingFiles == true &&
          <div id="uploadFiles">
            <div className="uploadFilesContainer">
              <div className="uploadFilesTopContainer">
                <Button
                  disabled={this.state.uploading}
                  variant="contained"
                  color="default"
                  component="label"
                  startIcon={<AddIcon />}
                >
                  Add files
                  <input type="file" multiple name="file" className="fileupload" onInput={this.chooseFileHandler} onClick={(event) => event.target.value = null}/>
                </Button>
              </div>
              <hr/>
              <div className="uploadFilesListContainer">
                <FileList list={this.state.chosenFiles} />
              </div>
              <hr/>
              <div className="uploadFilesBottomContainer">
                <Button
                  disabled={this.state.uploading}
                  onClick={this.toggleUploadMenu}
                  variant="contained"
                  color="default"
                  component="label"
                >
                  Close
                </Button>
                <Button
                  disabled={this.state.chosenFiles.length < 1 || this.state.uploading}
                  onClick={this.uploadFilesHandler}
                  variant="contained"
                  color="primary"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload
                </Button>
              </div>
            </div>
          </div>
        }

        <div id="main">
          <div className="header">
            <Button
              onClick={this.toggleUploadMenu}
              variant="contained"
              color="default"
              component="label"
              startIcon={<CloudUploadIcon />}
            >
              Upload videos
            </Button>
          </div>
          <hr></hr>
          <div className="content">

          </div>
        </div>
      </div>
    );
  }
}

function FileList(props){
  const list = props.list.map((item, index) => <File key={index} index={index} item={item}/>)
  return(<ul>{list}</ul>)
}

class File extends React.Component{

  constructor(props){
    super(props)
    this.state = ({deleted: false})
  }

  render(){

    var style = {
      width: this.props.item.progress + '%'
    }

    return(
      <li>
        <div className="fileName">
          {this.props.item.file.name}
        </div>
        <div className="fileSize">
          {filesize(this.props.item.file.size)}
        </div>
        <div className="fileProgress">
          <span style={style} className={ this.props.item.progress == 100 ? 'greenFile' : '' }></span>
        </div>
      </li>
    )
  }

}

export default App;
