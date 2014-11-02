// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
Array.indexOf||(Array.indexOf=[].indexOf?function(e,t,n){return e.indexOf(t,n)}:function(e,t,n){var r=e.length,i=n?parseInt(1*n+(n<0?r:0),10):0;i=i<0?0:i;for(;i<r;i++)if(i in e&&e[i]===t)return i;return-1}),function(e){var t="object",n="codemirror/lib/codemirror";typeof exports==t&&typeof module==t?e(require(n)):typeof define=="function"&&define.amd?define([n,"easyAlgoConfiguration","easyAlgoParser"],e):e(CodeMirror)}(function(e,t,n){"use strict";function T(e){var t={},n=e.split(" ");for(var r=0;r<n[s];++r)t[n[r]]=i;return t}function N(o,u){function f(e){if(e)for(var t in e)e.hasOwnProperty(t)&&a.push(t)}typeof o==m&&(o=[o]);var a=[];f(u.keywords),f(u.builtin),f(u.atoms);if(a[s]){u.helperType=o[0];var c="",v=undefined;e.registerHelper("hint",r,function(o,u){function N(e,t){var n=y[m].trim()[l]();if(n[s]>0&&e[d](n)==-1)return;Array[d](T,e)==-1&&(T.push(e),b.push({text:e,hint:function(e,n,i){var o=e.getMode({},r),u=e.getRange(f(g[w],0),f(g[w],y[E]));u.trim()[s]==0?y[E]=o.indent(y[S],i.text):y[m].trim()==0&&(y[E]+=1),e.replaceRange(i.text.toLowerCase()+(t?"()":""),f(g[w],y[E]),f(g[w],y.end),"complete")}}))}var f=e.Pos,g=o.getCursor(),y=o.getTokenAt(o.getCursor()),b=[],T=[];if(C[y[S][p][h]])for(var k in C[y[S][p][h]])N(C[y[S][p][h]][k]);for(var k in a)N(a[k]);var L=t.getFunctions();for(var k in L)N(k[l](),i);var A=new n;if(c!=o[x]()){var O=A.parse(o[x]()),M=o.indexFromPos(g);c=o[x](),v=O[p]}var _=v.getContextFor(M),D=_.getAccessibleVars();for(var k in D)N(k);var P=_.getAccessibleFunctions();for(var k in P)N(k,i);return{list:b,from:f(g[w],y[E]),to:f(g[w],y.end)}})}for(var g=0;g<o[s];++g)e.defineMIME(o[g],u)}var r="easyAlgo",i=!0,s="length",o=!1,u="tokenize",a="eatWhile",f="comment",l="toUpperCase",c="propertyIsEnumerable",h="blockName",p="context",d="indexOf",v=null,m="string",g="indented",y="align",b="statement",w="line",E="start",S="state",x="getValue";e.defineMode(r,function(e,t){function H(e,t){D=o,P=o;var n=e.next();if(n=='"'||n=="'")return t[u]=B(n),t[u](e,t);if(/\d/.test(n))return e[a](/[\w\.\,]/),"number";if(n=="/"){if(e.eat("*"))return t[u]=j,j(e,t);if(e.eat("/"))return e.skipToEnd(),f}if(L.test(n))return e[a](L),"operator";e[a](/[\w\$_]/);var r=e.current();return r=r[l](),S[c](r)?(T[c](r)&&(D=i),T[c](t[p][h])&&T[t[p][h]][d](r)>=0&&(P=i),"keyword"):N[c](r)?"atom":"variable"}function B(e){return function(t,n){var r=o,s,a=o;while((s=t.next())!=v){if(s==e&&!r){a=i;break}r=!r&&s=="\\"}if(a||!r&&!k)n[u]=v;return m}}function j(e,t){var n=o,r;while(r=e.next()){if(r=="/"&&n){t[u]=v;break}n=r=="*"}return f}function F(e,t,n,r,i,s,o){this[g]=e,this.column=t,this.type=n,this[y]=r,this.prev=i,this[h]=s,this.vars=o||[]}function I(e,t,r,i){var s=e[g];return r==b&&(s=(e[p]?e[p][g]:0)+n),e[p]=new F(s,t,r,v,e[p],i)}function q(e){return e[p]=e[p].prev}var n=e.indentUnit,w=t.statementIndentUnit||n,E=t.dontAlignCalls,S=t.keywords||{},x=t.builtin||{},T=t.blockKeywords||{},N=t.atoms||{},C=t.hooks||{},k=i,L=/[+\-*&%=<>!?|\/]/,A="";for(var O in T)for(var M in T[O])A+=T[O][M]+"|";A=A.substring(0,A[s]-1);var _=new RegExp(A,"i"),D,P;return{startState:function(e){return{tokenize:v,context:new F(0,0,"top",o),indented:0,startOfLine:i}},token:function(e,t){var n=t[p];e.sol()&&(n[y]==v&&(n[y]=o),t[g]=e.indentation(),t.startOfLine=i);if(e.eatSpace())return v;var r=(t[u]||H)(e,t);return n[y]=n[y]||i,P&&q(t),D&&I(t,e.column(),b,e.current()[l]()),r},indent:function(e,t){var r=e[p][h]?e[p][h][l]():"",i=e[p][g],o=t[d](" ");o==-1&&(o=t[s]);var u=t.substring(0,o);return T[r]&&T[r][d](u[l]())>=0&&(i-=n,i<0&&(i=0)),i||0},electricInput:_,blockCommentStart:"/*",blockCommentEnd:"*/",lineComment:"//",fold:r}});var C=t.getStartToEndBlock();N(["text/easyAlgo-src"],{name:r,keywords:T("LIRE ECRIRE SI SI_NON SI_NON_SI FIN_SI POUR DE A DANS PAR FIN_POUR TANT_QUE FIN_TANT_QUE DEFINIR ET OU DEFINIR_FONCTION FIN_FONCTION RETOURNER"),blockKeywords:C,atoms:T("NOMBRE CHAINE BOOLEEN TABLEAU VRAI FAUX VIDE")})});