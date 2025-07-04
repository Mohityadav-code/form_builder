import { cn } from '@/lib/utils';
import ButtonLoadingIcon from '../icons/categories/ButtonLoadingIcon';

export default function LoadingScreen({ className }) {
  return (
    <section
      className={cn(
        'w-full h-full bg-transparent flex items-center justify-center',
        className
      )}
    >
      <ButtonLoadingIcon className="h-12 w-12 text-blue-primary-200" />
    </section>
  );
}

export const SkeletonChart = ({
  type = 'line',
  width = '100%',
  height = '200px',
  dataPoints = 8,
  className,
}) => {
  return (
    <div
      className={cn(
        'relative rounded-lg bg-gradient-to-b from-gray-50 to-gray-100 p-4',
        'animate-pulse shadow-sm border border-gray-200',
        className
      )}
      style={{ width, height }}
    >
      {/* Chart grid */}
      <div className="absolute inset-4 grid grid-cols-4 grid-rows-4">
        {[...Array(20)].map((_, idx) => (
          <div
            key={idx}
            className="border-gray-200 border-dashed"
            style={{
              borderWidth: '0.5px',
              opacity: 0.5,
            }}
          />
        ))}
      </div>

      {/* Y-axis ticks */}
      <div className="absolute left-2 top-4 bottom-4 flex flex-col justify-between">
        {[...Array(5)].map((_, idx) => (
          <div
            key={idx}
            className="h-3 w-12 bg-gray-200 rounded-md"
            style={{ opacity: 1 - idx * 0.15 }}
          />
        ))}
      </div>

      {/* X-axis ticks */}
      <div className="absolute bottom-0 left-16 right-4 flex justify-between">
        {[...Array(dataPoints)].map((_, idx) => (
          <div
            key={idx}
            className="h-2 w-8 bg-gray-200 rounded-md"
            style={{ opacity: 0.8 - idx * 0.1 }}
          />
        ))}
      </div>

      {/* Chart elements */}
      <div className="absolute top-4 right-4 bottom-8 left-16">
        {type === 'line' && (
          <>
            {/* Line segments */}
            <svg className="w-full h-full" preserveAspectRatio="none">
              <path
                d={[...Array(dataPoints)]
                  .map((_, idx) => {
                    const x = (idx * 100) / (dataPoints - 1);
                    const y = Math.random() * 60 + 20;
                    return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                  })
                  .join(' ')}
                className="stroke-gray-300"
                fill="none"
                strokeWidth="2"
              />
            </svg>
            {/* Data points */}
            {[...Array(dataPoints)].map((_, idx) => (
              <div
                key={idx}
                className="absolute w-4 h-4 bg-white border-2 border-gray-300 rounded-full transform -translate-x-2 -translate-y-2"
                style={{
                  left: `${(idx * 100) / (dataPoints - 1)}%`,
                  top: `${Math.random() * 60 + 20}%`,
                }}
              />
            ))}
          </>
        )}

        {type === 'bar' && (
          <div className="flex justify-between items-end h-full w-full">
            {[...Array(dataPoints)].map((_, idx) => (
              <div
                key={idx}
                className="w-full mx-1 rounded-t-lg bg-gradient-to-b from-gray-200 to-gray-300"
                style={{
                  height: `${Math.random() * 70 + 20}%`,
                  opacity: 1 - idx * 0.1,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
