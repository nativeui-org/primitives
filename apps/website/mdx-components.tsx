import type { MDXComponents } from 'mdx/types';
import { Code, Pre } from 'fumadocs-ui/components/mdx';

export function getMDXComponents(): MDXComponents {
  return {
    pre: Pre,
    code: Code,
  };
}

