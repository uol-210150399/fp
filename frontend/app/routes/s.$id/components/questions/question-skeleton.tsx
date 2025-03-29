import { type ReactNode } from "react";

interface QuestionSkeletonProps {
  required?: boolean;
  children: ReactNode;
  error?: string | null;
  elements: {
    title: ReactNode | string;
    description?: ReactNode | string;
  }
}

export const QuestionSkeleton: React.FC<QuestionSkeletonProps> = ({
  required = false,
  elements,
  error,
  children,
}) => {
  return (
    <div className="w-full min-h-full flex flex-col justify-center items-left">
      <div className="px-10 text-start">
        <div className="max-w-3xl mx-auto w-full mt-8 mb-12">
          <div className="cursor-default">
            <p className="text-2xl leading-8">
              {elements.title}
              {required ? <span className="text-red-500">*</span> : null}
            </p>
          </div>
          {elements?.description ? (
            <div className="text-xl leading-7 text-black/70 mt-2">
              <p>{elements?.description}</p>
            </div>
          ) : null}
          <div className={`mt-8`}>
            {children}
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};