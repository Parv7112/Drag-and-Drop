import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import { addItem, updateItemOrder, updateSections } from '../redux/actions';
import './List.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';
import { AiOutlineDrag } from 'react-icons/ai'

const List = () => {
  const [showInput, setShowInput] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [showSectionInput, setShowSectionInput] = useState(false);
  const [newSectionText, setNewSectionText] = useState('');
  const dispatch = useDispatch();
  const items = useSelector((state) => state.items);
  const sections = useSelector((state) => state.sections);
  const newItemInputRef = useRef(null);
  const newSectionInputRef = useRef(null);

  const handleNewItemClick = () => {
    setShowInput(true);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleInputSubmit();
    }
  };

  const handleSectionInputKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSectionInputSubmit();
    }
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
    <div className='bg-warning'>
      <div className='card border border-0'>
        <h1 className='my-5 text-center'>Drag and Drop Task</h1>
        <div className='card-body mx-5'>
          <div className='row'>

            <DragDropContext onDragEnd={handleDragEnd}>

              <div className='col-6 '>
                <div className=''>
                  <Button onClick={handleNewItemClick} variant='success' className='fs-3 fw-bold btn btn-sm'>
                    Add New List Item
                  </Button>
                  {showInput && (
                    <div>
                      <div className='my-3 row'>
                        <input
                          type='text'
                          placeholder='Enter new item'
                          value={newItemText}
                          className='form-control h-100 w-50 border border-dark'
                          onChange={handleInputChange}
                          onKeyDown={handleInputKeyDown} // Add this line
                          ref={newItemInputRef} // Add this line                      
                        />
                      </div>
                      <Button onClick={handleInputSubmit} variant='primary'>
                        Create Item
                      </Button>
                    </div>
                  )}
                </div>

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
                              className='item-box mx-1 fs-5'
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
              </div>


              <div className='col-6'>
                <Button onClick={handleAddSectionClick} variant='success' className='fs-3 fw-bold'>
                  Add New Section
                </Button>
                {showSectionInput && (
                  <div className="mt-3">
                    <div className='row my-3 mx-1'>
                      <input
                        type='text'
                        placeholder='Enter new section name'
                        value={newSectionText}
                        className='form-control h-100 w-50 border border-dark'
                        onChange={handleSectionInputChange}
                        onKeyDown={handleSectionInputKeyDown} // Add this line
                        ref={newSectionInputRef} // Add this line

                      />
                    </div>
                    <div>
                      <Button onClick={handleSectionInputSubmit} variant='primary'>
                        Create Section
                      </Button>
                    </div>
                  </div>
                )}

                {sections.map((section, sectionIndex) => (
                  <Droppable key={section.id} droppableId={section.id} type="ITEM">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className='section-box bg-white text-dark p-3 mt-4 border border-dark section-box'
                      >
                        <h2 className='h4 mb-3'>{section.title}</h2>
                        {section.items.map((item, itemIndex) => (
                          <Draggable key={item.id} draggableId={item.id} index={itemIndex}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className='item-box'
                              >
                                <div className="item-content">{item.text}</div>
                                <div className="draggable-symbol" {...provided.dragHandleProps}>
                                  <AiOutlineDrag />
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>

            </DragDropContext>

          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
