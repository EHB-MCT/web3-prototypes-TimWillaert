import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Thumbnail from '../images/blank.png'
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import ClearIcon from '@material-ui/icons/Clear';

class Video extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            title: props.item.name,
            editingTitle: false
        }
    }

    deleteVideo = () => {
        axios.put('http://localhost:8000/deleteVideo/' + this.props.item._id)
        .then(res => {
            this.props.updateFunction()
        })
    }

    setThumbnail = (event) => {
        const data = new FormData()
        data.append('file', event.target.files[0])

        axios.post("http://localhost:8000/uploadThumbnail/" + this.props.item._id, data, { 
        }).then(res => {
            console.log(res)
            this.props.updateFunction()
        })
    }

    toggleEditing = (value) =>{
        this.setState({editingTitle: value})
        if(value) this.setState({title: this.props.item.name})
    }

    handleChange = (e) => {
        this.setState({title: e.target.value})
    }

    submitTitle = () => {
        this.props.item.name = this.state.title;
        this.toggleEditing(false)
        axios.post("http://localhost:8000/updateTitle/" + this.props.item._id + "/" + this.state.title);
    }

    render(){
        var card = {
            width: 345,
            marginBottom: 50,
            marginRight: 50
        }
        var image = {
            height: 200,
            width: '100%',
            objectFit: 'cover',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
        }
        var processing = {
            marginTop: 20
        }
        var flex = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
        }

        let thumb;

        if(this.props.item.thumbnail.buffer){
            thumb = this.props.item.thumbnail.buffer.toString('base64')
        }

        return(
            <Card style={card}>
                <CardActionArea onClick={() => {
                    if(this.props.item.urls.length >= 1) this.props.watchFunction(this.props.item.urls[1], this.props.item.name, thumb, this.props.item.size)
                }}>
                    <CardMedia style={image} title={this.props.item.name}>
                        {this.props.item.urls.length >= 1
                            ? <img src={this.props.item.thumbnail.buffer != undefined ? `data:image/jpeg;base64,${thumb}` : Thumbnail} style={image}/>
                            : <div style={flex}>
                                <CircularProgress color="secondary" />
                                <Typography variant="body2" color="textSecondary" component="p" style={processing}>
                                    PROCESSING
                                </Typography>
                            </div>
                        }
                        
                        
                    </CardMedia>
                    </CardActionArea>  
                    <CardContent>
                    <div className="videoName">
                        {
                            this.state.editingTitle
                            ?  <span>
                                <input type="text" value={this.state.title} placeholder={this.props.item.name} onChange={this.handleChange}/>
                                <div className="actions">
                                    <SaveIcon color="action" onClick={this.submitTitle}/>
                                    <ClearIcon color="action" onClick={() => this.toggleEditing(false)}/>
                                </div>
                            </span> 
                            
                            : <span>
                                <Typography gutterBottom variant="h5" component="h2">
                                {this.props.item.name}
                                </Typography>
                                <EditIcon color="action" onClick={() => this.toggleEditing(true)}/>
                            </span> 
                               
                        }
                    </div>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {this.props.item.size}
                     </Typography>
                    </CardContent>
                <CardActions>
                    <Button size="small" color="primary" component="label" disabled={this.props.item.urls < 1}>
                        {this.props.item.thumbnail.buffer != undefined ? 'Change Thumbnail' : 'Set Thumbnail'}
                        <input type="file" accept="image/*" name="file" className="fileupload" onInput={this.setThumbnail} onClick={(event) => event.target.value = null}/>
                    </Button>
                    <Button size="small" color="secondary" onClick={this.deleteVideo} disabled={this.props.item.urls < 1}>
                        Delete
                    </Button>
                </CardActions>
            </Card>
            )
        }
    
}

  export default Video;