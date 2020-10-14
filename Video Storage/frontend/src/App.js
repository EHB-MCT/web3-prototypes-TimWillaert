import React from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import AddIcon from '@material-ui/icons/Add';
import axios from 'axios';
import FileList from './components/FileList';
import VideoList from './components/VideoList';

class App extends React.Component {

  componentDidMount(){
    document.title = 'Video Storage'
    this.updateVideos();
  }

  constructor(props){
    super(props)
    this.state = {
      choosingFiles: false,
      chosenFiles: [],
      uploading: false,
      videos: []
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

  updateVideos = () => {
    axios.get('http://localhost:8000/getVideos')
    .then((resp) => {
      this.setState({videos: resp.data})
      console.log(this.state.videos)
    })
    .catch((err) => {
      console.log(err)
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
  
      axios.post("http://localhost:8000/uploadVideo", data, { 
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
            this.updateVideos();
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
                  <input type="file" multiple accept="video/*" name="file" className="fileupload" onInput={this.chooseFileHandler} onClick={(event) => event.target.value = null}/>
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
            <VideoList list={this.state.videos} updateFunction={this.updateVideos} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
