define(["app","services/templatePreloader"],function(e){var t="controller",n="popUpController",r="buttons",i="Alerte",s="btn-success",o="ok",u="btn-warning",a="annuler",f="popUp.html",l="templateUrl",c="lg";e[t](n,["$scope","$modalInstance","title","message",r,function(e,t,n,f,l){e.title=n||i,e.content=f||"Un message !!!!",e[r]=l||[{classes:s,label:o,onClick:function(){return console.log("OK"),!1}},{classes:u,label:a,onClick:function(){return console.log(a),!0}}],e.close=function(e){e?t.dismiss("cancel"):t.close()},e.buttonClicked=function(n){var r=undefined;n&&(r=n(t,e)),e.close(r===!1)}}]).factory("popUpManager",["$modal","templatePreloader",function(e,r){return r(f),service={templateUrl:f,controller:n,warning:function(n,r){return e.open({templateUrl:this[l],controller:this[t],size:c,resolve:{title:function(){return n||i},message:function(){return r},buttons:function(){return[{classes:u,label:o}]}}})},error:function(n,r){return e.open({templateUrl:this[l],controller:this[t],size:c,resolve:{title:function(){return n||"Error"},message:function(){return r},buttons:function(){return[{classes:"btn-danger",label:o}]}}})},confirm:function(n,r,o,a){return e.open({templateUrl:this[l],controller:this[t],size:c,resolve:{title:function(){return n||i},message:function(){return r},buttons:function(){return[{classes:s,label:"Oui",onClick:o},{classes:u,label:"Non",onClick:a}]}}})}}}]);var h={};return h});