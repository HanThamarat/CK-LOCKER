import TableLoading from "../../components/content-loading/table-loading";
import SecEmpty from "../../components/content-empty/sec-empty";
import ButtonIcon from "../../components/content-button/button-icon";
import PropTypes from 'prop-types';
import { LuPackageOpen } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const TableDocwait = ({takeList}) => {

    const navigate = useNavigate();

    const handleMovetoTicket = (id) => {
        navigate(`/ticket-process/${id}`);
    }

    return(
        <div className="w-full px-2 py-2">
            <div className="w-full">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr className="font-primaryRegular text-[14px]">
                            <th className="rounded-l-lg py-2">#</th>
                            <th className="">เลขสัญญา</th>
                            <th className="">ผู้ขอเบิก</th>
                            <th className="">ประเภทการเบิก</th>
                            <th className="">สถานะการเบิก</th>
                            <th className="rounded-r-lg py-2">Actions</th>
                        </tr>
                    </thead>
                       {
                            !takeList ?
                            <TableLoading rows={6} columns={6} />
                            :
                            <tbody>
                                {
                                    takeList.map((items, key) => (
                                        <tr key={key}>
                                            <td className="py-2 text-center">{ key + 1 }</td>
                                            <td className="text-center">{ items.CONTNO !== null ? items.CONTNO : 'data not found!' }</td>
                                            <td className="text-center">{ items.name !== null ? items.name : 'data not found!' }</td>
                                            <td className="text-center">{ items.name_th !== null ? items.name_th : 'data not found!' }</td>
                                            <td className="text-center">
                                                <div>
                                                    <span className="px-4 py-1 rounded-lg bg-green-300">{ items.TakeSt !== null ? items.TakeSt : 'data not found!' }</span>
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <div className="flex justify-center gap-x-1 py-1 items-center">
                                                    <ButtonIcon icon={<LuPackageOpen />} event={() => handleMovetoTicket(items.id)} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                       }
                </table>
            </div>
            {
                 takeList.length === 0 ?
                 <div className="flex w-full justify-center">
                      <SecEmpty />
                 </div>
                 :
                 null
            }
        </div>
    );
};

TableDocwait.propTypes = {
    takeList: PropTypes.array.isRequired,
};

export default TableDocwait;