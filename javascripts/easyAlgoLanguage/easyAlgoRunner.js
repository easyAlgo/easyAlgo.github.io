/**
 * runner for easyAlgo expression parsed with the easyAlgoParser.js
 */define(["easyAlgoConfiguration","easyAlgoContext","easyAlgoRuntimeException","easyAlgoLanguage/mods/base/runner","easyAlgoLanguage/easyAlgoStopBlockException"],function(e,t,n,r,i){var s="codeDebugger",o="prototype",u="context",a="lines",f="lineProcessor",l="currentLine",c="onEndFunction",h="fatalError",p=!1,d="proccessingChild",v="nextLineHandler",m="push",g="length",y="runNextLine",b="haveFatalError",w=!0,E="blockEnd",S="endOfLineHandler",x="haveARunningChild",T="registerEndFunction",N="isArray",C=" doit être du type ",k="array",L="string",A="number",O="boolean",M="operation",_="type",D="offset",P="isset",H="name",B="indexs",j="function",F="params",I="parameters",q="varname",R="setValue",U="runChildBlock",z="expression",W="commandName",X="defineFunction",V="blockRunner",$=function(e,t,n){this.output=e,this.input=t,this.mods={};var i=r(t,e);for(var o in i)this.mods[o]=i[o];this[s]=n};return $[o].run=function(r,$,J){var K=this.input,Q=this.output,G=e.getFunctions(),Y=e.getSkipedFunction(),Z=0,et=this,tt=0,nt=function(e,t,n,r,i){this[u]=e,this[a]=t,this.parent=n,this[f]=r,this[l]=0,this[c]=[],this[h]=p,this[d]=undefined,this[v]=i||function(e){e()},this.id=tt++};nt[o]={registerEndFunction:function(e){this[c][m](e)},blockEnd:function(e){for(var t=this[c][g]-1;t>=0;t--){var n=this[c][t](e);if(n===p)break}},runLine:function(e,t){Z++;var n=this;try{this[f].runLine(e,this[u],this,function(){t&&t(),n[y]()})}catch(r){r instanceof i?t(r):(this[b](r),Q.error(r),console.log(r))}},haveFatalError:function(e){this[h]=w,this.getParent()?this.getParent()[b](e):this[E](e)},runNextLine:function(){if(this[h]||this.stoped===w)return;this[a][g]==0&&this[S]();if(this[l]<this[a][g]){var e=this,t=this[l]+1,n=this[a][this[l]++];this[v](function(){e.runLine(n,function(t){e[S](t)})},n,this[u])}},haveARunningChild:function(){return this[d]!=undefined},endOfLineHandler:function(e){if(e){this[E](e);return}if(this[l]>=this[a][g])if(!this[x]())this[E]();else{var t=this;this[d][T](function(){t[E]()})}},runChildBlock:function(e,n,r){var s=r!=undefined,o=r||new t(this[u]),c=new nt(o,e,this,this[f],this[v]);this[d]=c;var h=this,p=function(e){if(e&&!s){h[E](e);return}h[d]=undefined;try{n(e?e.returnedValue:undefined)}catch(t){if(t instanceof i){h[E](t);return}throw t}s||h[x]()!==w&&h[l]<h[a][g]&&h[y]()};c[T](p);var m=function(){try{c[y]()}catch(e){e instanceof i&&p(e),h[b](),Q.error(e),console.log(e)}};Z>=500?(Z=0,setTimeout(m,0)):m()},getParent:function(){return this.parent},stop:function(){this[d]&&this[d].stop(),this.stoped=w}};var rt=undefined,it={number:"Nombre","boolean":"Booleen",string:"Chaine",array:"Tableau"},st=function(e,t,r){if(Array[N](t)){var i=[];for(var s in t){i[m](it[t[s]]);try{if(st(e,t[s],r))return w}catch(o){}}throw new n(e+C+i.join(" ou "),r)}if(typeof e==t||t==k&&Array[N](e))return w;throw new n(e+C+(it[t]||t),r)},ot=function(e,t,n,r){switch(n){case"+":if(typeof e==L||typeof t==L)e=ft(e),t=ft(t);return e+t;case"-":return st(e,A,r),st(t,A,r),e-t;case"*":return st(e,A,r),st(t,A,r),e*t;case"/":return st(e,A,r),st(t,A,r),e/t;case"mod":case"%":return st(e,A,r),st(t,A,r),e%t;case">":return e>t;case"<":return e<t;case">=":return e>=t;case"<=":return e<=t;case"==":return e==t;case"<>":case"!=":return e!=t;case"&&":return st(e,O,r),st(t,O,r),e&&t;case"||":return st(e,O,r),st(t,O,r),e||t;default:return undefined}},ut=function(e,t,n){if(e==undefined||e[g]==0){n();return}var r=e[g],i=-1,s=function(){++i;if(i<r){var o=e[i];t(s,o,i)}else n&&n()};s()},at=function(e,r,i,s){if(e==undefined){s();return}if(typeof e==L||typeof e==A||typeof e==O){s(e);return}if(e[M]||e[_]=="comparaison"||e[_]==O){at(e.left,r,i,function(t){if(e[_]==O)if(e[M]=="||"&&t==w||e[M]=="&&"&&t==p){s(t);return}at(e.right,r,i,function(n){var r=ot(t,n,e[M],e[D]);s(r)})});return}if(e[_]=="var"){r[P](e[H],w,e[D]);var o=r.getValue(e[H]);if(e[B]!=undefined&&e[B][g]>0){var a=[];ut(e[B],function(t,s){if(s=="ADD_AT_END")throw new n("Vous devez préciser l'indice de l'element à accéder.",e[D]);at(s,r,i,function(n){a[m](n),st(o,[k,L],e[D]),o=o[n],t()})},function(){s(o)});return}s(o);return}if(e[_]==j){r.issetFunction(e[H],w,e[D]);var f=r.getFunction(e[H]);if(typeof f==j){var l=[];ut(e[F],function(e,t){at(t,r,i,function(t){l[m](t),e()})},function(){var e=f.apply(undefined,l);s(e)});return}if(typeof f=="object"){var c=new t(i[u],e[H]);if(f[I][g]!=e[F][g])throw new n("Le nombre de paramétre n'est pas correcte, la fonction "+espression[H]+" prend "+e[F][g]+" paramètre(s)",e[D]);ut(f[I],function(t,n,s){c.defineVar(n[q],n.vartype),at(e[F][s],r,i,function(e){c[R](n[q],e),t()})},function(){i[U](f.body,function(e){s(e)},c)});return}throw new n("La fonction "+e[H]+" n'existe pas",e[D])}if(e[_]==k){var h=[];ut(e.elements,function(e,t){at(t[z],r,i,function(n){t[H]!=undefined?h[t[H]]=n:h[m](n),e()})},function(){s(h)})}},ft=function(t){if(t==undefined)return"NON_INITIALISEE";if(t===w||t===p)return e.translatedBooleanName[t].toLowerCase();if(Array[N](t)){if(t[g]==0)return"[]";var n="[";for(var r in t)n+=" ",isNaN(r)&&(n+=r+" : "),n+=ft(t[r])+",";return n.substring(0,n[g]-1)+" ]"}return t},lt=function(e,t){return{toString:ft,expression:function(n,r){at(n,e,t,r)},context:e,blockRunner:t}},ct=function(e,t,n,r){return e[W]in et.mods?et.mods[e[W]](e,lt(t,n),r):e[W]=="affectation"?(t[P](e[q][H],w,e[D]),at(e[z],t,n,function(i){e[q][B]==undefined&&st(i,t.getType(e[q][H]),e[z][D]||e[D]);var s=[];ut(e[q][B],function(e,r){at(r,t,n,function(t){s[m](t),e()})},function(){t[R](e[q][H],i,s[g]==0?undefined:s),r&&r()})}),p):w},ht={runLine:function(e,t,n,r){var i=w;if(e[_]&&e[_]=="command")i=ct(e,t,n,r);else if(e[_]&&e[_]=="condition")at(e.test,t,n,function(t){st(t,O,e[D]),t&&e.yes&&e.yes[g]>0?n[U](e.yes,r):e.no&&e.no[g]>0?n[U](e.no,r):r&&r()}),i=p;else if(e[_]&&e[_]=="for")t[P](e[q],w,e[D]),at(e.step,t,n,function(i){var s=i===undefined?1:i;at(e.start,t,n,function(i){var o=i-s;at(e.end,t,n,function(i){t[R](e[q],o);var u=function(){o+=s,o<=i?(t[R](e[q],o),n[U](e.block,u)):r&&r()};u()})})}),i=p;else if(e[_]&&e[_]=="forEach"){var s=e[q],o=(s+"_index").toUpperCase();t[P](s,w,e[D]),t.defineVar(o,"NOMBRE"),at(e[k],t,n,function(i){var u=[];for(var a in i)u[m](a);var f=u[g],a=-1,l=function(){a++;if(a<f){var c=u[a],h=i[c];t[R](o,c),t[R](s,h),n[U](e.block,l)}else r&&r()};l()}),i=p}else if(e[_]&&e[_]=="while"){var u=e.test,a=e.block,f=function(){at(u,t,n,function(e){e===w?n[U](a,f):r&&r()})};f(),i=p}else e[_]&&e[_]==j?(at(e,t,n,function(){r&&r()}),i=p):e[_]&&e[_]==X&&t[X](e[H],e[I],e.body);i&&r&&r()}},pt=J||new t,et=this,dt=this[s]?function(e,t,n){et[s].debug(e,t,n)}:undefined,vt=new nt(pt,r,undefined,ht,dt);this[V]=vt,this[u]=pt,this[s]&&this[s].setRunner(this),$&&vt[T]($),setTimeout(function(){vt[y]()},0)},$[o].stop=function(){this[V]&&this[V].stop()},$[o].addEndHandler=function(e){this[V][T](e)},$});