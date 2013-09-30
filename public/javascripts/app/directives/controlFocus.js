angular.module("ChatApp.Directives")
    .directive("controlFocus",[
        "$timeout",
        function($t){
            return {
                restrict: "A",
                link: function(scope, element, attrs){
                    attrs.$observe("controlFocus",function(newValue){
                        newValue === 'true' && element[0].focus();
                    });
                }
            }
        }
    ]);