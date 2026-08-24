const fs = require('fs');
const path = require('path');

const iconMap = {
    'Calendar': 'CalendarMonth',
    'Clock': 'AccessTime',
    'ShieldCheck': 'GppGood',
    'XCircle': 'Cancel',
    'MessageSquare': 'ChatBubbleOutline',
    'ChevronLeft': 'ChevronLeft',
    'ChevronRight': 'ChevronRight',
    'Phone': 'Phone',
    'Mail': 'Email',
    'MapPin': 'LocationOn',
    'MessageCircle': 'Chat',
    'LogOut': 'Logout',
    'Menu': 'Menu',
    'CalendarIcon': 'CalendarMonth',
    'LayoutGrid': 'GridView',
    'MoreVertical': 'MoreVert',
    'ShieldAlert': 'GppBad',
    'Plus': 'Add',
    'Trash2': 'Delete',
    'ArrowLeft': 'ArrowBack',
    'KeyRound': 'VpnKey',
    'CheckCircle2': 'CheckCircleOutline',
    'Camera': 'CameraAlt',
    'Save': 'Save',
    'DollarSign': 'AttachMoney',
    'Pencil': 'Edit',
    'Globe': 'Language',
    'Search': 'Search',
    'List': 'FormatListBulleted',
    'ArrowRight': 'ArrowForward',
    'Filter': 'FilterList',
    'Lock': 'Lock',
    'AlertCircle': 'ErrorOutline',
    'Eye': 'Visibility',
    'EyeOff': 'VisibilityOff',
    'LayoutDashboard': 'Dashboard',
    'Ticket': 'ConfirmationNumber',
    'Users': 'Group',
    'CalendarDays': 'CalendarToday',
    'Settings': 'Settings',
    'X': 'Close',
    'Shield': 'Security',
    'Check': 'Check',
    'ChevronLeftIcon': 'ChevronLeft',
    'ChevronRightIcon': 'ChevronRight',
    'ChevronDownIcon': 'ExpandMore',
    'XIcon': 'Close',
    'CircleCheckIcon': 'CheckCircle',
    'InfoIcon': 'Info',
    'TriangleAlertIcon': 'Warning',
    'OctagonXIcon': 'DoNotDisturbOn',
    'Loader2Icon': 'Autorenew'
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
        
        if (content.includes('lucide-react')) {
            // Find the import statement
            const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"];?/g;
            let match;
            let usedIcons = [];
            while ((match = importRegex.exec(content)) !== null) {
                const iconsStr = match[1];
                const icons = iconsStr.split(',').map(i => i.trim()).filter(i => i);
                usedIcons.push(...icons);
            }
            
            if (usedIcons.length > 0) {
                // Replace imports
                let muiImports = [];
                usedIcons.forEach(icon => {
                    let alias = '';
                    let cleanIcon = icon;
                    if (icon.includes(' as ')) {
                        let parts = icon.split(' as ');
                        cleanIcon = parts[0].trim();
                        alias = parts[1].trim();
                    }
                    
                    let mappedIcon = iconMap[cleanIcon] || cleanIcon;
                    if (alias) {
                        // For MUI, it's a default export, so we can do:
                        // import alias from '@mui/icons-material/mappedIcon';
                        muiImports.push(`import ${alias} from '@mui/icons-material/${mappedIcon}';`);
                    } else {
                        muiImports.push(`import ${cleanIcon} from '@mui/icons-material/${mappedIcon}';`);
                    }
                });
                
                let newContent = content.replace(importRegex, muiImports.join('\n'));
                
                fs.writeFileSync(filePath, newContent, 'utf8');
                console.log(`Updated ${filePath}`);
            }
        }
    }
});
