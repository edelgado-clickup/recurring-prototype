/**
 * Supernova Component Specifications Fetcher
 * 
 * This script fetches component definitions from Supernova including:
 * - Component properties (sizes, colors, variants)
 * - Field specifications
 * - Documentation
 * - Usage examples
 */

require('dotenv').config();
const { Supernova } = require('@supernovaio/supernova-sdk');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  apiToken: process.env.SUPERNOVA_API_TOKEN,
  workspaceId: process.env.SUPERNOVA_WORKSPACE_ID,
  designSystemId: process.env.SUPERNOVA_DESIGN_SYSTEM_ID,
};

// Validate configuration
function validateConfig() {
  const missing = [];
  if (!config.apiToken) missing.push('SUPERNOVA_API_TOKEN');
  if (!config.workspaceId) missing.push('SUPERNOVA_WORKSPACE_ID');
  if (!config.designSystemId) missing.push('SUPERNOVA_DESIGN_SYSTEM_ID');

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\nPlease update your .env file with the required values.');
    process.exit(1);
  }
}

// Extract component data
function extractComponentData(component) {
  try {
    return {
      id: component.id,
      name: component.name,
      description: component.description || '',
      category: component.category || 'Uncategorized',
      properties: component.properties || [],
      variants: component.variants || [],
    };
  } catch (error) {
    console.warn(`Warning: Could not extract data for component`, error.message);
    return null;
  }
}

// Generate component specification JSON
function generateComponentSpecs(components) {
  const specs = {
    generated: new Date().toISOString(),
    source: 'Supernova Design System',
    components: []
  };

  components.forEach(component => {
    const componentData = extractComponentData(component);
    if (componentData) {
      specs.components.push(componentData);
    }
  });

  return JSON.stringify(specs, null, 2);
}

// Generate TypeScript component interfaces
function generateComponentInterfaces(components) {
  let ts = `/**
 * Component Specifications from Supernova
 * Auto-generated on ${new Date().toISOString()}
 * 
 * This file contains TypeScript interfaces for your design system components
 * including sizes, variants, colors, and other properties.
 */

`;

  components.forEach(component => {
    const componentData = extractComponentData(component);
    if (!componentData) return;

    const safeName = componentData.name.replace(/[^a-zA-Z0-9]/g, '');
    
    ts += `\n/**\n * ${componentData.name}\n`;
    if (componentData.description) {
      ts += ` * ${componentData.description}\n`;
    }
    ts += ` */\n`;

    // Generate properties interface
    if (componentData.properties && componentData.properties.length > 0) {
      ts += `export interface ${safeName}Props {\n`;
      componentData.properties.forEach(prop => {
        if (prop.name) {
          ts += `  /** ${prop.description || prop.name} */\n`;
          ts += `  ${prop.name}?: any;\n`;
        }
      });
      ts += `}\n\n`;
    }

    // Generate variants type
    if (componentData.variants && componentData.variants.length > 0) {
      ts += `export type ${safeName}Variant = \n`;
      const variantNames = componentData.variants.map(v => `  | '${v.name}'`);
      ts += variantNames.join('\n') + ';\n\n';
    }
  });

  ts += `\n// Component specifications object\n`;
  ts += `export const ComponentSpecs = {\n`;
  
  components.forEach((component, index) => {
    const componentData = extractComponentData(component);
    if (!componentData) return;
    
    const safeName = componentData.name.replace(/[^a-zA-Z0-9]/g, '');
    ts += `  ${safeName}: {\n`;
    ts += `    name: '${componentData.name}',\n`;
    ts += `    description: '${componentData.description}',\n`;
    ts += `    category: '${componentData.category}',\n`;
    ts += `  }${index < components.length - 1 ? ',' : ''}\n`;
  });
  
  ts += `} as const;\n`;

  return ts;
}

