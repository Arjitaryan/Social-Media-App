class ChatEngine{
    constructor(chatBoxId, userEmail, userName, userAvatar){
        this.chatBox= $(`#${chatBoxId}`);
        this.userEmail= userEmail;
        this.userName= userName;
        // this.userAvatar= userAvatar;
        this.socket= io.connect('http://localhost:5000');

        if(this.userEmail){
            this.connectionHandler();
        }
    }

    connectionHandler(){

        let self= this;
        this.socket.on('connect', function(){
            console.log('connection establised using sockets');

            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chatroom: 'sampleChatRoom'
            });

            self.socket.on('user_joined', function(data){
                // console.log("a user joined", data);
                console.log("a user joined");
            });
        });


        $('#send-message').click(function(){
            let msg= $('#chat-message-input').val();
            // $('#chat-message-input').val()= "";
            document.getElementById('chat-message-input').value= '';
            // $('#chat-message-input').value= '';
            
            if(msg!= ''){
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    user_name: self.userName,
                    // user_avatar: self.userAvatar,
                    chatroom: 'sampleChatRoom'
                })
            }
        });
        
        self.socket.on('receive_message', function(data){
            // console.log("message received", data.message);
            console.log("message received");
            
            let newMessage= $('<li>');
            let messageType= 'other-message';
            
            if(data.user_email == self.userEmail)
            {
                messageType= 'self-message';
            }
            
            newMessage.append($('<sub>', {
                // 'html' : `<img src= ${data.user_avatar}> ${data.user_name}`
                'html': data.user_name
            }));
            
            newMessage.append('<br>');
            
            newMessage.append($('<span>', {
                'html': data.message
            }));
            
            
            newMessage.addClass(messageType);
            
            $('#chat-messages-list').append(newMessage);

            let messageContainer= document.getElementById('chat-messages-list');
            messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
        });
    }
}