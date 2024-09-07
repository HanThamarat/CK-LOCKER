import MasterLayout from "../layout/master";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import FullCard from "../../components/content-card/section-cardfull";
import TicketComponent from "./ticket-com";

const TicketView = () => {

    const { takeId } = useParams();

    const path = [
        {
            label: 'Home',
            active: false,
        },    
        {
            label: 'Ticket List',
            active: false,
        },
        {
            label: 'Ticket',
            active: true,
        }
    ];

    useEffect(() => {
        console.log(takeId);
    }, [takeId]);

    return(
        <MasterLayout titleName="Ticket process" breadcrumbsPath={path}>
            <FullCard>
                 <TicketComponent />
            </FullCard>
        </MasterLayout>
    );
};

export default TicketView;