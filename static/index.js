$(document).ready(function (){
    var socket = io();
    socket.on('connect', function() {
        socket.send("client connected");
    });


    $('form#sendMsg').submit(function (event){
        var radio = document.getElementsByName("textimage");
        if(radio[0].checked){
            socket.emit("SendContent",{
            content:$('#SendContent').val()
        })
        }else{
            socket.emit("getImg",{
            content:$('#SendContent').val()
        })
        }

        $("#chatContent").append('<li class="chat-item">' +'<img src="static/me.jpg" class="icon-head-gpt"\>' +" "+ '<div class="chat-content-box">'+$('#SendContent').val()+ '</div>'+ '<\li>')
        $('#SendContent').val("")
        return false
    })

    socket.on("messageReceived",function (msg){
        $("#chatContent").append('<li class="chat-item">' +'<img src="static/gpt.jpg" class="icon-head-gpt"\>' +" "+ '<div class="chat-content-box">'+msg.content+ '</div>'+ '<\li>')
    })

    socket.on("imageReceived",function (img){
        console.log(img.content['b64_image'])
        $("#chatContent").append('<li class="chat-item">' +'<img src="static/gpt.jpg" class="icon-head-gpt"\>' +" "+ '<div class="chat-content-box">'+'<img class=“content-image” src='+"data:image/png;base64,"+img.content['b64_image']+'>'+ '</div>'+ '<\li>')
    })

})
