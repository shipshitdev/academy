import mongoose, { Schema } from 'mongoose';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import type { IClassSeed, ILessonSeed } from './interfaces/seed-content.interface';

const CURRENT_DIR = __dirname || process.cwd();
const DEFAULT_CONTENT_ROOT = resolve(CURRENT_DIR, '../../../communities');
const CONTENT_ROOT = process.env.SKOOL_CONTENT_ROOT || DEFAULT_CONTENT_ROOT;

const CLASS_SEEDS: IClassSeed[] = [
  {
    title: 'Build',
    slug: 'build',
    description: 'Learn to vibe code. Ship real apps with AI as your pair programmer.',
    isFree: false,
    priceMonthly: 49,
    isFeatured: true,
    sortOrder: 1,
    courseTitle: 'Learn to Build',
    courseSlug: 'learn-to-build',
    lessonPaths: [
      'automate-yourself/05-build-product-introduction/01-why-build-products/01-why-build-products.md',
      'automate-yourself/06-build-product-indie-dev/01-introduction/01-introduction.md',
      'automate-yourself/06-build-product-indie-dev/02-agent-folder/02-agent-folder.md',
      'automate-yourself/06-build-product-indie-dev/03-unit-tests/03-unit-tests.md',
      'automate-yourself/06-build-product-indie-dev/04-code-examples/04-code-examples.md',
      'automate-yourself/06-build-product-indie-dev/05-tech-stack/05-tech-stack.md',
      'automate-yourself/07-build-product-saas/04-mvp-development/04-mvp-development.md',
      'automate-yourself/07-build-product-saas/08-landing-pages/08-landing-pages.md',
      'automate-yourself/07-build-product-saas/16-project-first-customers/16-project-first-customers.md',
    ],
  },
  {
    title: 'Sell',
    slug: 'sell',
    description: 'Launch and scale ecommerce stores. Learn to sell products online.',
    isFree: false,
    priceMonthly: 49,
    isFeatured: true,
    sortOrder: 2,
    courseTitle: 'Learn to Sell',
    courseSlug: 'learn-to-sell',
    lessonPaths: [
      'automate-yourself/08-build-product-ecommerce/01-what-is-dropshipping/01-what-is-dropshipping.md',
      'automate-yourself/08-build-product-ecommerce/02-why-ecommerce/02-why-ecommerce.md',
      'automate-yourself/08-build-product-ecommerce/03-product-research/03-product-research.md',
      'automate-yourself/08-build-product-ecommerce/04-suppliers/04-suppliers.md',
      'automate-yourself/08-build-product-ecommerce/05-setup/05-setup.md',
      'automate-yourself/08-build-product-ecommerce/06-pricing/06-pricing.md',
      'automate-yourself/08-build-product-ecommerce/07-marketing/07-marketing.md',
      'automate-yourself/08-build-product-ecommerce/08-project-niche/08-project-niche.md',
      'automate-yourself/08-build-product-ecommerce/09-project-store/09-project-store.md',
      'automate-yourself/08-build-product-ecommerce/10-project-pages/10-project-pages.md',
      'automate-yourself/08-build-product-ecommerce/11-project-campaign/11-project-campaign.md',
      'automate-yourself/08-build-product-ecommerce/12-scaling/12-scaling.md',
    ],
  },
  {
    title: 'Distribute',
    slug: 'distribute',
    description: 'Generate AI content and publish on socials. Build your audience.',
    isFree: true,
    priceMonthly: 0,
    isFeatured: true,
    sortOrder: 3,
    courseTitle: 'Learn to Distribute',
    courseSlug: 'learn-to-distribute',
    lessonPaths: [
      'create-good-AI-content/00-ai-setup-and-prompt-library.md',
      'create-good-AI-content/01-introduction.md',
      'create-good-AI-content/02-ai-models-for-visual-content.md',
      'create-good-AI-content/03-prompt-engineering-for-ads.md',
      'create-good-AI-content/04-image-to-video-workflow.md',
      'create-good-AI-content/05-conversion-optimization.md',
      'create-good-AI-content/06-project-complete-ad-campaign.md',
      'automate-yourself/03-build-distribution-content-creation/02-understanding-llms/02-understanding-llms.md',
      'automate-yourself/03-build-distribution-content-creation/03-content-tools/03-content-tools.md',
      'automate-yourself/03-build-distribution-content-creation/04-prompt-engineering-basics/04-prompt-engineering-basics.md',
      'automate-yourself/03-build-distribution-content-creation/05-writing-workflows/05-writing-workflows.md',
      'automate-yourself/03-build-distribution-content-creation/06-project-1-blog-post/06-project-1-blog-post.md',
      'automate-yourself/03-build-distribution-content-creation/07-project-2-social-content/07-project-2-social-content.md',
      'automate-yourself/03-build-distribution-content-creation/08-project-3-visual-content/08-project-3-visual-content.md',
      'automate-yourself/03-build-distribution-content-creation/09-email-marketing/09-email-marketing.md',
      'automate-yourself/03-build-distribution-content-creation/10-email-sequences/10-email-sequences.md',
      'automate-yourself/03-build-distribution-content-creation/11-optimization/11-optimization.md',
    ],
  },
];

