import { FC } from 'react';
import Skeleton from "react-loading-skeleton";

interface loadingProps {}

const loading: FC<loadingProps> = ({}) => {
  return (
    <div className="flex flex-col h-full items-center bg-white dark:bg-[#212121]">
      <Skeleton 
        className="mb-4" 
        height={40} 
        width={400} 
        baseColor="#ffffff" // Pure white for light mode
        highlightColor="#f5f5f5" 
      />
      {/* Chat messages */}
      <div className="flex-1 max-h-full overflow-y-scroll w-full">
        <div className="flex flex-col flex-auto h-full p-6">
          <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-white dark:bg-[#212121] h-full p-4">
            <div className="flex flex-col h-full overflow-x-auto mb-4">
              <div className="flex flex-col h-full">
                <div className="grid grid-cols-12 gap-y-2">
                  {/* Incoming messages */}
                  <div className="col-start-6 col-end-13 p-3 rounded-lg">
                    <div className="flex items-center justify-start flex-row-reverse">
                      <div className="relative h-10 w-10">
                        <Skeleton 
                          width={100} 
                          height={40} 
                          borderRadius={999} 
                          baseColor="#ffffff" // Pure white for light mode
                          highlightColor="#f5f5f5" 
                        />
                      </div>
                      <div className="relative mr-3 text-sm bg-indigo-400 dark:bg-indigo-900 text-black dark:text-gray-200 py-2 px-4 border border-gray-100 dark:border-gray-700 rounded-xl">
                        <Skeleton 
                          className="ml-2" 
                          width={150} 
                          height={20} 
                          baseColor="#ffffff" // Pure white for light mode
                          highlightColor="#f5f5f5" 
                        />
                      </div>
                    </div>
                  </div>
                  {/* Repeat similar skeletons for more incoming messages... */}

                  {/* My messages */}
                  <div className="col-start-1 col-end-8 p-3 rounded-lg">
                    <div className="flex flex-row items-center">
                      <div className="relative h-10 w-10">
                        <Skeleton 
                          width={100} 
                          height={40} 
                          borderRadius={999} 
                          baseColor="#ffffff" // Pure white for light mode
                          highlightColor="#f5f5f5" 
                        />
                      </div>
                      <div className="relative ml-3 text-sm bg-white dark:bg-gray-700 py-2 px-4 border border-gray-100 dark:border-gray-600 rounded-xl">
                        <Skeleton 
                          className="ml-2" 
                          width={150} 
                          height={20} 
                          baseColor="#ffffff" // Pure white for light mode
                          highlightColor="#f5f5f5" 
                        />
                      </div>
                    </div>
                  </div>
                  {/* Repeat similar skeletons for more of your own messages... */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default loading;
