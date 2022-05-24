const {PurgeCSS} = require('purgecss');
const fs = require('fs');
const path = require('path');

// Custom PurgeCSS extractor for Tailwind that allows special characters in
// class names.
//
// https://github.com/FullHuman/purgecss#extractor
const purgecss = new PurgeCSS();

purgecss.purge("./purgecss.config.js").then(res => {
    res.forEach(out => {
        console.log("Checking ", out.file);
        fs.writeFileSync(path.resolve(__dirname, out.file), out.css, 'utf-8');
    });

    console.log('all selected files have successfully purged.');
}).catch(e => {
    console.log("tailwind purge error", e);
});
