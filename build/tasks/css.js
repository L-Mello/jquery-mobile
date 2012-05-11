var requirejs = require( 'requirejs' ),
	path = require( 'path' ),
	fs = require( 'fs' );

module.exports = function( grunt ) {
	var config = grunt.config.get( 'global' ),
		regularFile = path.join( config.dirs.output, config.names.root ),
		structureFile = path.join( config.dirs.output, config.names.structure ),
		themeFile = path.join( config.dirs.output, config.names.theme ),
		helpers = config.helpers;

	grunt.config.set( 'css', {
		require: {
			all: {
				cssIn: 'css/themes/default/jquery.mobile.css',
				optimizeCss: 'standard.keepComments.keepLines',
				baseUrl: '.',
				out: regularFile + '.compiled.css'
			},

			structure: {
				cssIn: 'css/structure/jquery.mobile.structure.css',
				out: structureFile + '.compiled.css'
			}
		}
	});

	grunt.registerTask( 'css_without_deps', 'compile and minify the css', function() {
		var done = this.async(), require = grunt.config.get( 'css' ).require;

		helpers.asyncConfig(function( config ) {
			// pull the includes together using require js
			requirejs.optimize( require.all );

			// dump the versioned header into the normal css file
			helpers.write( config.ver.header, regularFile + '.css' );

			// add the compiled css to the normal css file
			helpers.appendFrom( require.all.out, regularFile + '.css' );

			// add the min header into the minified file
			helpers.write( config.ver.min, regularFile + ".min.css" );

			// TODO add minification for all css file

			// pull the includes together using require js
			requirejs.optimize( require.structure );

			// dump the versioned header into the structure css file
			helpers.write( config.ver.header, structureFile + '.css' );

			// add the compiled css to the normal css file
			helpers.appendFrom( require.all.out, structureFile + '.css' );

			// add the min header into the minified file
			helpers.write( config.ver.min, structureFile + ".min.css" );

			// TODO add minification for structure css file

			// dump the versioned header into the theme css file
			helpers.write( config.ver.header, themeFile + '.css' );

			// dump the theme css into the theme css file
			helpers.appendFrom( 'css/themes/default/jquery.mobile.theme.css', themeFile + '.css' );

			// TODO add minification for theme

			// remove the requirejs compile output
			fs.unlink( require.all.out );
			fs.unlink( require.structure.out );

			// TODO cp the theme images
			done();
		});
	});

	grunt.registerTask( 'css', 'init css_without_deps' );
};