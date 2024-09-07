import { PiCassetteTapeBold } from "react-icons/pi";
import { Descriptions } from "antd";
import { useState, useEffect, useRef } from 'react';
import { fecthContAsst } from "../../../../actions/contractAction";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from 'prop-types';
import DetailLoading from "../../../../components/content-loading/detail-loading";

const ViewContAsst = ({CONTNO}) => {

    const dispatch = useDispatch();
    const contAsst = useSelector((state) => state.contract.contAsst);
    const [AsstDetail, setAsstdetail] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const isFatching = useRef(false);

    useEffect(() => {
        setIsLoading(true);
        const fecthContAssts = async () => {
            try {
                const data = {
                    contNo: CONTNO[0].CONTNO
                }
                if (isFatching.current) return;
                isFatching.current = true;
                await dispatch(fecthContAsst(data));
                isFatching.current = false;
            } catch (error) {
                return console.log(error);
            }
        };

        if (contAsst.length === 0 && CONTNO.length !== 0) {
            fecthContAssts();            
        }

        if (contAsst.length > 0) {
            setIsLoading(false);
            contAsst.map((items) => (
                setAsstdetail((prevState) => ([
                   ...prevState,
                    [
                        {
                            key: '1',
                            label: 'ประเภททรัพย์',
                            children: items.typeCode,
                            span: 2,
                        },
                        {
                            key: '2',
                            label: 'Brand',
                            children: items.brands,
                            span: 2,
                        },
                        {
                            key: '3',
                            label: 'Model',
                            children: items.typeModel,
                            span: 2,
                        },
                        {
                            key: '4',
                            label: 'Car license',
                            children: items.carLicense,
                            span: 2,
                        },
                        {
                            key: '5',
                            label: 'Asset Provenice',
                            children: items.asstProvince,
                            span: 2,
                        },
                        {
                            key: '6',
                            label: 'Vehicle Chassis',
                            children: items.vehicleChassis,
                            span: 2,
                        },
                        {
                            key: '7',
                            label: 'Engine',
                            children: items.vehicleEngine,
                            span: 2,
                        },
                        {
                            key: '8',
                            label: 'Vehicle CC',
                            children: items.vehicleCc,
                            span: 2,
                        },
                        {
                            key: '9',
                            label: 'Asset Price',
                            children: items.asstPrice,
                            span: 2,
                        },
                        {
                            key: '10',
                            label: 'Color',
                            children: items.colors === null ? '-' : items.colors,
                            span: 2,
                        },
                    ],
                ]))
            ));
            console.log(contAsst);
        }
        
    }, [CONTNO, dispatch, contAsst]);

    return(
        <div className='w-full'>
            {
                isLoading ?
                <DetailLoading />
                :
                <div className="w-full">
                    {
                        contAsst.map((items, key) => (
                            <div key={key} className="my-2">
                                <div className="flex gap-x-2 items-center">
                                    <PiCassetteTapeBold className="text-[35px]" />
                                    <span className="text-[16px] font-primaryMedium">Asset {key + 1}</span>
                                </div>
                                <div>
                                    <Descriptions bordered size='small' items={AsstDetail[key]} />
                                </div>
                            </div>
                        ))
                    }
                </div>
            }
        </div>
    );
};

ViewContAsst.propTypes = {
    CONTNO: PropTypes.string
};

export default ViewContAsst;