// Generate component documentation markdown
function generateComponentDocs(components) {
  let md = `# Component Specifications\n\n`;
  md += `> Auto-generated from Supernova on ${new Date().toISOString()}\n\n`;
  md += `This document contains specifications for all components in the design system.\n\n`;

  // Group by category
  const byCategory = {};
  components.forEach(component => {
    const componentData = extractComponentData(component);
    if (!componentData) return;
    
    const category = componentData.category || 'Uncategorized';
    if (!byCategory[category]) {
      byCategory[category] = [];
    }
    byCategory[category].push(componentData);
  });

  Object.keys(byCategory).sort().forEach(category => {
    md += `## ${category}\n\n`;
    
    byCategory[category].forEach(component => {
      md += `### ${component.name}\n\n`;
      
      if (component.description) {
        md += `${component.description}\n\n`;
      }

      if (component.properties && component.properties.length > 0) {
        md += `**Properties:**\n\n`;
        component.properties.forEach(prop => {
          md += `- **${prop.name}**: ${prop.description || 'No description'}\n`;
        });
        md += `\n`;
      }

      if (component.variants && component.variants.length > 0) {
        md += `**Variants:**\n\n`;
        component.variants.forEach(variant => {
          md += `- ${variant.name}\n`;
        });
        md += `\n`;
      }

      md += `---\n\n`;
    });
  });

  return md;
}

// Main function
async function fetchComponents() {
  console.log('🚀 Fetching component specifications from Supernova...\n');
  
  validateConfig();

  try {
    // Initialize Supernova SDK
    console.log('Initializing Supernova SDK...');
    const supernova = new Supernova(config.apiToken);
    
    console.log('✓ Connected to Supernova');
    
    // Fetch workspace
    console.log('Fetching workspace...');
    const workspace = await supernova.workspace(config.workspaceId);
    console.log(`✓ Loaded workspace: ${workspace.name || config.workspaceId}`);
    
    // Fetch design system
    console.log('Fetching design system...');
    const designSystem = await supernova.designSystem(config.designSystemId);
    console.log(`✓ Loaded design system: ${designSystem.name || config.designSystemId}`);
    
    // Fetch the active version
    console.log('Fetching active version...');
    const version = await designSystem.activeVersion();
    console.log(`✓ Loaded version: ${version.name || version.id}`);
    
    // Fetch components
    console.log('Fetching components...');
    const components = await version.components();
    console.log(`✓ Fetched ${components.length} components\n`);

    if (components.length === 0) {
      console.warn('⚠️  No components found in the design system');
      console.log('This might mean:');
      console.log('  - Components haven\'t been added to Supernova yet');
      console.log('  - You need to sync your Figma/design tool with Supernova');
      return;
    }

    // Create output directory
    const outputDir = path.join(__dirname, '../output/components');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate and save component specifications JSON
    const specsContent = generateComponentSpecs(components);
    const specsPath = path.join(outputDir, 'components.json');
    fs.writeFileSync(specsPath, specsContent);
    console.log(`✓ Generated component specs: ${specsPath}`);

    // Generate and save TypeScript interfaces
    const tsContent = generateComponentInterfaces(components);
    const tsPath = path.join(outputDir, 'component-specs.ts');
    fs.writeFileSync(tsPath, tsContent);
    console.log(`✓ Generated TypeScript interfaces: ${tsPath}`);

    // Generate and save documentation
    const docsContent = generateComponentDocs(components);
    const docsPath = path.join(outputDir, 'COMPONENTS.md');
    fs.writeFileSync(docsPath, docsContent);
    console.log(`✓ Generated documentation: ${docsPath}`);

    console.log('\n✅ Component specifications successfully fetched and exported!');
    console.log('\n📋 What you can do now:');
    console.log('  1. Review components.json for full specifications');
    console.log('  2. Use component-specs.ts for TypeScript types');
    console.log('  3. Read COMPONENTS.md for documentation');
    console.log('  4. Build Angular components based on these specs');

    // Display component summary
    console.log('\n📦 Components found:');
    const categories = {};
    components.forEach(c => {
      const data = extractComponentData(c);
      if (data) {
        const cat = data.category || 'Uncategorized';
        categories[cat] = (categories[cat] || 0) + 1;
      }
    });
    
    Object.keys(categories).sort().forEach(cat => {
      console.log(`  ${cat}: ${categories[cat]} component(s)`);
    });

  } catch (error) {
    console.error('\n❌ Error fetching components:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    process.exit(1);
  }
}

// Run the script
fetchComponents();


