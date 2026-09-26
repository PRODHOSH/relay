const fs = require('fs');
const files = [
  'src/app/api/templates/route.ts',
  'src/app/api/settings/route.ts',
  'src/app/api/logs/route.ts',
  'src/app/api/audiences/route.ts',
  'src/app/api/campaigns/launch/route.ts'
];
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('import { authOptions }')) {
    content = 'import { authOptions } from "@/lib/auth";\n' + content;
  }
  content = content.replace(/await getServerSession\(\)/g, 'await getServerSession(authOptions)');
  fs.writeFileSync(file, content);
});
console.log('Fixed all getServerSession calls');
