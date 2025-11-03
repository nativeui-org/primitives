'use client';

import { Tabs, Tab } from 'fumadocs-ui/components/tabs';
import { Pre, CodeBlock } from 'fumadocs-ui/components/codeblock';

interface InstallTabsProps {
  package?: string;
}

export function InstallTabs({ package: pkg = '@native-ui-org/primitives' }: InstallTabsProps) {
  return (
    <Tabs items={['npm', 'pnpm', 'yarn', 'bun']}>
      <Tab value="npm">
        <CodeBlock lang="bash" className="pl-4">
          <Pre>npm install {pkg}</Pre>
        </CodeBlock>
      </Tab>
      <Tab value="pnpm">
        <CodeBlock lang="bash" className="pl-4">
          <Pre>pnpm add {pkg}</Pre>
        </CodeBlock>
      </Tab>
      <Tab value="yarn">
        <CodeBlock lang="bash" className="pl-4">
          <Pre>yarn add {pkg}</Pre>
        </CodeBlock>
      </Tab>
      <Tab value="bun">
        <CodeBlock lang="bash" className="pl-4">
          <Pre>bun add {pkg}</Pre>
        </CodeBlock>
      </Tab>
    </Tabs>
  );
}

