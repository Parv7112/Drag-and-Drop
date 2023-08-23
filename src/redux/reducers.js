const initialState = {
  items: [],
  sections: [],
};

const listReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const newItem = action.payload;

      return {
        ...state,
        items: [...state.items, newItem],
      };
    case 'UPDATE_ITEM_ORDER':
      return {
        ...state,
        items: action.payload, 
      };
    case 'UPDATE_SECTIONS':
      return {
        ...state,
        sections: action.payload,
      };
    default:
      return state;
  }
};

export default listReducer;
