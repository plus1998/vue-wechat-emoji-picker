import fs from 'node:fs';
import cp from 'node:child_process';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

const main = async () => {
    // 构建
    cp.execSync('npm run build');
    // 版本号加1
    const version = packageJson.version.split('.');
    version[version.length - 1] = Number(version[version.length - 1]) + 1;
    packageJson.version = version.join('.');
    // 生成package.json
    fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 4));
    // 生成package.json
    fs.writeFileSync('./dist/package.json', JSON.stringify({
        name: packageJson.name,
        version: packageJson.version,
        description: packageJson.description,
        main: 'index.js',
        files: [
            "*.css",
            "*.js"
        ],
        publishConfig: {
            "access": "public",
            "registry": "https://registry.npmjs.org/"
        },
        keywords: [
            "vue3",
            "emoji",
            "wechat"
        ],
    }, null, 4));
    // 生成README.md
    fs.writeFileSync('./dist/README.md', fs.readFileSync('./README.md'));
    // 生成LICENSE
    fs.writeFileSync('./dist/LICENSE', fs.readFileSync('./LICENSE'));
    // 发布 需要输入验证码的
    cp.spawnSync('npm', ['publish', './dist'], { stdio: 'inherit' });
};

main();