var fs = require('fs');

var content = "", toAdd = {};

function includeFiles( path, obj ) {
    
    Object.keys( obj ).forEach(function( file ) {
        if ( obj[ file ] === "js" ) {
            
            content += fs.readFileSync( path + file + '.js', 'utf8') ;
        
            if (toAdd[ file ] !== undefined ) {
      
                toAdd[ file ].forEach(function( item ){
                   
                    content += fs.readFileSync( item + '.js', 'utf8') ;
                      
                })
            }
                               
        } else if ( Array.isArray( obj[ file ] ) ) {
            if (toAdd[ obj[ file ][ 0 ] ] === undefined) {
                toAdd[ obj[ file ][ 0 ] ] = [];
                        
            }
                
            toAdd[obj[ file ][ 0 ] ].push(path + file);
        } else {
            includeFiles( path + file + "/", obj[ file ] );
        }
    });

}

var files = {
    src: {
        core: "js",
        compiler: {
            compiler: "js"
        },
        modules: {
            init: "js",
            tokenizer: {
                constants: "js",
                //    internal: "js",
                token_get_all: "js",
                token_name: "js"
            }
        },
        parser: {
            lexer: "js",
            parser: "js",
            yyn: "js",
            yyn_stmt: "js",
            yyn_expr: "js",
            yyn_scalar: "js",
            //     data: "js",
            ini: "js",
            //   actions: "js",
            rawpost: "js"
        }
    }
};

includeFiles("phpjs/", files );

var wrapper = [
    'define(function(require, exports, module) {\n',
    '\nexports.PHP = PHP;\n});',
];

content = wrapper.join(content);

fs.writeFile('php.js', content, function (err) {
    if (err) throw err;
    console.log('php.js compiled');
});