const fs = require('fs');
const path = require('path');

function searchFiles(dir, searchTerms) {
    let results = [];
    try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            if (file === 'node_modules' || file === '.next' || file === '.git' || file === 'search.js') continue;
            
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                results = results.concat(searchFiles(fullPath, searchTerms));
            } else {
                try {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    const lines = content.split('\n');
                    for (let i = 0; i < lines.length; i++) {
                        const line = lines[i];
                        for (const term of searchTerms) {
                            if (line.toLowerCase().includes(term.toLowerCase())) {
                                results.push({ file: fullPath, line: i + 1, content: line.trim() });
                                break;
                            }
                        }
                    }
                } catch (e) {
                    // skip binary files or unreadable files
                }
            }
        }
    } catch (e) {
        // skip unreadable dirs
    }
    return results;
}

const terms = ['skillsync', 'Team-Building-Platform'];
const matches = searchFiles('.', terms);

console.log(JSON.stringify(matches, null, 2));
