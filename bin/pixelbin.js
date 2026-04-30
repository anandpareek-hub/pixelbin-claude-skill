#!/usr/bin/env node
/**
 * Single-entry CLI for the PixelBin Claude Skill.
 * Usage:
 *   pixelbin <command> [...args]
 *
 * Commands:
 *   generate-image     bulk AI image generation
 *   generate-video     bulk AI video generation
 *   upload             upload local files / URLs → CDN
 *   transform          build CDN URLs with transformations
 *   seo                generate SEO + design brief
 *   build-page         assemble HTML page from a spec
 *   help               show this help
 */
const path = require('path');
const { spawn } = require('child_process');

const COMMANDS = {
    'generate-image': 'scripts/generate-image.js',
    'generate-video': 'scripts/generate-video.js',
    'upload': 'scripts/upload.js',
    'transform': 'scripts/transform.js',
    'seo': 'scripts/seo-content.js',
    'build-page': 'scripts/build-page.js',
};

function help() {
    console.log('pixelbin <command> [...args]\n');
    console.log('Commands:');
    Object.keys(COMMANDS).forEach((c) => console.log(`  ${c.padEnd(18)} → ${COMMANDS[c]}`));
    console.log('\nExamples:');
    console.log('  pixelbin generate-image --jobs ./examples/jobs.example.json');
    console.log('  pixelbin upload --files "./products/*.jpg"');
    console.log('  pixelbin seo --keyword "AI image generator" --brand-url https://yoursite.com');
    console.log('  pixelbin build-page --spec ./page-spec.json --out ./dist/index.html');
    console.log('\nDocs: https://github.com/anandpareek-hub/pixelbin-claude-skill');
}

const [, , cmd, ...rest] = process.argv;

if (!cmd || cmd === 'help' || cmd === '-h' || cmd === '--help') {
    help();
    process.exit(0);
}

const script = COMMANDS[cmd];
if (!script) {
    console.error(`Unknown command: ${cmd}\n`);
    help();
    process.exit(1);
}

const scriptPath = path.join(__dirname, '..', script);
const child = spawn(process.execPath, [scriptPath, ...rest], { stdio: 'inherit' });
child.on('exit', (code) => process.exit(code ?? 0));
