import DocfileGif from '../../../assets/image/gif/doc-file.gif';
import { Button, Dropdown } from 'antd';
import { IoIosMore } from "react-icons/io";
import { useEffect, useRef, useState } from 'react';
import { fecthRecently } from '../../../actions/lockerAction';
import { useDispatch, useSelector } from 'react-redux';
import RecentLoading from '../../../components/content-loading/recently-loading';

const RecentlyList = () => {

    const dispatch = useDispatch();
    const recently = useSelector((state) => state.locker.currentRecently);
    const [isLoading, setIsLoading] = useState(false);
    const isFatching = useRef(false);

    const itemsDp = [
        {
          key: '1',
          label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
              1st menu item
            </a>
          ),
        },
        {
          key: '2',
          label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
              2nd menu item
            </a>
          ),
        },
        {
          key: '3',
          label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
              3rd menu item
            </a>
          ),
        },
    ];

    useEffect(() => {
        setIsLoading(true);
        const handleFecthrecent = async () => {
            try {
                if (isFatching.current) return;
                isFatching.current = true;
                await dispatch(fecthRecently());
                isFatching.current = false;
            } catch (error) {
                return console.error(error);
            }
        };

        if (recently.length === 0) handleFecthrecent();

        if (recently.length !== 0) setIsLoading(false);
    }, [dispatch, recently]);
    
    return(
        <div className="w-full">
            {
                isLoading ?
                <RecentLoading />
                :
                recently.map((items, key) => (
                    <div key={key} className="w-full py-1 px-4 my-2 rounded-lg flex justify-between bg-gray-100">
                        <div className="px-1 py-1 bg-white rounded-full text-[30px]">
                            <img src={DocfileGif} className="w-[60px] rounded-full" alt="" />
                        </div>
                        <div className='px-10 flex items-center w-full'>
                            <div>
                                <span>Contract No.</span>
                                <span className='block'>P-12131313</span>
                            </div>
                        </div>
                        <div className='flex items-center justify-center'>
                        <Dropdown
                            menu={{
                                itemsDp,
                            }}
                            placement="bottom"
                        >
                            <Button className='h-full bg-gray-100 border-none'>
                                <IoIosMore />
                            </Button>
                        </Dropdown>
                        </div>
                    </div>
                ))
            }
        </div>
    );
};

export default RecentlyList;