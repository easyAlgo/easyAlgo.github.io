{
	appDir: '../www',
    mainConfigFile : 'javascripts/main.js',
    dir: 'javascripts-builded',
	modules: [
        {
            name: 'app'
        },
        {
            name: 'controllers/easyAlgoEditor',
            exclude: ['app']
        }
    ]
}