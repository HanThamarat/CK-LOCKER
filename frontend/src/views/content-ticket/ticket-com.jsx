import {DndContext} from '@dnd-kit/core';
import { useState } from 'react';

import Draggable from '../../components/content-ticket/Draggable';
import Droppable from '../../components/content-ticket/Droppable';

const TicketComponent = () => {
    const [isDropped, setIsDropped] = useState(false);
    const draggableMarkup = (
        <Draggable>Drag me</Draggable>
    );

    function handleDragEnd(event) {
        if (event.over && event.over.id === 'droppable') {
          setIsDropped(true);
        }
      }

    return(
        <div className="flex w-full gap-x-2 overflow-x-auto">
            <div className="min-h-[450px] w-[350px] px-2 py-2 bg-gray-100 rounded-lg">
                <div className="w-full px-2 py-2 rounded-md bg-white">
                <DndContext onDragEnd={handleDragEnd}>
                    {!isDropped ? draggableMarkup : null}
                    <Droppable>
                        {isDropped ? draggableMarkup : 'Drop here'}
                    </Droppable>
                </DndContext>
                </div>
            </div>
        </div>
    );
};

export default TicketComponent;