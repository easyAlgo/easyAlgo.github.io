define(["app","easyAlgoParser","services/fileSystem","services/templatePreloader","controllers/popUp","controllers/editorInstructionPopUp"],function(app,Parser,fs){var EDITOR_OPTIONS={lineNumbers:!0,tabSize:2,mode:"text/easyAlgo-src",gutters:["CodeMirror-lint-markers","CodeMirror-linenumbers","CodeMirror-foldgutter"],extraKeys:{"Ctrl-Space":"autocomplete"},lint:{async:!0},foldGutter:!0,autoCloseBrackets:!0},terminalWritter={init:function(e,t){this.$scope=e,this.$timeout=t},setCodeMirror:function(e){this.cm=e},abstractWrite:function(e,t){Array.isArray(e)||(e=[e+""]),t=t||"info";var n=this;this.$scope.$broadcast("terminal-output",{output:!0,text:e,breakLine:!1,className:t})},write:function(e){this.abstractWrite(e,"output")},error:function(e){typeof e=="object"&&(e=e.toString(this.cm)),this.abstractWrite(e,"error")},info:function(e){this.abstractWrite(e,"info")}},terminalReader={init:function(e){var t="onCommandInput";this.$scope=e,this[t]=undefined;var n=this;e.$on("terminal-input",function(e,r){var i=r[0];if(n[t]){var s=n[t];n[t]=undefined,s(i.command)}})},setHandler:function(e){this.onCommandInput=e},read:function(e,t){var n="setHandler",r=this;r.$scope.$apply();var i=function(s){!e||e(s)?t(s):r[n](i)};this[n](i)}},toFileName=function(e){return e.replace(/[^a-z0-9\(\)\-]/gi,"_").toLowerCase()};app.controller("easyAlgoEditor",["$scope","$modal","$timeout","$injector","templatePreloader","popUpManager",function($scope,$modal,$timeout,$injector,templatePreloader,popUpManager){terminalWritter.init($scope,$timeout),terminalReader.init($scope),$scope.editorConfiguration=function(e){if(e.options)return e.options;var t={};return angular.copy(EDITOR_OPTIONS,t),t.onLoad=function(t){e.cm=t,t.on("change",function(t,n){$scope.fsSupported&&n.origin!="setValue"&&(e.isSaved=!1,$scope.$apply())})},angular.extend(t.extraKeys,{"Ctrl-S":function(t){$scope.saveAlgo(e)}}),e.options=t,t},$scope.tabs=[],$scope.renamed=function(e){e.renameMode=!1,$scope.fsSupported&&e.filePath&&$scope.renameAlgo(e)},$scope.addTab=function(){var e=!0,t={title:"Algo "+($scope.tabs.length+1),content:"// Algo n°"+($scope.tabs.length+1),active:e,renameMode:e,isSaved:e};return $scope.tabs.push(t),t},$scope.removeTab=function(e){var t=$scope.tabs[e];popUpManager.confirm("Suppression de l'onglet : "+t.title,"Voulez vous vraiment supprimer l'onglet "+t.title+" ?",function(){$scope.tabs.splice(e,1),$scope.fsSupported&&t.filePath&&fs.removeFile(t.filePath)})},$scope.currentTab=function(){return $scope.tabs.filter(function(e){return e.active})[0]},$scope.clearConsole=function(){$timeout(function(){var e=angular.element(document.getElementById("terminal")).scope();e.clear()})},$scope.runAlgo=function(){var e="errors",t=$scope.currentTab(),n=t.content;terminalWritter.setCodeMirror(t.cm),terminalWritter.info("Complilation de l'algorithme : "+t.title);var r=undefined;try{var i=new Parser;result=i.parse(n);if(result[e]&&result[e].length>0){terminalWritter.error("L'algorithme comporte des erreurs!");for(var s in result[e]){var o=result[e][s],u=t.cm.posFromIndex(o.getStart());terminalWritter.error(o+" (ligne : "+(u.line+1)+", colonne : "+u.ch+")")}return}r=result.result}catch(a){terminalWritter.error(["Une erreur est survenue : ",a.toString()]);return}terminalWritter.info("Execution de l'algorithme : "+t.title);var f=require("easyAlgoRunner");f.run(r,terminalWritter,terminalReader,function(){terminalWritter.info("Fin de l'algorithme")})},$scope.downloadAlgo=function(){var e=$scope.currentTab(),t=e.content,n=new Blob([t],{type:"text/plain"});$scope.downloadAlgoUrl=(window.URL||window.webkitURL).createObjectURL(n),$scope.downloadAlgoFileName=toFileName(e.title)},$scope.fileAdded=function(e,t,n){var r="lastIndexOf",i=e.name.substring(e.name[r](".")+1),s="easyAlgo";if(i!=s){popUpManager.warning("Erreur lors de l'ajout de l'algorithme","L'extension du fichier doit être ."+s);return}var o=new FileReader;o.readAsText(e.file),o.onload=function(t){var i=$scope.addTab();i.content=t.target.result,i.title=e.name.substring(0,e.name[r](".")),i.renameMode=!1,n.removeFile(e),$scope.$apply()}};var errorFsHandler=function(){var e=$scope.addTab();e.renameMode=!1,$scope.$apply()};$scope.initAlgos=function(){fs.listDir("algos",function(dirContent){var added=!1,todo=dirContent.length;todo==0&&errorFsHandler();for(var i in dirContent)(function(index,entryFile){fs.readFileEntry(entryFile,function(content){try{var tab={};JSON&&JSON.parse?tab=JSON.parse(content):tab=eval("("+content+")"),tab.renameMode=!1,tab.active=!0,tab.filePath=entryFile.fullPath.slice(1),$scope.tabs.push(tab),$scope.$apply(),added=!0,todo--}catch(e){}todo==0&&!added&&errorFsHandler()})})(i,dirContent[i])},errorFsHandler)},$scope.renameAlgo=function(e){e.filePath?fs.removeFile(e.filePath,function(){e.filePath=undefined,$scope.saveAlgo(e)}):$scope.saveAlgo(e)},$scope.saveAlgo=function(e){var t=e||$scope.currentTab(),n=t.filePath||"algos/"+toFileName(t.title),r=function(){var e={title:t.title,content:t.content};t.filePath=n,t.isSaved=!0,$scope.$apply(),fs.writeFile(n,JSON.stringify(e))};fs.touch(n,r,function(e){(e.name="InvalidModificationError")&&r()})},templatePreloader("editorInstructionPopUp.html"),$scope.openInstructionPopUp=function(){$modal.open({templateUrl:"editorInstructionPopUp.html",controller:"editorInstructionPopUp",size:"lg",resolve:{codeMirror:function(){return $scope.currentTab().cm}}})},$scope.chart={options:{},data:[{value:300,color:"#F7464A",highlight:"#FF5A5E",label:"Red"},{value:50,color:"#46BFBD",highlight:"#5AD3D1",label:"Green"},{value:100,color:"#FDB45C",highlight:"#FFC870",label:"Yellow"}],type:"doughnut"},$scope.fsSupported=!1,fs.isSupported()&&fs.initFs(5242880,function(){fs.mkdir("algos",function(e){$scope.fsSupported=!0,$scope.$apply(),$scope.initAlgos()})},errorFsHandler),$scope.resize=function(){var e="getElementById",t="offsetHeight",n=document[e]("editorPane"),r=document[e]("terminal"),i=window.innerHeight,s=angular.element(document.querySelector(".navbar"))[0];console.log(n[t]),r.style.height=i-s[t]-n[t]-20+"px",r.style.padding=0},$scope.resizeEditor=function(e){var t="getElementById",n="querySelector",r="offsetHeight",i=document[t]("button-list"),s=document[t]("editorPane"),o=document[t]("terminal"),u=window.innerHeight,a=angular.element(document[n](".nav.nav-tabs"))[0],f=angular.element(document[n](".navbar"))[0],l=u-20-f[r]-i[r]-a[r]+"px";o.style.height=0,o.style.padding=0,e.setSize(undefined,l)}}]).service("promptCreator",[function(){var e=function(e){return{text:""}};return e}])});