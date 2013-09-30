angular.module("ChatApp.Services")
    .service("SocketService", [
        "$rootScope",
        "$q",
        "$location",
        function($rootScope, $q, $location){
            var socket = io.connect();
            
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
                }
            };
            
            socket.on("JustConnected", function(){
                $rootScope.$safeApply($rootScope,function(){
                    $location.path("/newchat");
                });
            });
            
            socket.on("Private", function(msg){
                $rootScope.$safeApply($rootScope,function(){
                    $rootScope.chats.push(msg);
                });
            });
            
            socket.on("New Msg", function(msg){
                $rootScope.$safeApply($rootScope,function(){
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