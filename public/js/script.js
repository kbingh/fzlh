

function setUserName(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";

}

function getUserName(cname) {

    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return undefined;
}

$(function(){

    let socket = io();

    socket.username = getUserName("fzlh_chat_username");

    setBtnStatus();

    function setBtnStatus() {

        if(getUserName('fzlh_chat_username') === undefined){
            $("#chatButton").attr("disabled", true);
            $("#txt").attr("disabled",true);
            $('#userNameBtn').text('Set Username');
            $('#txt').attr('placeholder', 'Select username to join chat.');
        }else{
            $("#chatButton").attr("disabled", false);
            $("#txt").attr("disabled",false);
            $('#userNameBtn').text('Change Username');
            $('#txt').attr('placeholder', 'What is on your mind?');
        }
    }

    $("#userNameBtn").on("click", function(){

        let username =   prompt('Please tell me your name');
        setUserName("fzlh_chat_username", username, 5);
        $('#txt').prop("placeholder", "Welcome " + username + "!");
        socket.emit('username', username);
        setUserName("username", username, 360);
        $("#chatButton").attr("disabled", false);
        $("#txt").attr("disabled",false);
        $('#userNameBtn').text('Change Username');

    });

// submit text message without reload/refresh the page
    $('form').submit(function(e){
        e.preventDefault(); // prevents page reloading
        socket.emit('chat_message', $('#txt').val());
        $('#txt').val('');
        setBtnStatus();
        scrollSmoothToBottom('messages');

        return false;
    });
// append the chat text message
    socket.on('chat_message', function(msg){

        console.log(msg);
        $('#messages').append($('<li>').html('<img src="/img/talk.png"><strong>'  + getUserName('fzlh_chat_username') + ": </strong>" + msg));
    });
// append text if someone is online

    function scrollSmoothToBottom (id) {
        let div = document.getElementById(id);
        $('#' + id).animate({
            scrollTop: div.scrollHeight - div.clientHeight
        }, 500);
    }
});


