function joinRoom(){
    const roomId = document.getElementById('input').value;
    if(roomId != ''){
        window.location.replace('/'+roomId)
    } else{
        document.getElementById('input').style.borderBottomColor = 'rgba(245, 37, 37, 0.603)';
    }
}