import MasterLayout from "../layout/master";
import Branch from '../../assets/image/gif/branches.gif';
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fecthBranchzone } from "../../actions/systemAction";
import SearchPng from '../../assets/image/svg/searching.svg';
import TableDocwait from "./table";
import { fecthtakeWait } from "../../actions/takedocAction";
import BranchLoading from "../../components/content-loading/branch-loading";

const ViewDoclist = () => {

    const dispatch = useDispatch();
    const branch = useSelector((state) => state.system.zoneBranch);
    const [isLoading, setIsLoading] = useState(false);
    const [Branchs, setBranchs] = useState(null);
    const [showContent, setShowcontent] = useState(false);
    const isFatching = useRef(false);

    const path = [
        {
          label: 'Home',
          active: false,
        },    
        {
          label: 'Document List',
          active: true,
        },    
    ];

    const handleBranchs = async (id) => {
        try {
            const response = await dispatch(fecthtakeWait(id));
            setShowcontent(true);
            if (response.status === true) {
                setBranchs(response.message.body);        
            }
        } catch (error) {
            return console.log(error);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        const handlerFecthBranch = async () => {
            try {
                if (isFatching.current) return;
                isFatching.current = true;
                await dispatch(fecthBranchzone());
                isFatching.current = false;
            } catch (error) {
                return console.error(error);
            }
        };

        if (branch.length === 0) {
            handlerFecthBranch();
        }

        if (branch.length !== 0) {
            console.log(branch);
            setIsLoading(false);
        }

    }, [dispatch, branch]);

    return(
        <MasterLayout titleName="รายการขอเบิกเอกสาร (Document List)" breadcrumbsPath={path}>
            <div className="w-full flex justify-between gap-3">
                <div className="w-[25%] bg-white rounded-xl h-[80vh]">
                    <div className="w-full flex justify-center items-center gap-x-2 px-2 py-1 rounded-xl bg-red-500 text-white">
                        <img src={Branch} className="w-[35px]" alt="" />
                        <span>Branches Lists</span>
                    </div>
                    {
                        isLoading ?
                        <BranchLoading />
                        :
                        <div className="m-[10px] h-[74vh] overflow-y-auto">
                            {
                                branch.map((item, index) => (
                                    <div key={index} className={`branchss branchList-${item.id} flex my-1 items-center justify-center gap-x-2 px-2 py-1 rounded-full bg-gray-100 text-gray-700`} onClick={() => handleBranchs(item.DocData.id)}>
                                        <span>{item.DocData.NickNameBranch} - {item.DocData.NameBranch}</span> 
                                        {
                                            item.documentCount !== 0 ?
                                            <span className="text-[14px] bg-red-400 text-white w-[20px] h-[20px] rounded-full flex items-center justify-center animate-pulse animate-infinite animate-duration-[1500ms] animate-ease-in-out">{ item.documentCount }</span>
                                            :
                                            null
                                        }
                                    </div>
                                ))
                            }
                        </div>
                    }
                    <div>

                    </div>
                </div>
                <div className="w-[75%] bg-white rounded-xl h-[80vh]">
                    {
                        showContent ?
                        <TableDocwait takeList={Branchs} />
                        :
                        <div id="table-content" className="w-full h-full flex justify-center items-center">
                            <img src={SearchPng} className="w-[500px]" alt="" />
                        </div>
                    }
                </div>
            </div>
        </MasterLayout>
    );
};

export default ViewDoclist;