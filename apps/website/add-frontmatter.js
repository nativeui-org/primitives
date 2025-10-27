const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'content/docs');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md') && f !== 'index.mdx');

const titles = {
  'alert.md': 'Alert',
  'aspect-ratio.md': 'AspectRatio',
  'avatar.md': 'Avatar',
  'checkbox-group.md': 'CheckboxGroup',
  'checkbox.md': 'Checkbox',
  'collapsible.md': 'Collapsible',
  'portal.md': 'Portal',
  'slot.md': 'Slot',
  'switch-group.md': 'SwitchGroup',
  'switch.md': 'Switch',
  'text.md': 'Text',
  'toggle-group.md': 'ToggleGroup',
  'toggle.md': 'Toggle',
  'view.md': 'View',
};

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  const title = titles[file] || file.replace('.md', '');
  const frontmatter = `---
title: ${title}
---

`;
  
  // Check if file already has frontmatter
  if (!content.startsWith('---')) {
    content = frontmatter + content;
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Added frontmatter to ${file}`);
  } else {
    console.log(`Skipped ${file} (already has frontmatter)`);
  }
});

