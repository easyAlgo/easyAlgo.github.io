define(["easyAlgoRuntimeException","easyAlgoConfiguration"],function(e,t){var n="functions",r="vars",i="childs",s="toUpperCase",o="getParent",u="La variable ",a="toLowerCase",f="formatFunctionName",l="getVar",c="value",h="length",p="ADD_AT_END",d=t.getFunctions(),v=t.getSkipedFunction(),m=function(e,t){e&&e.addChild(this),this.parent=e,this[n]={},this[r]={},this[i]=[],this.from=0,this.to=0,this.contextName=t};return m.prototype={setRange:function(e,t){this.from=e,this.to=t},addChild:function(e){this[i].push(e)},isset:function(t,n,i){t=t[s]();if(t in this[r])return!0;var a=this[o]()&&this[o]().isset(t,n,i);if(!a&&n)throw new e(u+t+" n'est pas definie.",i);return a||!1},formatFunctionName:function(e){function n(e,t){return t?t[s]():""}var t=/[-_]+(.)?/g,e=e.replace(t,n);return Array.indexOf(v,e)>=0?"":e},issetFunction:function(t,r,i){var s=t[a](),u=s in d||s in this[n]||this[f](t)in window||this[o]()&&this[o]().issetFunction(t);if(!u&&r)throw new e("La fonction "+t+" n'existe pas.",i);return u},getVar:function(e){return this[r][e]?this[r][e]:this[o]()?this[o]()[l](e):undefined},getFunction:function(e){var t=e[a]();if(t in d)return d[e];if(t in this[n])return this[n][e];var r=this[f](e);return r in window?window[r]:this[o]()?this[o]().getFunction(e):undefined},getValue:function(e){return this[l](e)[c]},getType:function(e){return this[l](e).type},setValue:function(t,n,r){if(r!=undefined){if(this.getType(t)!="array"&&this.getType(t)!="string")throw new e(u+t+" n'est pas un tableau.");var i=this[l](t);i[c]==undefined&&(i[c]=[]);var s=i[c],o=r[h];if(o>1)for(var a=0;a<o-1;a++){var f=r[a];if(s[f]==undefined||f==p)f==p&&(f=s[h]),s[f]=[];s=s[f]}var d=r[r[h]-1];d==p?s.push(n):s[d]=n}else this[l](t)[c]=n},defineVar:function(e,t){this[r][e]={type:t,value:undefined}},getParent:function(){return this.parent},getAccessibleVars:function(){var e={};if(this[o]()){var t=this[o]().getAccessibleVars();for(var n in t)e[n]=t[n]}for(varName in this[r])e[varName]=this[r][varName].type;return e},getAccessibleFunctions:function(){var e={};if(this[o]()){var t=this[o]().getAccessibleFunctions();for(var r in t)e[r]=t[r]}for(functionName in this[n])e[functionName]=this[n][r];return e},getContextFor:function(e){for(var t in this[i]){var n=this[i][t];if(e>=n.from&&e<=n.to)return n.getContextFor(e)}return this},defineFunction:function(e,t,r){this[n][e[a]()]={parameters:t,body:r}}},m});