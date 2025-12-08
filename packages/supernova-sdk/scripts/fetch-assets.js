/**
 * Supernova Assets Fetcher
 * Fetch icons, images, and other assets from Supernova
 */

require('dotenv').config();
const { Supernova } = require('@supernovaio/supernova-sdk');
const fs = require('fs');
const path = require('path');
const https = require('https');

const config = {
  apiToken: process.env.SUPERNOVA_API_TOKEN,
  workspaceId: process.env.SUPERNOVA_WORKSPACE_ID,
  designSystemId: process.env.SUPERNOVA_DESIGN_SYSTEM_ID,
};

function validateConfig() {
  const missing = [];
  if (!config.apiToken) missing.push('SUPERNOVA_API_TOKEN');
  if (!config.workspaceId) missing.push('SUPERNOVA_WORKSPACE_ID');
  if (!config.designSystemId) missing.push('SUPERNOVA_DESIGN_SYSTEM_ID');

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    process.exit(1);
  }
}

async function downloadAsset(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function fetchAssets() {
  console.log('🚀 Fetching assets from Supernova...\n');
  
  validateConfig();

  try {
    const supernova = new Supernova(config.apiToken);
    console.log('✓ Connected to Supernova');
    
    const workspace = await supernova.workspace(config.workspaceId);
    console.log(`✓ Loaded workspace: ${workspace.name || config.workspaceId}`);
    
    const designSystem = await supernova.designSystem(config.designSystemId);
    console.log(`✓ Loaded design system: ${designSystem.name || config.designSystemId}`);
    
    const version = await designSystem.activeVersion();
    console.log(`✓ Loaded version: ${version.name || version.id}`);
    
    // Fetch assets
    console.log('Fetching assets...');
    const assets = await version.assets();
    console.log(`✓ Found ${assets.length} assets\n`);

    if (assets.length === 0) {
      console.warn('⚠️  No assets found in the design system');
      console.log('Assets might need to be synced from Figma to Supernova');
      return;
    }

    // Create output directory
    const outputDir = path.join(__dirname, '../output/assets');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate asset manifest
    const manifest = {
      generated: new Date().toISOString(),
      source: 'Supernova Design System',
      assets: []
    };

    // Process each asset
    let downloadCount = 0;
    for (const asset of assets) {
      try {
        const assetData = {
          id: asset.id,
          name: asset.name,
          description: asset.description || '',
          type: asset.assetType || 'unknown',
        };

        // Get asset URLs
        if (asset.thumbnailUrl) {
          assetData.thumbnailUrl = asset.thumbnailUrl;
        }
        
        // Try to download SVG if available
        if (asset.svgUrl) {
          const filename = `${asset.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.svg`;
          const filepath = path.join(outputDir, filename);
          
          try {
            await downloadAsset(asset.svgUrl, filepath);
            assetData.localPath = `./assets/${filename}`;
            assetData.svgUrl = asset.svgUrl;
            downloadCount++;
            console.log(`  ✓ Downloaded: ${asset.name} → ${filename}`);
          } catch (err) {
            console.log(`  ⚠ Could not download: ${asset.name}`);
          }
        }

        manifest.assets.push(assetData);
      } catch (err) {
        console.warn(`Warning: Could not process asset ${asset.name}:`, err.message);
      }
    }

    // Save manifest
    const manifestPath = path.join(outputDir, 'assets-manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`\n✓ Generated asset manifest: ${manifestPath}`);
    console.log(`✓ Downloaded ${downloadCount} assets\n`);

    // Generate TypeScript/JavaScript helper
    const helperContent = `/**
 * Supernova Assets Helper
 * Auto-generated on ${new Date().toISOString()}
 */

export const SupernovaAssets = {
${manifest.assets.map(asset => {
  if (asset.localPath) {
    return `  '${asset.name}': '${asset.localPath}',`;
  }
  return `  // '${asset.name}': (not available locally)`;
}).join('\n')}
} as const;

export type AssetName = keyof typeof SupernovaAssets;
`;

    const helperPath = path.join(outputDir, 'assets.ts');
    fs.writeFileSync(helperPath, helperContent);
    console.log(`✓ Generated TypeScript helper: ${helperPath}`);

    console.log('\n✅ Assets successfully fetched!');
    console.log('\n📋 Usage:');
    console.log('  import { SupernovaAssets } from "./assets/supernova/assets";');
    console.log('  const iconPath = SupernovaAssets["icon-name"];');

    // Display summary
    console.log('\n📦 Asset Summary:');
    const byType = {};
    manifest.assets.forEach(a => {
      byType[a.type] = (byType[a.type] || 0) + 1;
    });
    Object.keys(byType).forEach(type => {
      console.log(`  ${type}: ${byType[type]} asset(s)`);
    });

  } catch (error) {
    console.error('\n❌ Error fetching assets:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    process.exit(1);
  }
}

fetchAssets();

