const fs = require('fs');
const path = require('path');

const scriptTag = '<script src="/dashboard-console-capture.js"></script>';

function injectScript(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('dashboard-console-capture.js')) {
    console.log(`Already injected: ${filePath}`);
    return;
  }
  
  if (content.includes('</head>')) {
    content = content.replace('</head>', `  ${scriptTag}\n  </head>`);
    fs.writeFileSync(filePath, content);
    console.log(`Injected: ${filePath}`);
  }
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.html')) {
      injectScript(filePath);
    }
  });
}

const outDir = path.join(process.cwd(), '.next');
if (fs.existsSync(outDir)) {
  processDirectory(outDir);
  console.log('Console capture script injection complete!');
} else {
  console.log('Build directory not found. Run build first.');
}