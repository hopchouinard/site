import { defineCollection, z } from 'astro:content';

const dashboards = defineCollection({
  type: 'content',
  schema: z.object({
    date: z.string(),
    generated: z.string(),
    domains_count: z.number(),
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    categories: z.array(z.string()),
    sections: z.array(z.object({
      heading: z.string(),
      content: z.string()
    })),
    notable_developments: z.array(z.string()),
    strategic_implications: z.string(),
    recommendations: z.array(z.string()),
    permalink: z.string()
  })
});

export const collections = { dashboards };
