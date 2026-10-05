import { mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const SOURCE_DIR = path.join(ROOT, 'media', 'skills-hd');
const OUTPUT_DIR = path.join(ROOT, 'public', 'skills');
const SOURCE_PATTERN = /^\d{2}\.png$/;
const OUTPUT_WIDTH = 567;
const OUTPUT_HEIGHT = 319;
const WEBP_QUALITY = 82;

const sourceFiles = (await readdir(SOURCE_DIR))
  .filter((file) => SOURCE_PATTERN.test(file))
  .sort();

if (sourceFiles.length === 0) {
  throw new Error(`未找到 PNG 原始资源：${SOURCE_DIR}`);
}

await mkdir(OUTPUT_DIR, { recursive: true });

await Promise.all(
  sourceFiles.map(async (sourceFile) => {
    const sourcePath = path.join(SOURCE_DIR, sourceFile);
    const outputPath = path.join(
      OUTPUT_DIR,
      sourceFile.replace(/\.png$/, '.webp'),
    );

    await sharp(sourcePath)
      .resize(OUTPUT_WIDTH, OUTPUT_HEIGHT, { fit: 'fill' })
      .webp({ quality: WEBP_QUALITY })
      .toFile(outputPath);
  }),
);

console.log(
  `已转换 ${sourceFiles.length} 张技能图片：${SOURCE_DIR} → ${OUTPUT_DIR}`,
);
