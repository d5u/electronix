const { ipcRenderer } = require('electron');
const items = require('./items');

// dom nodes
const showModal = document.getElementById('show-modal');
const closeModal = document.getElementById('close-modal');
const modal = document.getElementById('modal');
const addItem = document.getElementById('add-item');
const itemUrl = document.getElementById('url');
const search = document.getElementById('search');

// filter items with "search"
search.addEventListener('keyup', (e) => {
  // loop items
  Array.from(document.getElementsByClassName('read-item')).forEach((item) => {
    // hide items that don't match search value
    const hasMatch = item.innerText.toLowerCase().includes(search.value);
    item.style.display = hasMatch ? 'flex' : 'none';
  });
});

// navigate item selection with up/down arrows
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    items.changeSelection(e.key);
  }
});

// toogle modal buttons
const toggleModalButtons = () => {
  // check state
  if (addItem.disabled === true) {
    addItem.disabled = false;
    addItem.style.opacity = 1;
    addItem.innerText = 'Add Item';
    closeModal.style.display = 'inline';
  } else {
    addItem.disabled = true;
    addItem.style.opacity = 0.5;
    addItem.innerText = 'Adding...';
    closeModal.style.display = 'none';
  }
};

// show modal
showModal.addEventListener('click', e => {
  modal.style.display = 'flex'
  itemUrl.focus();
});

// close modal
closeModal.addEventListener('click', (e) => {
  modal.style.display = 'none'
});

// handle new item
addItem.addEventListener('click', (e) => {
  // check a url exists
  if (itemUrl.value) {
    // send new item url to main process
    ipcRenderer.send('new-item', itemUrl.value);
    // disable modal buttons
    toggleModalButtons();
  }
});

// listen for new item from main process
ipcRenderer.on('new-item-success', (e, newItem) => {
  // add new itme to "items" node
  items.addItem(newItem, true);

  // enable button
  toggleModalButtons();

  // hide modal and clear value
  modal.style.display = 'none';
  itemUrl.value = '';
});

// listen for keyboard submit
itemUrl.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') addItem.click();
});
