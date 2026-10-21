const { nanoid } = require('nanoid');
const books = require('./books');

// Kriteria 3: API dapat menyimpan buku
const addBookHandler = (req, res) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = req.body;

  // Validasi jika name tidak dilampirkan
  if (!name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
  }

  // Validasi jika readPage lebih besar dari pageCount
  if (readPage > pageCount) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    return res.status(201).json({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
};

// Kriteria 4 & Fitur Opsional: Tampilkan seluruh buku + Query parameters filter
const getAllBooksHandler = (req, res) => {
  const { name, reading, finished } = req.query;

  let filteredBooks = [...books];

  // Fitur Opsional: Filter berdasarkan Query ?name
  if (name) {
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  // Fitur Opsional: Filter berdasarkan Query ?reading
  if (reading !== undefined) {
    const isReading = reading === '1';
    filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
  }

  // Fitur Opsional: Filter berdasarkan Query ?finished
  if (finished !== undefined) {
    const isFinished = finished === '1';
    filteredBooks = filteredBooks.filter((book) => book.finished === isFinished);
  }

  // Format data keluaran agar hanya menampilkan id, name, dan publisher sesuai kriteria
  const mapBooks = filteredBooks.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  return res.status(200).json({
    status: 'success',
    data: {
      books: mapBooks,
    },
  });
};

// Kriteria 5: API dapat menampilkan detail buku
const getBookByIdHandler = (req, res) => {
  const { bookId } = req.params;
  const book = books.find((b) => b.id === bookId);

  if (book) {
    return res.status(200).json({
      status: 'success',
      data: {
        book,
      },
    });
  }

  return res.status(404).json({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
};

// Kriteria 6: API dapat mengubah data buku
const editBookByIdHandler = (req, res) => {
  const { bookId } = req.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = req.body;

  // Validasi jika name tidak dilampirkan
  if (!name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
  }

  // Validasi jika readPage lebih besar dari pageCount
  if (readPage > pageCount) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
  }

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    const updatedAt = new Date().toISOString();
    const finished = pageCount === readPage;

    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    return res.status(200).json({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
  }

  return res.status(404).json({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
};

// Kriteria 7: API dapat menghapus buku
const deleteBookByIdHandler = (req, res) => {
  const { bookId } = req.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    return res.status(200).json({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
  }

  return res.status(404).json({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
