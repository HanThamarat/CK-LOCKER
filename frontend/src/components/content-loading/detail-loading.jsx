const DetailLoading = () => {
    return(
        <div className="my-2 animate-pulse animate-infinite animate-duration-1000 animate-ease-linear">
            <div className="flex h-[20px] w-[150px] items-center bg-red-300 rounded-lg"></div>
            <div className="mt-2 ">
                <div className="flex h-[20px] w-full items-center bg-red-300 rounded-lg"></div>
                <div className="flex gap-x-3 mt-1">
                    <div className="flex h-[20px] w-[30%] items-center bg-red-300 rounded-lg"></div>
                    <div className="flex h-[20px] w-[70%] items-center bg-red-300 rounded-lg"></div>
                </div>
                <div className="flex gap-x-3 mt-1">
                    <div className="flex h-[20px] w-[70%] items-center bg-red-300 rounded-lg"></div>
                    <div className="flex h-[20px] w-[30%] items-center bg-red-300 rounded-lg"></div>
                </div>
                <div className="flex h-[20px] mt-1 w-full items-center bg-red-300 rounded-lg"></div>
                <div className="flex h-[20px] mt-1 w-full items-center bg-red-300 rounded-lg"></div>
            </div>
        </div>
    );
};

export default DetailLoading;