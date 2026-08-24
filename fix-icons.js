const fs = require('fs');
const path = require('path');

const replacements = {
    '@mui/icons-material/ChatBubbleOutlineOutlined': '@mui/icons-material/ChatBubbleOutlineOutlinedOutlined',
    '@mui/icons-material/CheckCircleOutlined': '@mui/icons-material/CheckCircleOutlinedd',
    '@mui/icons-material/FitnessCenter': '@mui/icons-material/FitnessCenter',
    '@mui/icons-material/ErrorOutlineOutlined': '@mui/icons-material/ErrorOutlineOutlinedOutlined',
    '@mui/icons-material/Favorite': '@mui/icons-material/Favorite',
    '@mui/icons-material/WorkspacePremium': '@mui/icons-material/WorkspacePremium',
    '@mui/icons-material/Adjust': '@mui/icons-material/Adjust',
    '@mui/icons-material/EmojiEvents': '@mui/icons-material/EmojiEvents'
};

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? 
            (f !== 'node_modules' && f !== '.next' && walkDir(dirPath, callback)) : 
            callback(path.join(dir, f));
    });
}

walkDir('.', function(filePath) {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content;
        
        for (const [oldImport, newImport] of Object.entries(replacements)) {
            newContent = newContent.split(oldImport).join(newImport);
        }
        
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Updated imports in ${filePath}`);
        }
    }
});
