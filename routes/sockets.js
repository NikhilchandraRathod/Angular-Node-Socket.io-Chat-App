var io = require("socket.io"),
    S = require("string"),
    users = {};

//For todays date;
Date.prototype.today = function(){ 
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear() 
};

//For the time now
Date.prototype.timeNow = function(){
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
};

var colors = require("./colors").colors;

//var item = items[Math.floor(Math.random()*items.length)];

exports.initialize = function(server){
    io = io.listen(server);
    io.sockets.on("connection", function(socket){
        
        socket.emit("JustConnected");
        
        socket.on("New User", function(userName, callback){
            console.log(colors);
            if(userName in users){
                callback({status: false, userName: "" });
            }else{
                var col = colors[Math.floor(Math.random()*colors.length)];
                callback({ status: true, username: userName });
                socket.color = col;
                socket.userName = userName;
                users[socket.userName] = socket;
                updateUsers();
            }
        });
        
        socket.on("New Msg", function(msg, callback){
            var msg = S(msg).trim().s;
            var isPrivate = msg.substring(0,2);
            if(isPrivate == "/P"){
                msg = S(msg.substring(2)).trim().s;
                var user = msg.substring(0, msg.indexOf(" "));
                if(user in users){
                    msg = S(msg.substring(msg.indexOf(" "))).trim().s;
                    callback(true);
                    users[user].emit("Private",{ name: socket.userName, msg: msg, isPrivate: true, isError: false, isOther: true });
                    users[socket.userName].emit("Private Own",{ name: socket.userName + " → " + user, msg: msg, isPrivate: true, isError: false, isOther: false });
                }else{
                    callback(false);
                    users[socket.userName].emit("Private Own",{ name: socket.userName, msg: "Invalid UserName", isPrivate: false, isError: true, isOther: false });
                }
            }else{user
                callback(true);
                socket.broadcast.emit("New Msg", { name: socket.userName, msg: msg, isPrivate: false, isError: false, isOther: true });
                users[socket.userName].emit("New Own Msg", { name: socket.userName, msg: msg, isPrivate: false, isError: false, isOther: false });
            }
        });
        
        socket.on("logout", function(callback){
            deleteUser();
            callback(true);
        });
        
        socket.on("disconnect", function(){
            deleteUser();
        });
        
        var updateUsers = function(){
            io.sockets.emit("UpdateUsers", Object.keys(users));
        };
        var deleteUser = function(){
            delete users[socket.userName];
            updateUsers();
        };
    });
};