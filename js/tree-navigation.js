// File tree navigation functionality
(function() {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const fileTree = document.querySelector('.file-tree');
    if (!fileTree) return;

    // Highlight current page
    highlightCurrentPage();

    // Expand parents of current page
    expandCurrentPageParents();

    // Add click handlers for folder toggles
    setupFolderToggles();

    // Store expansion state in sessionStorage
    restoreExpansionState();
  }

  function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('.tree-node-link');

    links.forEach(link => {
      const linkPath = new URL(link.href, window.location.origin).pathname;
      if (linkPath === currentPath) {
        link.classList.add('active');
      }
    });
  }

  function expandCurrentPageParents() {
    const activeLink = document.querySelector('.tree-node-link.active');
    if (!activeLink) return;

    // Find all parent folders and expand them
    let element = activeLink.closest('.tree-node');
    while (element) {
      const parentFolder = element.parentElement?.closest('.tree-folder');
      if (parentFolder) {
        parentFolder.classList.add('expanded');
      }
      element = parentFolder;
    }
  }

  function setupFolderToggles() {
    const headers = document.querySelectorAll('.tree-node-header[data-toggle="folder"]');

    headers.forEach(header => {
      header.addEventListener('click', function(e) {
        e.preventDefault();
        const folder = this.closest('.tree-folder');
        if (folder) {
          folder.classList.toggle('expanded');
          saveExpansionState();
        }
      });
    });
  }

  function saveExpansionState() {
    const expanded = [];
    document.querySelectorAll('.tree-folder.expanded').forEach(folder => {
      const label = folder.querySelector('.tree-label');
      if (label) {
        // Create a path identifier for this folder
        const path = getFolderPath(folder);
        expanded.push(path);
      }
    });
    sessionStorage.setItem('treeExpansionState', JSON.stringify(expanded));
  }

  function restoreExpansionState() {
    try {
      const saved = sessionStorage.getItem('treeExpansionState');
      if (!saved) return;

      const expanded = JSON.parse(saved);
      expanded.forEach(path => {
        const folder = findFolderByPath(path);
        if (folder) {
          folder.classList.add('expanded');
        }
      });
    } catch (e) {
      console.error('Error restoring tree state:', e);
    }
  }

  function getFolderPath(folder) {
    const labels = [];
    let current = folder;

    while (current && current.classList.contains('tree-folder')) {
      const label = current.querySelector(':scope > .tree-node-header .tree-label');
      if (label) {
        labels.unshift(label.textContent.trim());
      }
      current = current.parentElement?.closest('.tree-folder');
    }

    return labels.join(' > ');
  }

  function findFolderByPath(path) {
    const parts = path.split(' > ');
    let folders = Array.from(document.querySelectorAll('.file-tree > .tree-folder'));

    for (const part of parts) {
      const folder = folders.find(f => {
        const label = f.querySelector(':scope > .tree-node-header .tree-label');
        return label && label.textContent.trim() === part;
      });

      if (!folder) return null;

      if (part === parts[parts.length - 1]) {
        return folder;
      }

      // Get subfolders of current folder for next iteration
      folders = Array.from(folder.querySelectorAll(':scope > .tree-children > .tree-folder'));
    }

    return null;
  }

  // Add smooth scrolling to active item
  const activeLink = document.querySelector('.tree-node-link.active');
  if (activeLink) {
    setTimeout(() => {
      activeLink.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }
})();
