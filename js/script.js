const RENDER_EVENT = "render-books";
let bookList = [];

function checkForStorage() {
  return typeof Storage !== "undefined";
}

const putBookList = (data) => {
  let allBooks = [];
  if (checkForStorage()) {
    if (localStorage.getItem("books") !== null) {
      allBooks = JSON.parse(localStorage.getItem("books"));
    }

    allBooks.unshift(data);

    localStorage.setItem("books", JSON.stringify(allBooks));
  } else {
    allBooks.push(data);
  }
};

const getBookList = () => {
  if (checkForStorage()) {
    return JSON.parse(localStorage.getItem("books")) || [];
  } else {
    return [];
  }
};

const generatedId = () => {
  return +new Date();
};

const generatedBookObject = (id, title, author, year, isComplete) => {
  return { id, title, author, year, isComplete };
};

const addBook = () => {
  const bookTitle = document.getElementById("bookTitle").value;
  const bookAuthor = document.getElementById("bookAuthor").value;
  const bookYear = document.getElementById("bookYear").value;
  const isComplete = document.getElementById("isComplete").checked;

  const generatedBookId = generatedId();
  const bookObject = generatedBookObject(
    generatedBookId,
    bookTitle,
    bookAuthor,
    parseInt(bookYear),
    isComplete
  );

  putBookList(bookObject);
  console.log(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
};

const makeBook = (bookObject) => {
  const { id, title, author, year, isComplete } = bookObject;

  const cardContainer = document.createElement("div");
  cardContainer.classList.add(
    "card-container",
    "border",
    "border-success",
    "rounded"
  );
  cardContainer.setAttribute("id", `book-${id}`);

  const bookContainer = document.createElement("div");
  bookContainer.classList.add("book");

  const textBookTitle = document.createElement("h5");
  textBookTitle.classList.add("book-title");
  textBookTitle.textContent = title;

  const textBookAuthor = document.createElement("p");
  textBookAuthor.classList.add("book-author");
  textBookAuthor.textContent = `Penulis : ${author}`;

  const textBookYear = document.createElement("p");
  textBookYear.classList.add("book-year");
  textBookYear.textContent = `Tahun : ${year}`;

  bookContainer.append(textBookTitle, textBookAuthor, textBookYear);
  cardContainer.appendChild(bookContainer);

  if (isComplete) {
    const undoButton = document.createElement("button");
    undoButton.classList.add(
      "ri-arrow-go-back-line",
      "btn",
      "btn-sm",
      "btn-success"
    );
    undoButton.textContent = "Baca ulang";
    undoButton.addEventListener("click", function () {
      undoBookFromCompleted(id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add(
      "ri-delete-bin-line",
      "btn",
      "btn-sm",
      "btn-danger"
    );
    trashButton.textContent = "Buang";
    trashButton.addEventListener("click", function () {
      removeBook(id);
    });

    bookContainer.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("ri-check-line", "btn", "btn-sm", "btn-primary");
    checkButton.textContent = "Sudah baca";
    checkButton.addEventListener("click", function () {
      addBookToCompleted(id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add(
      "ri-delete-bin-line",
      "btn",
      "btn-sm",
      "btn-danger"
    );
    trashButton.textContent = "Buang";
    trashButton.addEventListener("click", function () {
      removeBook(id);
    });

    bookContainer.append(checkButton, trashButton);
  }

  return cardContainer;
};

const removeBook = (idBook) => {
  bookList = getBookList();
  const bookTarget = bookList.findIndex((book) => book.id === idBook);
  if (bookTarget !== -1) {
    bookList = bookList.filter((book) => book.id !== idBook);
    localStorage.setItem("books", JSON.stringify(bookList));
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
};

const addBookToCompleted = (idBook) => {
  bookList = getBookList();
  bookList.forEach((book) => {
    if (book.id === idBook) {
      book.isComplete = true;
    }
  });
  localStorage.setItem("books", JSON.stringify(bookList));
  document.dispatchEvent(new Event(RENDER_EVENT));
};

const undoBookFromCompleted = (idBook) => {
  bookList = getBookList();
  bookList.forEach((book) => {
    if (book.id === idBook) {
      book.isComplete = false;
    }
  });
  localStorage.setItem("books", JSON.stringify(bookList));
  document.dispatchEvent(new Event(RENDER_EVENT));
};

const searchBook = (keywordBook) => {
  bookList = getBookList();
  return bookList.filter((book) =>
    book.bookTitle.toLowerCase().includes(keywordBook)
  );
};

document.getElementById("search-book").addEventListener("input", (event) => {
  const keywordBook = event.target.value.toLowerCase();
  const searchResult = searchBook(keywordBook);

  displayBooks(searchResult);
});

const displayBooks = (data) => {
  const uncompletedBooks = document.getElementById("uncompleted-books");
  const completedBooks = document.getElementById("completed-books");

  uncompletedBooks.innerHTML = "";
  completedBooks.innerHTML = "";

  data.forEach((book) => {
    const bookElement = makeBook(book);
    if (book.isComplete) {
      completedBooks.append(bookElement);
    } else {
      uncompletedBooks.append(bookElement);
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  bookList = getBookList();
  displayBooks(bookList);
  const submitForm = document.getElementById("form");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
});

document.addEventListener(RENDER_EVENT, () => {
  document.getElementById("bookTitle").value = "";
  document.getElementById("bookAuthor").value = "";
  document.getElementById("bookYear").value = "";
  document.getElementById("isComplete").checked = "";

  bookList = getBookList();
  displayBooks(bookList);
});
