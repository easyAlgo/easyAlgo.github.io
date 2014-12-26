var sys = require('sys')

var exec = require('child_process').exec;
var fs = require('fs');

function install(pack, callback) {
	exec('npm list -g ' + pack, function(error, stdout, stderr){
		if (error) {
			console.log('installation du package ' + pack);
			exec('npm install -g ' + pack,callback);
		} else {
			callback();
		}
	});
}

function buildLessOfHtml(file) {
	fs.readFile(file, 'utf8', function (err,data) {
		if (err) {
			return console.log(err);
		}
		console.log('building ' + file);
		
		var dirs = file.split('/');
		dirs.pop();
		var directory = dirs.join('/');
			
		var regex = /<link.*href="(.*)\.less".*\/>/g;
		var match = undefined;
		var newFile = data;
		while (match = regex.exec(data)) {
			// get file
			var cssFile = match[1];
			var captured = match[0];
			
			buildLess(directory+'/'+cssFile+'.less');
			// remove captured by css file
			newFile = newFile.replace(captured, '<link rel="stylesheet" type="text/css" href="'+cssFile+'.css"/>');
		}
		
		// check for less librairie
		var lessRegex = /<.*less\/dist\/less.*\.js.*>/;
		match = lessRegex.exec(data);
		if (match) {
			newFile = newFile.replace(match[0], '');
		}
		// rewrite the file
		fs.writeFileSync(file, newFile); 
		console.log('file ' + file + ' all less builded.');
	});
}

function buildLess(file) {
	var fileWithoutExt = file.substring(0, file.lastIndexOf('.'));
	console.log('remove ' + file);
	exec('rm ' + fileWithoutExt + '.css', function() {
		console.log('build ' + fileWithoutExt + '.less');
		exec('lessc -x ' + fileWithoutExt + '.less > ' + fileWithoutExt + '.css', function(){
			console.log(file + ' compiled');
			exec('rm ' + fileWithoutExt + '.less');
		});
	});
}

function minify(directory) {
	var files = fs.readdirSync(directory);
    for(var i in files){
        if (!files.hasOwnProperty(i)) continue;
        var name = directory+'/'+files[i];
        if (fs.statSync(name).isDirectory()){
            minify(name);
        } else {
            console.log('minify ' + name);
			exec('uglifyjs -c --overwrite ' + name);
        }
    }
}

function removeNoProd(file, callback) {	
	console.log('remove //$nodeProd on ' + file);
	fs.readFile(file, 'utf8', function (err,data) {
	  if (err) {
		return console.log(err);
	  }
	  
	  // remove all //$noProd line
	  var noProdIndex = data.indexOf('//$noProd');
	  while (noProdIndex >= 0) {
		  var startLine = data.lastIndexOf('\n',noProdIndex);
		  var endLine = data.indexOf('\n',noProdIndex);
		  data = data.substring(0, startLine) + data.substring(endLine);
		  noProdIndex = data.indexOf('//$noProd');
	  }
	  
	  // update the config write
	  // search var config = {
	  var index = data.indexOf('var config = ');
	  var startConfig = data.indexOf('{', index);
	  var endConfig = data.indexOf('};', startConfig);
	  var config = data.substring(startConfig, endConfig + 1);
	  
	  var data = data.substring(0, index) + data.substring(endConfig + 2);
	  
	  // require.require(config) line
	  var requireConfigIndex = data.indexOf('require.config');
	  var endOfLine = data.indexOf('\n', requireConfigIndex);
	  var data = data.substring(0, requireConfigIndex) 
		+ 'require.config('+config+');'
		+ data.substring(endOfLine);	 
	  
	  // update file
	  fs.writeFileSync(file, data); 
	  console.log('//$nodeProd removed on ' + file);
	  callback();
	});	
}


function optimzeRequire(module, callback, exclude) {
	console.log('build : ' + module);
	console.log('r.js.cmd -o name='+module +(exclude ? ' exclude=' + exclude : '')+ ' out='+module+'.js mainConfigFile=main.js');
	exec('r.js.cmd -o name='+module +(exclude ? ' exclude=' + exclude : '')+ ' out='+module+'.js mainConfigFile=main.js', 
		{cwd: __dirname + '/javascripts'}, 
		function(error, data) {
			callback();
		}
	);
}

function removeFile(file) {
	var stats = fs.statSync(file);
	if (stats.isDirectory()) {
		console.log('remove directory ' + file);			
		var files = fs.readdirSync(file);
		for(var i in files) {
		   var definition = removeFile(file+'/'+files[i]);
		}
		fs.rmdirSync(file);
	} else {
		console.log('remove file ' + file);			
		fs.unlinkSync(file);
	}
}

function clearJsDirectory(callback) {
	var toRemove = ['javascripts/terminalEmulator','javascripts/services', 'javascripts/easyAlgoLanguage', 'javascripts/directives', 'javascripts/routes.js'];
	
	for (var i in toRemove) {
		removeFile(toRemove[i]);		
	}
		
	callback();
}

install('less', function(){buildLessOfHtml('views/index.html')});

removeNoProd('javascripts/main.js', function(){
	install('uglify-js@1', function(){
		install('requirejs', function(){
			optimzeRequire('app', function(){
				optimzeRequire('controllers/easyAlgoEditor', function(){
					clearJsDirectory(function(){						
						minify('javascripts');
					});
				}, 'app');
			});
		});	
	});
});