const ClassSchema = new Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    description: String,
    isFree: Boolean,
    priceMonthly: Number,
    isPublished: Boolean,
    isFeatured: Boolean,
    sortOrder: Number,
    coverImageUrl: String,
    createdBy: String,
  },
  { timestamps: true },
);

const CourseSchema = new Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    description: String,
    classId: String,
    sortOrder: Number,
    isPublished: Boolean,
    coverImageUrl: String,
    createdBy: String,
  },
  { timestamps: true },
);

const LessonSchema = new Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    content: String,
    videoId: String,
    courseId: String,
    sortOrder: Number,
    isPublished: Boolean,
    isPreview: Boolean,
    createdBy: String,
  },
  { timestamps: true },
);

const ClassModel = mongoose.model('Class', ClassSchema);
const CourseModel = mongoose.model('Course', CourseSchema);
const LessonModel = mongoose.model('Lesson', LessonSchema);

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function extractTitle(content: string, fallback: string): string {
  const titleLine = content.split('\n').find((line) => line.trim().startsWith('# '));
  if (!titleLine) {
    return fallback;
  }
  return titleLine.replace(/^#\s+/, '').trim();
}

function readLesson(pathValue: string): ILessonSeed {
  const absolutePath = resolve(CONTENT_ROOT, pathValue);
  const content = readFileSync(absolutePath, 'utf8');
  const fallback = pathValue.split('/').pop() || pathValue;
  const title = extractTitle(content, fallback.replace(/\.md$/, ''));
  return { title, content, path: pathValue };
}

async function seed(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/open-learning-center';

  await mongoose.connect(mongoUri);

  for (const classSeed of CLASS_SEEDS) {
    const classDoc = await ClassModel.findOneAndUpdate(
      { slug: classSeed.slug },
      {
        title: classSeed.title,
        slug: classSeed.slug,
        description: classSeed.description,
        isFree: classSeed.isFree,
        priceMonthly: classSeed.isFree ? undefined : classSeed.priceMonthly,
        isPublished: true,
        isFeatured: classSeed.isFeatured,
        sortOrder: classSeed.sortOrder,
        createdBy: 'seed',
      },
      { new: true, upsert: true },
    );

    const course = await CourseModel.findOneAndUpdate(
      { slug: classSeed.courseSlug },
      {
        title: classSeed.courseTitle,
        slug: classSeed.courseSlug,
        description: classSeed.description,
        classId: classDoc._id.toString(),
        sortOrder: 0,
        isPublished: true,
        createdBy: 'seed',
      },
      { new: true, upsert: true },
    );

    for (const [index, lessonPath] of classSeed.lessonPaths.entries()) {
      const lessonData = readLesson(lessonPath);
      const lessonSlug = `${classSeed.courseSlug}-${toSlug(lessonData.title)}`;

      await LessonModel.findOneAndUpdate(
        { slug: lessonSlug },
        {
          title: lessonData.title,
          slug: lessonSlug,
          content: lessonData.content,
          courseId: course._id.toString(),
          sortOrder: index + 1,
          isPublished: true,
          isPreview: index === 0,
          createdBy: 'seed',
        },
        { new: true, upsert: true },
      );
    }
  }

  await mongoose.disconnect();
}

seed()
  .then((): void => {
    process.stdout.write('Seed complete\n');
  })
  .catch((error: unknown): void => {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`Seed failed: ${message}\n`);
    process.exit(1);
  });
