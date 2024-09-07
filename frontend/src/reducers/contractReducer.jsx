import { ContActionType } from "../actions/contractAction";

const initialState = {
    currentCont: [],
    contAsst: [],
};

const contractReducer = (state = initialState, action) => {
    switch (action.type) {
        case ContActionType.FECTH_CONT:
            return {
                ...state,
                currentCont: action.payload,
            }
        case ContActionType.RESET_CONT:
            return {
                ...state,
                currentCont: [],
            }
        case ContActionType.FECTH_CONTASST:
            return {
                ...state,
                contAsst: action.payload,
            }
        default:
            return state;
    }
};

export default contractReducer;