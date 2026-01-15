import type { TFunction } from 'i18next';

export type BlogPost = {
  title: string;
  date: string;
  author: string;
  summary: string;
  readTime: string;
  tag: string;
  coverImage: string;
  coverAlt: string;
  slug?: string;
};

export type ArticleSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  images?: {
    src: string;
    alt: string;
    caption?: string;
  }[];
};

export type FeatureArticle = {
  kicker: string;
  title: string;
  date: string;
  author: string;
  readTime: string;
  slug: string;
  heroImage: string;
  heroAlt: string;
  intro: string;
  sections: ArticleSection[];
  closing: string;
};

export const getBlogPosts = (t: TFunction): BlogPost[] =>
  t('blog.posts', { returnObjects: true }) as BlogPost[];

export const getBlogArticlesBySlug = (t: TFunction): Record<string, FeatureArticle> =>
  t('blog.articlesBySlug', { returnObjects: true }) as Record<string, FeatureArticle>;
