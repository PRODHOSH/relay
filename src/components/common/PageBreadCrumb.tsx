import Link from "next/link";

interface BreadcrumbProps {
  pageTitle: string;
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle }) => {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h2
        className="text-2xl font-bold text-gray-800 dark:text-white/90"
      >
        {pageTitle}
      </h2>
    </div>
  );
};

export default PageBreadcrumb;
