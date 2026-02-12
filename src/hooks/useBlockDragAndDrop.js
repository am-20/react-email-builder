/**
 * useBlockDragAndDrop - Custom hook for drag & drop functionality
 * 
 * Handles all drag and drop event handlers for block elements:
 * - Mouse enter/leave for hover effects
 * - Drag start/over/leave/drop for reordering
 * - Click for block selection
 * 
 * @param {object} params
 * @param {object} params.block - Block data
 * @param {number} params.index - Block index
 * @param {boolean} params.isNestedBlock - Whether block is nested
 * @param {string} params.type - Block type
 * @param {function} params.setHoveredBlockId - Set hovered block ID
 * @param {function} params.setActiveBlockId - Set active block ID
 * @param {function} params.handleDragStart - Drag start handler
 * @param {function} params.handleDragOver - Drag over handler
 * @param {function} params.handleDrop - Drop handler
 * @param {function} params.setDragOverIndex - Set drag over index
 * @param {function} params.shouldStopDragPropagation - Check if should stop propagation
 * 
 * @returns {object} Event handlers for drag & drop
 */
export const useBlockDragAndDrop = ({
    block,
    index,
    isNestedBlock,
    type,
    setHoveredBlockId,
    setActiveBlockId,
    handleDragStart,
    handleDragOver,
    handleDrop,
    setDragOverIndex,
    shouldStopDragPropagation,
  }) => {
    const dragHandlers = {
      onMouseEnter: () => setHoveredBlockId(block.id),
      
      onMouseLeave: () => setHoveredBlockId(null),
      
      onDragStart: (e) => {
        e.stopPropagation();
        handleDragStart(e, block);
      },
      
      onDragOver: (e) => {
        if (shouldStopDragPropagation(e, isNestedBlock, type)) return;
        e.preventDefault();
        e.stopPropagation();
        handleDragOver(e, index);
      },
      
      onDragLeave: (e) => {
        if (shouldStopDragPropagation(e, isNestedBlock, type)) return;
        e.stopPropagation();
        setDragOverIndex(null);
      },
      
      onDrop: (e) => {
        if (shouldStopDragPropagation(e, isNestedBlock, type)) return;
        e.preventDefault();
        e.stopPropagation();
        handleDrop(e, index);
      },
      
      onClick: (e) => {
        if (isNestedBlock) e.stopPropagation();
        setActiveBlockId(block.id);
      },
    };
  
    return dragHandlers;
  };