function joinRoom(){
    const roomId = prompt('Enter room id')
    if(roomId != null){
        window.location.replace('/'+roomId)
    }
}
