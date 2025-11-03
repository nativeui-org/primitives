'use client';

interface PreviewProps {
  component: string;
  title?: string;
}

const SANDBOX_URL = process.env.NEXT_PUBLIC_SANDBOX_URL || 'https://sandbox-primitives.nativeui.io';

export function Preview({ component, title }: PreviewProps) {
  const previewUrl = `${SANDBOX_URL}/preview/${component}`;

  return (
    <div className="my-6 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
      {title && (
        <div className="px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {title}
          </span>
        </div>
      )}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={previewUrl}
          className="absolute top-0 left-0 w-full h-full"
          style={{
            border: 'none',
            backgroundColor: '#fff',
          }}
          title={`Preview of ${component}`}
          loading="lazy"
        />
      </div>
      <div className="px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
        <a
          href={previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 underline underline-offset-2"
        >
          Open in new tab ↗
        </a>
      </div>
    </div>
  );
}

