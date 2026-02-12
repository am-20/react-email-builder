import { useState } from 'react';

/**
 * useImageUpload - Custom hook for handling image uploads in blocks
 * 
 * Manages image upload logic for different block types:
 * - Generic image blocks
 * - Header images
 * - Button images
 * - Column images
 * - Nested block images
 * 
 * @param {number} index - Block index in template
 * @param {object} settings - Block settings
 * @param {object} block - Current block data
 * @param {function} setTemplate - State setter for template
 * @param {function} addFileAsset - Function to process and store uploaded file
 * @param {function} handleUpdateBlockSettings - Function to update block settings (for nested blocks)
 * @param {function} handleUpdateBlockContent - Function to update block content (for nested blocks)
 * @param {boolean} isNestedBlock - Whether this is a nested block
 * 
 * @returns {object} - { manualUrlValue, setManualUrlValue, handleImageUpload }
 */
export const useImageUpload = ({
  index,
  settings,
  block,
  setTemplate,
  addFileAsset,
  handleUpdateBlockSettings,
  handleUpdateBlockContent,
  isNestedBlock = false,
}) => {
  const [manualUrlValue, setManualUrlValue] = useState(
    settings?.imagePath || block?.imagePath || ''
  );

  /**
   * Handle image file upload
   * 
   * @param {Event} e - File input change event
   * @param {number|null} buttonIndex - Index of button (for button images)
   * @param {number|null} columnIndex - Index of column (for column images)
   * @param {boolean} isHeader - Whether this is a header image
   */
  const handleImageUpload = (
    e,
    buttonIndex = null,
    columnIndex = null,
    isHeader = false
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Process file and get asset info { path: "i/1.png", previewUrl: "blob:..." }
    const asset = addFileAsset(file);

    // SPECIAL CASE: ALL nested blocks (not just headers)
    // Nested blocks must use handleUpdateBlockSettings/Content instead of setTemplate
    // because their index is relative to parent's children array, not main blocks array
    if (isNestedBlock && buttonIndex === null && columnIndex === null) {
      handleUpdateBlockSettings(index, 'imagePath', asset.path);
      handleUpdateBlockSettings(index, 'imagePreviewUrl', asset.previewUrl);
      
      // For image-type blocks, also update content
      if (block.type === 'image') {
        handleUpdateBlockContent(index, asset.previewUrl);
      }
      
      // Clean up legacy imageUrl if present (for headers)
      if (settings && 'imageUrl' in settings) {
        // Can't delete via handleUpdateBlockSettings, but imagePath takes precedence
      }
      
      setManualUrlValue(asset.path);
      return;
    }

    // NORMAL CASE: Update template directly
    setTemplate((prev) => {
      const newBlocks = [...prev.blocks];
      const blk = newBlocks[index];

      if (buttonIndex !== null) {
        // BUTTON IMAGE
        const btn = blk.buttons[buttonIndex];
        btn.settings = {
          ...(btn.settings || {}),
          imagePath: asset.path,
          imagePreviewUrl: asset.previewUrl,
        };
      } else if (columnIndex !== null) {
        // COLUMNS / COLUMN CONTENT IMAGE
        const col = blk.columns[columnIndex] || {};
        col.imagePath = asset.path;
        col.imagePreviewUrl = asset.previewUrl;

        // Legacy fallback if some old column types still read content
        if (typeof col.content !== 'undefined') {
          col.content = asset.previewUrl;
        }

        blk.columns[columnIndex] = col;
      } else if (isHeader) {
        // HEADER IMAGE
        blk.settings = {
          ...(blk.settings || {}),
          imagePath: asset.path,
          imagePreviewUrl: asset.previewUrl,
        };

        // Clean up legacy imageUrl if present
        if (blk.settings && 'imageUrl' in blk.settings) {
          delete blk.settings.imageUrl;
        }
      } else {
        // GENERIC IMAGE BLOCKS
        blk.settings = {
          ...(blk.settings || {}),
          imagePath: asset.path,
          imagePreviewUrl: asset.previewUrl,
        };

        // Only image-type blocks should have their content replaced by the blob
        if (blk.type === 'image') {
          blk.content = asset.previewUrl;
        }
      }

      newBlocks[index] = blk;
      return { ...prev, blocks: newBlocks };
    });

    setManualUrlValue(asset.path);
  };

  return {
    manualUrlValue,
    setManualUrlValue,
    handleImageUpload,
  };
};