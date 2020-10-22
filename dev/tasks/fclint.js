/*
 * grunt-fclint
 *
 *
 * Copyright (c) 2019 FastCoding Inc.
 * Licensed under the ISC license.
 */

'use strict';

module.exports = function (grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('fclint', 'A multi-task to validate your files', function () {

    var options = this.options({
      dictionary: '.fclintdic',
      spelling: false,
      nodoublebr: false
    });

    if (options.spelling) {

      var spell = require('spell-checker-js');
      spell.load(options.dictionary);

      this.files.forEach(function (f) {

        f.src.filter(function (filepath) {
          if (!grunt.file.exists(filepath)) {
            grunt.log.warn('Source file "' + filepath + '" not found.');
            return false;
          } else {
            return true;
          }
        }).map(function (filepath) {

          var fileContent = grunt.file.read(filepath);
          var output = [];
          if (fileContent.match(/class="(.*?)"/g)) {
            fileContent.match(/class="(.*?)"/g).forEach(function (classnames) {
              classnames.replace('class="', '').replace('"', '').split(' ').forEach(function (classname) {
                output.push(classname);
              });
            });
          }

          var outputUnique = output.filter(function (item, index) {
            return output.indexOf(item) >= index;
          }).sort();

          grunt.log.writeln('# File ' + filepath + ':');

          outputUnique.forEach(function (classname) {
            var spellResult = spell.check(classname);
            if (spellResult.length) {
              grunt.log.warn('Wrong spelling: ' + spellResult[0]);
            }
          });

          // Check if there are double <br> tags
          var fileContentTmp = fileContent.replace(/\s/g, '').replace(/<br\/>/g, '<br>');
          if (fileContentTmp.match(/<br><br>/g)) {
            var errorCount = fileContentTmp.match(/<br><br>/g).length;
            grunt.log.warn('Do not use double <br> tags (Found ' + errorCount + ' errors)');
          }

          // Check if there are no trailing slash
          var hrefList = [];
          if (fileContent.match(/href="(.*?)"/g)) {
            fileContent.match(/href="(.*?)"/g).forEach(function (href) {
              hrefList.push(href);
            });
          }
          var outputHref = hrefList.filter(function (item, index) {
            return hrefList.indexOf(item) >= index;
          }).sort();
          outputHref.forEach(function (href) {
            if (
              /^(.(?!\/"$))+$/.test(href) &&
              /^(?!href="\/\/.*$).*/.test(href) &&
              /^(?!href="#.*$).*/.test(href) &&
              /^(?!href="mailto.*$).*/.test(href) &&
              /^(?!href="tel.*$).*/.test(href) &&
              /^(?!href="http.*$).*/.test(href)
            ) {
              grunt.log.warn('Missing trailing slash: ' + href);
            }
          });

        });

      }); // End forEach

    } // End options.spelling

  });

};
