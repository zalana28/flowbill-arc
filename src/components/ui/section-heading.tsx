interface SectionHeadingProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

/**
 * Consistent section heading with optional description and action slot.
 * Used across dashboard sections and page headers.
 */
export function SectionHeading({ title, description, action }: SectionHeadingProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
      <div>
        <h2 className="text-lg font-bold text-text-primary">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-text-secondary">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
