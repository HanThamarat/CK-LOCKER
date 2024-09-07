const RecentLoading = () => {
    return(
        <div className="w-full py-1 px-4 my-2 rounded-lg flex justify-between bg-gray-100 animate-pulse animate-infinite animate-duration-[1500ms] animate-ease-in-out">
            <div className="w-[50px] h-[50px] bg-red-300 rounded-full text-[30px]"></div>
            <div className="w-full flex items-center">
                <div className='px-10 flex gap-x-2 items-center w-full'>
                    <div className="gap-y-3">
                        <div className="w-[150px] h-[10px] bg-red-300 mb-2 rounded-lg"></div>
                        <div className="w-[150px] h-[10px] bg-red-300 rounded-lg"></div>
                    </div>
                    <div className="gap-y-3">
                        <div className="w-[150px] h-[10px] bg-red-300 mb-2 rounded-lg"></div>
                        <div className="w-[150px] h-[10px] bg-red-300 rounded-lg"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecentLoading;