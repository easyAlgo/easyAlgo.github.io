// a syntaxique validator for easyAlgo
define(["easyAlgoConfiguration","easyAlgoStringStream","easyAlgoContext","easyAlgoLanguage/easyAlgoParseException","easyAlgoLanguage/mods/base/mod"],function(e,t,n,r,i){var s="stream",o="languageRunnerFactory",u="createOffset",a="parseExpression",f="eatSpace",l="operationPriority",c="pos",h="context",p="errors",d="variableNotDefined",v=!1,m="checkEndOfLine",g="parseVarname",y="boolean",b="maybeErrors",w="eatWhile",E="languageInstruction",S="operation",x="length",T=!0,N="booleanOperation",C="backUp",k="parseChild",L="eatEndOfLine",A="eat",O="spaces",M="function",_="parseComparaison",D="forConfig",P="toUpperCase",H="comparaison",B="numberRegex",j="type",F="parseArithmeticalExpression",I="eatWord",q="blocs",R="priority",U="parameters",z="endInstruction",W="varTypes",X="functionMalFormated",V="createArithmetiqueBoolean",$="functionNotDefined",J="issetFunction",K="right",Q="FIN_POUR",G="startLinePos",Y="END_OF_BLOCK",Z="squareNotClosed",et="booleanName",tt="createArithmetique",nt="string",rt="FIN_TANT_QUE",it="parseVarCall",st="parseParameterByType",ot="forMalFormated",ut="parseBooleanOperator",at="textBetween",ft="parseString",lt="result",ct="typeNotExist",ht="defineFunction",pt="push",dt="SI_NON_SI",vt="operationRegex",mt="\n",gt="command",yt="computeErrors",bt=function(){this[l]={"-":1,"+":1,"&&":2,"||":3,"*":0,"/":0,"%":0},this.definedVars={}};bt.prototype={createAffectation:function(e,t,n){return{type:gt,commandName:"affectation",varname:e,expression:t,offset:n}},createVar:function(e,t,n,r){return{type:"var",name:e[P](),offset:r,indexs:t,attribute:n}},createFunctionCall:function(e,t,n,r){return{type:M,name:e.toLowerCase(),params:n,offset:r}},createOperation:function(e,t,n,r,i){if(n&&n[S]&&!n[R]&&this[l][n[S]]>=this[l][e]&&n[j]==r){var s=n;while(s.left.left&&!s.left[R]&&s.left[j]==s[j]&&this[l][s.left[S]]>=this[l][s[S]])s=s.left;return s.left=this[tt](e,t,s.left,i),n}return{type:r,priority:v,operation:e,left:t,right:n,offset:i}},createArithmetique:function(e,t,n,r){return this.createOperation(e,t,n,"numerique",r)},createArithmetiqueBoolean:function(e,t,n,r){if(t[S]&&!t[R]&&this[l][t[S]]>=this[l][e]&&t[j]==y){var i=t;while(i[K][K]&&!i[K][R]&&i[K][j]==i[j]&&this[l][i[K][S]]>=this[l][i[S]])i=i[K];return i[K]=this[V](e,i[K],n,r),t}return{type:y,priority:v,operation:e,left:t,right:n,offset:r}},createComparison:function(e,t,n,r){return{type:H,left:e,right:t,operation:n,offset:r}},createCondition:function(e,t,n,r){return{type:"condition",test:e,yes:t,no:Array.isArray(n)||n==undefined?n:[n],offset:r}},createWhile:function(e,t,n){return{type:"while",test:e,block:t,offset:n}},createFor:function(e,t,n,r,i,s){return{type:"for",varname:e,start:t,end:n,block:i,offset:s,step:r}},createForEach:function(e,t,n,r){return{type:"forEach",varname:e,array:t,block:n,offset:r}},createArray:function(e,t){return{offset:t,elements:e,type:"array"}},createOffset:function(e,t){return e instanceof wt?{begin:e[G],end:e[s][c]}:{begin:e,end:t}},createFunction:function(e,t,n,r){return{type:ht,parameters:t,body:n,name:e,offset:r}},createDefine:function(e,t,n){return{type:gt,commandName:"define",varname:e,vartype:t,offset:n}}};var wt=function(t,r,s){this[o]=r||new bt,this[E]={SI:this.parseIf,TANT_QUE:this.parseWhile,POUR:this.parseFor,DEFINIR_FONCTION:this.parseFunction},this[q]={"if":[dt,"SI_NON","FIN_SI"],"while":[rt],"for":[Q],"function":["FIN_FONCTION"]},this[D]={at:"A",to:"DE","in":"DANS",step:"PAR"},this.writeOutput=e.writeOutput(),this.mods=t||[];var u=this.mods.concat([i]);for(var a in u){var f=u[a]("fr"),l=f.configuration.instructions;for(var a in l)this[E][a]=f.instructions[l[a]]}this.languageWord=["NOMBRE","CHAINE","TABLEAU","BOOLEEN","ECRIRE","DEFINIR","LIRE","SI","TANT_QUE","POUR",dt,"SI_NON","FIN_SI",Q,rt,Q,"A","DE","DANS","PAR"],this[B]=/[0-9]/,this.varnameRegex=/[a-zA-Z0-9_]/,this[vt]=/[+\-*\/%]/,this[O]=/[\ \t]/,this[et]=e.getBooleanName(),this[N]={ET:"&&",OU:"||"},this[W]=e.getVarTypes(),this[Y]="endOfBlock",this[h]=new n(s),this[p]=[]};return wt.prototype={initParser:function(e){e instanceof t?this[s]=e:this[s]=new t(e+mt,4)},checkEndOfLine:function(){this[s][w](this[O]),this[s][A]("/")&&this.parseComment();if(!this[s][L]()&&!this[s].eol()){var e=this[s][c];this[s].skipTo(mt),this[p][pt](new r("errorEndOfLine",undefined,e,this[s][c]))}},parse:function(e,t){this.initParser(e);var n=[],i=this[s][c];while(!this[s].eol())try{var o=this[s][c],u=this.parseLine(t);if(typeof u==nt&&u.indexOf(this[Y])===0)return{endInstruction:u.slice(this[Y][x]+1,u[x]),result:n,errors:this[yt](),context:this[h]};this[m](),u!=undefined&&n[pt](u)}catch(a){if(a instanceof r)this[p][pt](a),a.toThrow=T;else if(a[p])for(var f in a[p])this[p][pt](a[p][f]),a[p][f].toThrow=T;this[s].skipTo(mt)}if(t&&this[p][x]==0)throw new r("blockNotEnded",[t],i,this[s][c]);return{errors:this[yt](),result:n,context:this[h]}},computeErrors:function(){var e=this[p];if(this[b])for(var t in this[b]){var n=this[b][t],r=v;n.msg==d?this[h].isset(n[U][0],v)||(r=T):n.msg==$&&(this[h][J](n[U][0],v)||(r=T)),r&&e[pt](n)}return e},parseLine:function(e){this[G]=this[s][c],this[s][w](this[O]);var t=this[s].next();if(t==undefined||t==mt||t=="\r")return this[s][C](1),undefined;if(t=="/")return this.parseComment();this[s][C](1);var n=this[s][c],i=this[s][I](T);if(i===v)throw new r("lineBeginWithInstruction",undefined,this[G],this[s][c]);if(e&&e.indexOf(i)>=0)return"endOfBlock:"+i;if(i in this[E]){this[s][w](this[O]);var o=this[E][i];return typeof o=="object"?this.parseInstruction(o):o.call(this,i,n)}return this.parseAffectation(i)},parseInstruction:function(e){var t=[0,this[h]];for(var n in e[U]){var i=e[U][n];if(typeof i=="object"){var a=this[s][c],f=this[st](i[j],i.default);i.validator&&i.validator(f,this[o][u](a,this[s][c]))}else var f=this[st](i);if(f==undefined)throw new r(e.badWrittedMessage||"misingParameter",undefined,this);t[pt](f)}t[0]=this[o][u](this);var l=e.runnerFactory;return l.apply(e,t)},parseParameterByType:function(e,t){var n=this[s][c];this[s][A](this[O]);if(this[s][L]())return t!==undefined?(this[s][C](1),t):undefined;if(e==nt){var i=this[s].peek();if(this[s][A]('"')||this[s][A]("'")){var o=this[ft](i);return o}if(t===undefined)throw new r("ParameterMustBeString",undefined,n,this[s][c])}else{if(e=="expression")return this[a]();if(e=="var"){var u=this[g]();return this[h].isset(u,v)||this[p][pt](new r(d,[u],this)),this[it](u,v)}if(e=="varname")return this[g]();if(e=="vartype"){var f=this[s][c],l=this[s][I](T);if(l in this[W])return this[W][l];throw new r(ct,undefined,f,this[s][c])}}return t},parseAffectation:function(e){this[s][C](e[x]);var t=this[s][c],e=this[it](this[g](),v);if(!this[h].isset(e.name,v))throw new r(d,[e.name],t,this[s][c]);this[s][f]();if(!this[s][A]("="))throw new r("affectationHaveNotEquals",undefined,this);var n=this[a]();return this[o].createAffectation(e,n,this[o][u](this))},parseChild:function(e,t){var n=new wt(this.mods,this[o],t||this[h]),r=this[s][c],i=n.parse(this[s],e),u=this[s][c];return t&&t.setRange(r,u),i[h].setRange(r,u),i[p]&&i[p][x]>0&&(t?(this[b]=this[b]||[],this[b]=this[b].concat(i[p])):this[p]=this[p].concat(i[p])),i},parseDefineFunctionParameters:function(){var e=this[s][c],t=this[g]();this[s][w](this[O]);if(!this[s][A](":"))throw new r("paramMalFormated",undefined,e,this[s][c]);this[s][w](this[O]);var n=this[s][c],i=this[s][I](T);if(i in this[W])return this[o].createDefine(t,this[W][i],this[o][u](e,this[s][c]));throw new r(ct,undefined,n,this[s][c])},parseFunction:function(e){var t=this[s][c],i=this[g]();this[h][J](i,v)&&this[p][pt](new r("functionAlreadyDefined",[i],t,this[s][c])),this[s][w](this[O]);if(!this[s][A]("("))throw new r(X,undefined,this);var a=new n(this[h]),l=[];if(!this[s][A](")")){do{this[s][f]();var d=this.parseDefineFunctionParameters();a.defineVar(d.varname,d.vartype),l[pt](d),this[s][f]()}while(this[s][A](";"));if(!this[s][A](")"))throw new r(X,undefined,this)}this[m](),this[h][ht](i,l);var y=this[k](this[q][M],a);return this[o].createFunction(i,l,y[lt],this[o][u](this))},parseIf:function(e,t){if(this[s][L]())throw new r("ifMalFormated",undefined,this);var n=this[a]();this[m]();var i=this[s][c],f=this[k](this[q]["if"]),l=undefined;if(f[z]==this[q]["if"][1]){this[m]();var l=this[k]([this[q]["if"][2]]);l=l[lt]}else f[z]==this[q]["if"][0]&&(l=this.parseIf(e,this[s][c]-f[z][x]));return this[o].createCondition(n,f[lt],l,this[o][u](t,i))},parseWhile:function(e,t){if(this[s][L]())throw new r("whileMalFormated",undefined,this);var n=this[a]();this[m]();var i=this[s][c],f=this[k](this[q]["while"]);return this[o].createWhile(n,f[lt],this[o][u](t,i))},parseFor:function(e,t){if(this[s][L]())throw new r(ot,undefined,this);var n=this[g]();this[h].isset(n,v)||this[p][pt](new r(d,[n],this)),this[s][f]();var i=this[s][I](T);if(i==this[D]["to"]){this[s][f]();var l=this[a]();this[s][f]();var y=this[s][I](T);if(y==this[D]["at"]){var b=this[a](),w=this[s][c];this[s][f]();var E=this[s][I](T),S=undefined;E==this[D]["step"]?S=this[a]():this[s][C](this[s][c]-w),this[m]();var x=this[s][c],N=this[k](this[q]["for"]);return this[o].createFor(n,l,b,S,N[lt],this[o][u](t,x))}}else if(i==this[D]["in"]){this[s][f]();var A=this[a]();this[m](),this[h].defineVar(n+"_INDEX","MIXED");var x=this[s][c],N=this[k](this[q]["for"]);return this[o].createForEach(n,A,N[lt],this[o][u](t,x))}throw new r(ot,undefined)},parseExpression:function(){return this.parseComparaisonExpression()},parseComparaisonOperator:function(){var e=this[s][c],t=undefined;this[s][f](),this[s][A]("<")&&(this[s][A](">")?t="!=":this[s][A]("=")?t="<=":t="<"),this[s][A](">")&&(this[s][A]("=")?t=">=":t=">");if(this[s][A]("=")){if(!this[s][A]("="))throw new r("simpleEqualsInExpression",undefined,e,this[s][c]);t="=="}if(this[s][A]("!")){if(!this[s][A]("="))throw new r("exlamationPrevEquals",undefined,e,this[s][c]);t="!="}return t==undefined&&this[s][C](this[s][c]-e),t},parseBooleanOperator:function(){var e=this[N],t=function(t,n){if(t==undefined)return v;var r=v;t=t[P]();for(var i in e)if(i.charAt(n)==t)return T;return r},n=this[s][c];this[s][f]();var r=this[s].next(),i="";while(t(r,i[x]))i+=r,r=this[s].next();return i=i[P](),i in this[N]?i:(this[s][C](this[s][c]-n),undefined)},parseComparaisonExpression:function(){var e=this[_](),t=this[ut]();while(t!=undefined){this[s][f]();var n=this[s][c],i=this[_]();if(typeof i!=y&&i[j]!=y&&i[j]!=H&&i[j]!=M||typeof e!=y&&e[j]!=y&&e[j]!=H&&e[j]!=M)throw new r("onlyBooleanAreAllow",undefined,n,this[s][c]);e=this[o][V](this[N][t],e,i,n),t=this[ut]()}return e},parseComparaison:function(){var e=this[s][c],t=this[F](),n=this.parseComparaisonOperator();if(n){this[s][f]();var r=this[_]();return this[o].createComparison(t,r,n,this[o][u](e,this[s][c]))}return t},parseArithmeticalExpression:function(){var e=this[s][c],t=this.parsePrimitive(),n=this[s][c];this[s][f]();var i=this[s][A](this[vt]);if(i&&(i!="/"||this[s].peek()!="/"&&this[s].peek()!="*")){this[s][f]();var a=this[F]();if(typeof t==y||typeof a==y)throw new r("booleanNotAllowed",undefined,e,this[s][c]);return this[o][tt](i,t,a,this[o][u](e,this[s][c]))}return this[s][C](this[s][c]-n),t},parsePrimitive:function(){var e=this[s][c];this[s][f]();var t=this[s].next();if(t=="("){if(this[s][A](")"))throw new r("emptyExpression",undefined,this[s][c]);var n=this[s][c],i=this[a]();if(!this[s][A](")"))throw new r("expressionNotEnded",undefined,this[o][u](n,this[s][c]));return i[R]=T,i}if(t=="'"||t=='"')return this[ft](t);if(t=="["){var n=this[s][c];if(this[s][A]("]"))this[s][C](1);else{var l=[];do l[pt](this.parseArrayCell());while(this[s][A](";"))}this[s][f]();if(!this[s][A]("]"))throw new r("arrayDefinitionNotEnded",undefined,this[o][u](n,this[s][c]));return this[o].createArray(l,this[o][u](n,this[s][c]))}this[s][C](1);if(isNaN(t)&&t!="-"){var m=this[g]();if(m in this[et])return this[et][m];var y=this[it](m,T);return y[j]=="var"&&(this[h].isset(y.name,v)||this[p][pt](new r(d,[y.name],y.offset))),y}if(this[B].test(t)||t=="-"){var b=this.parseNumber();return b}throw new r("expressionExpected",undefined,this[o][u](e,this[s][c]))},parseArrayCell:function(){var e=this[s][c];this[s][f]();var t=this[a]();this[s][f]();if(this[s][A](":")){if(typeof t!=nt&&typeof t!="number")throw new r("arrayKeyMustBeString",undefined,this[o][u](e,this[s][c]));this[s][f]();var n=this[a]();return{expression:n,name:t,offset:this[o][u](e,this[s][c])}}return{expression:t,offset:this[o][u](e,this[s][c])}},parseNumber:function(){var e=this[s][A]("-")?-1:1,t=this[s][c];this[s][w](this[B]);var n=this[s][at](t,this[s][c]);if(this[s][A](".")||this[s][A](",")){var t=this[s][c];this[s][w](this[B]);var r=this[s][at](t,this[s][c]);return e*parseFloat(n+"."+r)}return e*parseInt(n,10)},parseVarCall:function(e,t){var n=undefined,i=v,a=[],l=this[s][c];this[s][w](this[O]);var d=this[s][c];if(this[s][A]("(")){if(!t)throw new r("functionNotAllow",undefined,d,this[s][c]);this[s][f](),a=this.parseFunctionParameters();if(!this[s][A](")"))throw new r(Z,["(",")"],d,this[s][c]);i=T}if(this[s][A]("[")){n=[];do n[pt](this.parseVarIndex());while(this[s][A]("["))}return i?(this[h][J](e,v)||this[p][pt](new r($,[e],l-e[x],l)),this[o].createFunctionCall(e,n,a,d)):this[o].createVar(e,n,undefined,this[o][u](l-e[x],l))},parseFunctionParameters:function(){this[s][f]();if(this[s].peek()==")")return[];var e=[];do this[s][f](),e[pt](this[a]()),this[s][f]();while(this[s][A](";"));return e},parseVarname:function(){var e=this[s][c];this[s][w](this.varnameRegex);var t=this[s][at](e,this[s][c])[P]();if(t.trim()[x]==0)throw new r("varnameError",undefined,e,this[s][c]);if(this.languageWord.indexOf(t)>=0)throw this[s][C](this[s][c]-e),new r("varnameErrorLanguage",undefined,e,this[s][c]+t[x]);return t},parseVarIndex:function(){var e=this[s][c];this[s][f]();if(this[s][A]("]"))return"ADD_AT_END";var t=this[a]();if(!this[s][A]("]"))throw new r(Z,["[","]"],e,this[s][c]);return t},parseComment:function(){var e=this[s][c];if(this[s][A]("*")){var t=v;do{t=this[s].skipTo("*");if(!t)throw this[s].skipToEnd(),new r("commentNotEnded",undefined,e-1,this[s][c]);this[s][A]("*"),t=this[s][A]("/")}while(!t)}else this[s][A]("/")&&this[s].skipTo(mt)},parseString:function(e){var t=this[s][c],n=this[s].eatTo(e);if(n===v)throw this[s].skipToEnd(),new r("stringNotEnded",[e],t,this[s][c]);var i=this[s][nt].slice(this[s][c]-1,this[s][c]);return this[s].next(),i=="\\"&&(subStringRead=this[ft](e),n=n.slice(0,n[x]-1)+e+subStringRead),n}},wt});