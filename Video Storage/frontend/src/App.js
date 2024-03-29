import React from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import RefreshIcon from '@material-ui/icons/Refresh';
import AddIcon from '@material-ui/icons/Add';
import axios from 'axios';
import FileList from './components/FileList';
import VideoList from './components/VideoList';
import Typography from '@material-ui/core/Typography';
import Thumbnail from './images/blank.png'
import { AzureMP } from "react-azure-mp"

class App extends React.Component {

  interval;

  componentDidMount(){
    document.title = 'Video Storage'
    this.updateVideos();
    this.interval = setInterval(this.updateVideos.bind(this), 30000);
  }

  componentWillUnmount(){
    clearInterval(this.interval);
  }

  constructor(props){
    super(props)
    this.state = {
      choosingFiles: false,
      chosenFiles: [],
      uploading: false,
      videos: [],
      watchingVideo: false,
      videoUrl: '',
      videoTitle: '',
      videoThumbnail: undefined,
      videoSize: '',
      isRefreshing: false
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

  cancelFileHandler = (index) => {
    if(!this.state.uploading){
      const newList = this.state.chosenFiles
      newList.splice(index, 1)
      this.setState({chosenFiles: newList})
    }
  }

  updateVideos = () => {
    if(!this.state.watchingVideo && !this.state.choosingFiles){
      axios.get('http://localhost:8000/getVideos')
      .then((resp) => {
        this.setState({videos: resp.data})
        console.log(this.state.videos)
      })
      .catch((err) => {
        console.log(err)
      })
    }
  }

  refreshHandler = () => {
    this.setState({isRefreshing: true});
    axios.get('http://localhost:8000/getVideos')
    .then((resp) => {
      this.setState({videos: resp.data, isRefreshing: false})
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

  watchVideo = (url, title, thumbnail, size) => {
    let thumb = undefined;
    if(thumbnail) thumb = thumbnail.toString('base64');
    this.setState({
      videoUrl: url,
      videoTitle: title,
      videoThumbnail: thumb,
      videoSize: size,
      watchingVideo: true
    })
  }

  closeVideo = (e) => {
    if(e.target.id == 'video') this.toggleVideoPlayer()
  }

  closeFileChooser = (e) => {
    if(e.target.id == 'uploadFiles') this.toggleUploadMenu()
  }

  toggleUploadMenu = () => {
    this.setState({choosingFiles: !this.state.choosingFiles})
  }

  toggleVideoPlayer = () => {
    this.setState({watchingVideo: !this.state.watchingVideo})
  }

  render(){
    return (
      <div className="App">

        {
          this.state.choosingFiles == true &&
          <div id="uploadFiles" onClick={this.closeFileChooser}>
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
                <FileList list={this.state.chosenFiles} cancelFileFunction={this.cancelFileHandler} />
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

        {
          this.state.watchingVideo == true &&
          <div id="video" onClick={this.closeVideo}>
            <div className="videoHeader">
              <div className="videoInfo">
                <img src={this.state.videoThumbnail != undefined ? `data:image/jpeg;base64,${this.state.videoThumbnail}` : Thumbnail}/>
                <div className="videoTitle">
                  <Typography gutterBottom variant="h5" component="h2">
                    {this.state.videoTitle}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    {this.state.videoSize}
                  </Typography>
                </div>
              </div>
              <Button
                  disabled={this.state.uploading}
                  onClick={this.toggleVideoPlayer}
                  variant="contained"
                  color="default"
                  component="label"
              >
                Close
              </Button>
            </div>
            <div className="videoContainer">
              <AzureMP
                options={{autoplay: true, controls: true}}
                src={[{ src: this.state.videoUrl, type: "application/vnd.ms-sstr+xml" }]}
              />
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
            <Button
              onClick={this.refreshHandler}
              variant="contained"
              color="primary"
              component="label"
              disabled={this.state.isRefreshing}
              startIcon={<RefreshIcon />}
            >
              Refresh
            </Button>
          </div>
          <hr></hr>
          <div className="content">
            <VideoList list={this.state.videos} updateFunction={this.updateVideos} watchFunction={this.watchVideo}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
