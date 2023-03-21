export function getSavedBookIds() {
  const savedBookIds = JSON.parse(localStorage.getItem('saved_books')) || [];
  return savedBookIds;
}

export function saveBookIds(bookIdArr) {
  if (bookIdArr.length) {
    localStorage.setItem('saved_books', JSON.stringify(bookIdArr));
  } else {
    localStorage.removeItem('saved_books');
  }
}

export function removeBookId(bookId) {
  const savedBookIds = JSON.parse(localStorage.getItem('saved_books')) || [];

  if (!savedBookIds.includes(bookId)) {
    return false;
  }

  const updatedSavedBookIds = savedBookIds.filter((id) => id !== bookId);
  localStorage.setItem('saved_books', JSON.stringify(updatedSavedBookIds));

  return true;
}
