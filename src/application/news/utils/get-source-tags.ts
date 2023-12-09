import { z } from 'zod';
import { type HTMLElement } from 'node-html-parser';

export const getSourceTags = (html: HTMLElement) => {
  return z
    .string()
    .array()
    .default([])
    .parse(
      html
        .querySelectorAll('meta[property="article:tag"]')
        .map(tag => tag.getAttribute('content'))
        .filter(Boolean)
    );
};
