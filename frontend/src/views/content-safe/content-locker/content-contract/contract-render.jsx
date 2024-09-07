import { useContext, useState } from 'react';
import { ViewLockerContractContext } from './view-lockercontract';
import ContDetailImg from '../../../../assets/image/img/folder.png';
import { useDispatch, useSelector } from 'react-redux';
import { fecthCont } from '../../../../actions/contractAction';
import SingleLoading from '../../../../components/content-loading/siggle-loading';
import { Drawer, Badge, Descriptions } from 'antd';
import { FaArrowCircleRight } from "react-icons/fa";
import { Link } from 'react-router-dom';
import FileGif from '../../../../assets/image/gif/file.gif';
import dateFormat from "dateformat";
import { FaBorderAll } from "react-icons/fa6";
import ViewContAsst from './contAsst';
import { createRecently } from '../../../../actions/lockerAction';
import { useLocation } from 'react-router-dom';

const RenderContract = () => {

    const contract = useContext(ViewLockerContractContext);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const contractState = useSelector((state) => state.contract.currentCont);
    const currentLocker = useSelector((state) => state.locker.currentLocker);
    const [open, setOpen] = useState(false);
    const [size, setSize] = useState();
    const [contDetail, setContDetail] = useState(null);
    const locat = useLocation();
    

    const onClose = async () => {
        setOpen(false);
    };

    const handleShowContDetail = async (CONTNO) => {
        try {
            setSize('large');
            setIsLoading(true);
            const data = {
                contNo: CONTNO
            };

            const recentlyData = {
                contNo: CONTNO,
                lockerPath: locat.pathname,
            };

            const response = await dispatch(fecthCont(data));
            if (response.status === true) {
                setIsLoading(false);
                await setContDetail([
                    {
                        key: '1',
                        label: 'เลขที่สัญญา',
                        children: contractState[0].CONTNO,
                        span: 2,
                      },
                      {
                        key: '2',
                        label: 'ประเภทสัญญา',
                        children: contractState[0].NameLoan,
                        span: 2,
                      },
                      {
                        key: '4',
                        label: 'ชื่อลูกค้า',
                        children: contractState[0].cusnameen,
                        span: 2,
                      },
                      {
                        key: '6',
                        label: 'Status',
                        children: <Badge status="processing" text="Running" />,
                        span: 3,
                      },
                ]);
                setOpen(true);
                console.log(response);
                const createRec = await dispatch(createRecently(recentlyData));
                if (createRec.status === true) {
                    console.log(createRec);
                } else {
                    throw 'Create recently faild';
                }
            }
        } catch (error) {
            return console.log(error);
        }
    };

    return(
        <div className="w-full">
            <div className="w-full">
                <div className='grid grid-cols-3 xl:grid-cols-2 md:block gap-3 my-5'>
                    {
                        contract.contract.map((items, key) => (
                            <button key={key} onClick={() => handleShowContDetail(items.CONTNO)} className='w-full hover:drop-shadow-md md:my-2 duration-100 ease-in-out'>
                                <div className={`px-2 py-2 border-2 rounded-xl w-full flex justify-between items-center`} style={{background: `${currentLocker.length === 0 ? '#A5D6A7' : currentLocker[0].LockerColorCode}`}}>
                                    <div className='flex items-center gap-x-3'>
                                        <div className='bg-white w-[50px] h-[50px] rounded-full flex justify-center items-center'>
                                            <img src={FileGif} className='w-[45px] rounded-full' alt="" />
                                        </div>
                                        <span>{items.CONTNO}</span>
                                    </div>
                                    <div className='flex px-4 py-1 rounded-full bg-white'>
                                        <span>{dateFormat(items.createAt, "mediumDate")}</span>
                                    </div>
                                </div>
                            </button>
                        ))
                    }
                    <Drawer
                        title={`Contract Detail`}
                        placement="right"
                        size={size}
                        onClose={onClose}
                        open={open}
                        className='rounded-l-xl'
                    >
                        <div className='flex items-center border-primarySafe border-2 px-1 py-1 rounded-lg gap-x-3'>
                            <div className='h-[60px] w-[60px] flex justify-center items-center bg-red-300 rounded-md'>
                                <img src={ContDetailImg} className='w-[40px]' alt="" />
                            </div>
                            <div className='flex h-full w-full justify-between'>
                                <div>
                                    <span>Contract no.</span>
                                    <span className='block'>{isLoading ? <SingleLoading /> :  <span>{ contractState === null ? 'data not found' :  contractState[0].CONTNO }</span> }</span>
                                </div>
                                <div className='border-2 h-[45px] rounded-md border-primarySafe'></div>
                                <div>
                                    <span>Full name</span>
                                    <span className='block'>{isLoading ? <SingleLoading /> :  <span>{ contractState === null ? 'data not found' :  contractState[0].cusnameen }</span> }</span>
                                </div>
                                <Link to={`${isLoading ? null : `/view-takedoc/${contractState === null ? 'data not found' :  contractState[0].CONTNO}/${contractState[0].NameLoan}`}`}>
                                    <button className='bg-primarySafe text-white h-full px-2 rounded-md flex justify-center items-center gap-x-2 hover:bg-red-500 duration-100 ease-in-out'>
                                        <span>
                                            Go to Take Document
                                        </span>
                                        <FaArrowCircleRight className='text-[18px]' />
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div className='my-3'>
                            <div className='flex items-center gap-x-3 mb-3'>
                                <FaBorderAll className='text-[25px]' />
                                <div>
                                    <span className='font-primaryMedium text-[16px] text-primarySafe mt-3'>รายละเอียด</span>
                                </div>
                            </div>
                            <Descriptions bordered size='small' items={contDetail} />
                        </div>
                        <div className='my-3'>
                            <ViewContAsst  CONTNO={contractState === null ? 'data not found' :  contractState} />
                        </div>
                    </Drawer>
                </div>
            </div>
        </div>
    );
}

export default RenderContract;