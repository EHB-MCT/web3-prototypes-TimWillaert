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

class Video extends React.Component{

    constructor(props){
        super(props)
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

    render(){
        var card = {
            width: 345,
            marginBottom: 50,
            marginRight: 50
        }
        var image = {
            height: 200,
            width: '100%',
            objectFit: 'cover'
        }

        let thumb;

        if(this.props.item.thumbnail.data){
            thumb = this.props.item.thumbnail.data.toString('base64')
        }

        return(
            <Card style={card}>
                <CardActionArea>
                    <CardMedia style={image} title={this.props.item.name}>
                        <img src={this.props.item.thumbnail.data != undefined ? `data:image/jpeg;base64,${thumb}` : Thumbnail} style={image}/>
                    </CardMedia>  
                    <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {this.props.item.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {this.props.item.size}
                     </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Button size="small" color="primary" component="label">
                        {this.props.item.thumbnail.data != undefined ? 'Change Thumbnail' : 'Set Thumbnail'}
                        <input type="file" accept="image/*" name="file" className="fileupload" onInput={this.setThumbnail} onClick={(event) => event.target.value = null}/>
                    </Button>
                    <Button size="small" color="secondary" onClick={this.deleteVideo}>
                        Delete
                    </Button>
                </CardActions>
            </Card>
            )
        }
    
}

  export default Video;