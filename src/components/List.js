import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import { addItem, updateItemOrder, updateSections } from '../redux/actions';
import './List.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';

const List = () => {
  const [showInput, setShowInput] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [showSectionInput, setShowSectionInput] = useState(false);
  const [newSectionText, setNewSectionText] = useState('');
  const dispatch = useDispatch();
  const items = useSelector((state) => state.items);
  const sections = useSelector((state) => state.sections);

  const handleNewItemClick = () => {
    setShowInput(true);
  };

  const handleInputChange = (event) => {
    setNewItemText(event.target.value);
  };

  const handleInputSubmit = () => {
    if (newItemText) {
      dispatch(addItem(newItemText));
      setNewItemText('');
      setShowInput(false);
    }
  };

  const handleAddSectionClick = () => {
    setShowSectionInput(true);
  };

  const handleSectionInputChange = (event) => {
    setNewSectionText(event.target.value);
  };

  const handleSectionInputSubmit = () => {
    if (newSectionText) {
      const newSection = { id: uuidv4(), title: newSectionText, items: [] };
      dispatch(updateSections([...sections, newSection]));
      setNewSectionText('');
      setShowSectionInput(false);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    const sourceSectionId = result.source.droppableId;
    const destinationSectionId = result.destination.droppableId;

    if (sourceSectionId === 'items' && destinationSectionId === 'items') {
      const newOrder = Array.from(items);
      const [movedItem] = newOrder.splice(sourceIndex, 1);
      newOrder.splice(destinationIndex, 0, movedItem);

      dispatch(updateItemOrder(newOrder));
    } else {
      const updatedSections = [...sections];
      const sourceSectionIndex = updatedSections.findIndex((section) => section.id === sourceSectionId);
      const destinationSectionIndex = updatedSections.findIndex((section) => section.id === destinationSectionId);

      if (sourceSectionId === 'items') {
        const [movedItem] = items.splice(sourceIndex, 1);
        updatedSections[destinationSectionIndex].items.splice(destinationIndex, 0, movedItem);
      } else if (destinationSectionId === 'items') {
        const [movedItem] = updatedSections[sourceSectionIndex].items.splice(sourceIndex, 1);
        items.splice(destinationIndex, 0, movedItem);
      } else if (sourceSectionId !== destinationSectionId) {
        const [movedItem] = updatedSections[sourceSectionIndex].items.splice(sourceIndex, 1);
        updatedSections[destinationSectionIndex].items.splice(destinationIndex, 0, movedItem);
      }

      dispatch(updateSections(updatedSections));
    }
  };

  return (
    <div>
      <h1 className='my-5 text-center'>Drag and Drop Task</h1>
      <div className='mx-5'>
        <Button onClick={handleNewItemClick} variant='success' className='fs-3 fw-bold btn btn-sm'>
          Add New List Item
        </Button>
        {showInput && (
          <div>
            <div className='my-3 mx-1 row'>
            <input
              type='text'
              placeholder='Enter new item'
              value={newItemText}
              className='form-control h-100 w-50 border border-dark'
              onChange={handleInputChange}
            />
            </div>
            <Button onClick={handleInputSubmit} variant='primary'>
              Create Item
            </Button>
          </div>
        )}
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="items" type="ITEM">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className='item-container'>
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className='item-box mx-5 fs-5'
                    >
                      {item.text}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        {sections.map((section, sectionIndex) => (
          <Droppable key={section.id} droppableId={section.id} type="ITEM">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className='section-box bg-white text-dark p-3 mt-4 border border-dark mx-5'
              >
                <h2 className='h4 mb-3'>{section.title}</h2>
                {section.items.map((item, itemIndex) => (
                  <Draggable key={item.id} draggableId={item.id} index={itemIndex}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className='item-box'
                      >
                        {item.text}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
      <Button onClick={handleAddSectionClick} variant='success' className='fs-3 fw-bold mt-5 mx-5'>
        Add New Section
      </Button>
      {showSectionInput && (
        <div className="mt-3 mx-5">
          <div className='row my-3 mx-1'>
          <input
            type='text'
            placeholder='Enter new section name'
            value={newSectionText}
            className='form-control h-100 w-50 border border-dark'
            onChange={handleSectionInputChange}
          />
          </div>
          <div>
          <Button onClick={handleSectionInputSubmit} variant='primary'>
            Create Section
          </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
