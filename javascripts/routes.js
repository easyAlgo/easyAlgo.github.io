define([], function()
{
    return {
        defaultRoutePath: '/',
        routes: {
            '/': {
                controller : 'easyAlgoEditor',
                dependencies: [
                    'controllers/easyAlgoEditor',
                    'directives/directives'
                ]
            }
        }
    };
});