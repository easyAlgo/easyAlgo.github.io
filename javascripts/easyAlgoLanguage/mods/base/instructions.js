// parser for read and write instruction
// parser return an array with specifique instruction
define(["../../easyAlgoParseException"],function(e){var t="expression",n="toLowerCase",r="outputValues",i="command",s=function(s){return{write:{parameters:[t,{type:"string",validator:function(t,i){t=t[n]();if(!(t in s[r]))throw new e("writeOutput",undefined,i)},"default":"output"}],runnerFactory:function(e,t,o,u){return{type:i,commandName:"write",params:[o],output:s[r][u[n]()],offset:e}},badWrittedMessage:"writeBadWrited"},read:{parameters:["var"],runnerFactory:function(e,t,n){return{type:i,commandName:"read",varname:n,offset:e}},badWrittedMessage:"readBadWrited"},define:{parameters:["varname","vartype"],runnerFactory:function(t,n,r,s){if(n.isset(r,!1))throw new e("variableAlreadyDefined",[r],t);return n.defineVar(r,s),{type:i,commandName:"define",varname:r,vartype:s,offset:t}},badWrittedMessage:"defineBadWrited"},"return":{parameters:[t],runnerFactory:function(e,t,n){return{type:i,commandName:"return",expression:n,offset:e}},badWrittedMessage:"returnBadWrited"}}};return s});