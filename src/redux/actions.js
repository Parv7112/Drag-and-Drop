import { v4 as uuidv4 } from 'uuid';

export const addItem = (text) => {
  const newItem = {
    id: uuidv4(),
    text,
  };
  console.log('New Item:', newItem);
  return {
    type: 'ADD_ITEM',
    payload: newItem,
  };
};

export const updateItemOrder = (newOrder) => {
  return {
    type: 'UPDATE_ITEM_ORDER',
    payload: newOrder,
  };
};

export const updateSections = (updatedSections) => {
  return {
    type: 'UPDATE_SECTIONS',
    payload: updatedSections,
  };
};