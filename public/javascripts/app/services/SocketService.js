angular.module("ChatApp.Services")
    .service("SocketService", [
        "$rootScope",
        "$q",
        "$location",
        "$window",
        "$document",
        "$timeout",
        function($rootScope, $q, $location, $window, $document, $t){
            var socket = io.connect();
            var original_title = $document.context.title;
            var window_focus = false;
            var flash_title_timer;
            
            var socketObj = {
                newUser: function(userName){
                    var deferred = $q.defer();
                    userName = userName.replace(/ /g, "_");
                    socket.emit("New User", userName, function(data){
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                },
                broadcastMsg: function(msg){
                    var deferred = $q.defer();
                    socket.emit("New Msg", msg, function(status){
                        deferred.resolve(status);
                    });
                    return deferred.promise;
                },
                logout: function(){
                    var deferred = $q.defer();
                    socket.emit("logout", function(status){
                        deferred.resolve(status);
                    });
                    return deferred.promise;
                },
                blinkWindowTitle: function(msgToBlink){
                    if(!window_focus){
                        clearInterval(flash_title_timer);
                        flash_title_timer = setInterval(function(){
                            if($document.context.title === original_title){
                                $document.context.title = msgToBlink;
                            }else{
                                $document.context.title = original_title;
                            }
                        },1000);
                    }
                }
            };
            
            $($window).on("focus", function(){
                window_focus = true;
                clearInterval(flash_title_timer);
                $t(function(){
                    $document.context.title = original_title;
                },100); 
            });
            
            $($window).on("blur", function(){
                window_focus = false;
            });
            
            socket.on("JustConnected", function(){
                $rootScope.$safeApply($rootScope,function(){
                    $location.path("/newchat");
                });
            });
            
            socket.on("Private", function(msg){
                $rootScope.$safeApply($rootScope,function(){
                    msg.time = new Date().timeNow();
                    $rootScope.chats.push(msg);
                    socketObj.blinkWindowTitle("New Private Msg from: " + msg.name);
                });
            });
            
            socket.on("Private Own", function(msg){
                $rootScope.$safeApply($rootScope,function(){
                    msg.time = new Date().timeNow();
                    $rootScope.chats.push(msg);
                });
            });
            
            socket.on("New Msg", function(msg){
                $rootScope.$safeApply($rootScope,function(){
                    msg.time = new Date().timeNow();
                    $rootScope.chats.push(msg);
                    socketObj.blinkWindowTitle("New Msg from: " + msg.name);
                });
            });
            
            socket.on("New Own Msg", function(msg){
                $rootScope.$safeApply($rootScope,function(){
                    msg.time = new Date().timeNow();
                    $rootScope.chats.push(msg);
                });
            });
                
            socket.on("UpdateUsers", function(users){
                $rootScope.$safeApply($rootScope,function(){
                    $rootScope.users = users;
                });
            });
            
            return socketObj;
        }
    ]);