import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Button } from "primereact/button";
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { InputText } from "primereact/inputtext";

// external css
import "./Home.css";

export default function Home() {
    let [BOOKS, setBOOKS] = useState([])
    const [totalBooks, setTotalBooks] = useState(null)
    const [bookTitle, setBookTitle] = useState('')
    const [bookAuthor, setBookAuthor] = useState('')
    const [loading, setLoading] = useState(false);
    const [showAddNewBook, setShowAddNewBook] = useState(false)
    const [showBookDetails, setShowBookDetails] = useState(false)
    const [bookDetails, setBookDetails] = useState({})
    const [showEditBook, setShowEditBook] = useState(false)
    const [editBookId, setEditBookId] = useState(null)
    const [editedTitle, setEditedTitle] = useState('')
    const [editedAuthor, setEditedAuthor] = useState('')
    const [searchValue, setsetSearchValue] = useState('')
    const toast = useRef(null);
    let navigate = useNavigate();

    useEffect(() => {

        const config = {
            params: {
                offset: 0,
                count: 100
            },
            headers: {
                "x-auth-token": localStorage.getItem('lms-token')
            }
        };

        axios
            .get('http://localhost:5000/books', config)
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    const data = response.data
                    setBOOKS(data.books)
                    setTotalBooks(data.total)
                } else {
                    setBOOKS([])
                    setTotalBooks(0)
                }
            })
            .catch((err) => {
                const response = err.response
                if (response.status === 400) {
                    const errors = response.data.errors
                    if (errors && errors.length > 0) {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: errors[0].msg });
                    }
                } 
                else if (response.status === 500) {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
                }
                else if (response.status === 401) {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: response.data.msg });
                    localStorage.removeItem('lms-token')
                    setTimeout(() => {
                        navigate('/login')
                    }, 2000)
                }
            });
    }, []);

    function deleteBook(book) {
        setLoading(true);

        const config = {
            data: {
                book_id: book.book_id
            },
            headers: {
                "x-auth-token": localStorage.getItem('lms-token')
            }
        };

        axios
            .delete('http://localhost:5000/books', config)
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    const data = response.data
                    BOOKS = BOOKS.filter((item) => item.book_id !== book.book_id);
                    setBOOKS(BOOKS)
                    toast.current.show({ severity: 'success', summary: 'Success', detail: data.msg });
                }
                setLoading(false)
            })
            .catch((err) => {
                const response = err.response
                if (response.status === 400) {
                    const errors = response.data.errors
                    if (errors && errors.length > 0) {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: errors[0].msg });
                    }
                }

                if (response.status === 500) {
                    const errors = response.data.errors
                    toast.current.show({ severity: 'error', summary: 'Error', detail: errors[0].msg });
                }
                setLoading(false)
            });

        setLoading(false)
    }

    function editBook(book) {
        setEditedTitle(book.title)
        setEditedAuthor(book.author)
        setEditBookId(book.book_id)
        setShowEditBook(true)
    }

    function addNewBook() {
        if (bookTitle == '' || bookAuthor == '') return

        const data = {
            title: bookTitle,
            author: bookAuthor
        };

        const headers = {
            "x-auth-token": localStorage.getItem('lms-token')
        }

        axios
            .post('http://localhost:5000/books', data, { headers })
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    const data = response.data
                    BOOKS.unshift(data.book)
                    setTotalBooks(totalBooks + 1)
                    toast.current.show({ severity: 'success', summary: 'Success', detail: data.msg });
                }
            })
            .catch((err) => {
                const response = err.response
                if (response.status === 400) {
                    const errors = response.data.errors
                    if (errors && errors.length > 0) {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: errors[0].msg });
                    }
                }

                if (response.status === 500) {
                    const errors = response.data.errors
                    toast.current.show({ severity: 'error', summary: 'Error', detail: errors[0].msg });
                }
            });

        setBookTitle('')
        setBookAuthor('')
        setShowAddNewBook(false)
    }

    function cancelAddNewBook() {
        setBookTitle('')
        setBookAuthor('')
        setShowAddNewBook(false)
    }

    function showBookDetailsHandler(book) {
        setShowBookDetails(true)
        setBookDetails({
            title: book.title,
            author: book.author
        })
    }

    function cancelEditBookHandler() {
        setEditedTitle('')
        setEditedAuthor('')
        setShowEditBook(false)
    }

    function saveEditBookHandler() {
        if (editedTitle == '' || editedAuthor == '') return

        setLoading(true)
        const data = {
            book_id: editBookId,
            title: editedTitle,
            author: editedAuthor
        };
        const headers = {
            "x-auth-token": localStorage.getItem('lms-token')
        }

        axios
            .put('http://localhost:5000/books', data, { headers })
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    const data = response.data
                    BOOKS = BOOKS.filter(item => item.book_id !== data.book.book_id)
                    BOOKS.unshift(data.book)
                    setBOOKS(BOOKS)
                    toast.current.show({ severity: 'success', summary: 'Success', detail: data.msg });
                }
                setLoading(false)
            })
            .catch((err) => {
                const response = err.response
                if (response.status === 400) {
                    const errors = response.data.errors
                    if (errors && errors.length > 0) {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: errors[0].msg });
                    }
                }

                if (response.status === 500) {
                    const errors = response.data.errors
                    toast.current.show({ severity: 'error', summary: 'Error', detail: errors[0].msg });
                }
                setLoading(false)
            });

        setShowEditBook(false)
    }

    function searchBook() {
        const data = {
            searchValue: searchValue
        };

        const headers = {
            "x-auth-token": localStorage.getItem('lms-token')
        }

        axios
            .post('http://localhost:5000/books/search', data, { headers })
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    const data = response.data
                    setBOOKS(data.books)
                    setTotalBooks(data.books.length)
                }
            })
            .catch((err) => {
                const response = err.response
                if (response.status === 400) {
                    const errors = response.data.errors
                    if (errors && errors.length > 0) {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: errors[0].msg });
                    }
                }

                if (response.status === 500) {
                    const errors = response.data.errors
                    toast.current.show({ severity: 'error', summary: 'Error', detail: errors[0].msg });
                }
            });
    }

    return (
        <div className="books">
            <div className="add-new">
                <span className="p-input-icon-left margin-left-search">
                    <i className="pi pi-search" />
                    <InputText
                        className="search-book"
                        value={searchValue}
                        onChange={e => setsetSearchValue(e.target.value)}
                        placeholder="Search books"
                    />
                    <Button
                        label="Search"
                        className="p-button-success search-button"
                        style={{ fontWeight: 'bold' }}
                        onClick={searchBook}
                    />
                </span>
                <Button
                    label="Add new book"
                    className="p-button-success"
                    style={{ fontWeight: 'bold' }}
                    onClick={() => setShowAddNewBook(true)}
                />
            </div>
            <div className="books-list">
                {BOOKS.map((item) => {
                    return (
                        <div
                            key={item.book_id}
                            className=""
                        >
                            <div className="book-container">
                                <div className='book' onClick={() => showBookDetailsHandler(item)}>
                                    <div className="book-title">{item.title}</div>
                                    <div className="author">by {item.author}</div>
                                </div>
                                <div className="action-container">
                                    <i
                                        id={item.book_id}
                                        className="pi pi-pencil"
                                        onClick={(e) =>
                                            editBook(item)
                                        }
                                    ></i>
                                    <i
                                        id={item.book_id}
                                        className="pi pi-trash"
                                        style={{
                                            marginLeft: "1rem",
                                            color: "red",
                                        }}
                                        onClick={(e) =>
                                            deleteBook(item)
                                        }
                                    ></i>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {BOOKS.length <= 0 ? <div className="no-books">No books found</div> : ''}
            </div>

            <Dialog header="Add new book" visible={showAddNewBook} maximizable style={{ width: '40vw' }} onHide={() => setShowAddNewBook(false)}>

                <div className="title-container">
                    <div className="label">Title</div>
                    <InputText
                        value={bookTitle}
                        onChange={e => setBookTitle(e.target.value)}
                        placeholder="Title"
                    />
                </div>
                <div className="author-container">
                    <div className="label">Author</div>
                    <InputText
                        value={bookAuthor}
                        onChange={e => setBookAuthor(e.target.value)}
                        placeholder="Author"
                    />
                </div>
                <div className="actions-container">
                    <Button label="Close" className="p-button-secondary margin-right" onClick={cancelAddNewBook} />
                    <Button label="Save" className="p-button-success" onClick={addNewBook} />
                </div>

            </Dialog>

            <Dialog header="Book details" visible={showBookDetails} maximizable style={{ width: '80vw', height: '80vw' }} onHide={() => setShowBookDetails(false)}>
                <div className="book-details-title-container">
                    <div className="book-details-label">Title:</div>
                    <div className="book-details-title">{bookDetails.title}</div>
                </div>
                <div className="book-details-author-container">
                    <div className="book-details-label">Author:</div>
                    <div className="book-details-author">{bookDetails.author}</div>
                </div>
            </Dialog>

            <Dialog header="Edit book" visible={showEditBook} maximizable style={{ width: '40vw' }} onHide={() => setShowEditBook(false)}>

                <div className="title-container">
                    <div className="label">Title</div>
                    <InputText
                        value={editedTitle}
                        onChange={e => setEditedTitle(e.target.value)}
                        placeholder="Title"
                    />
                </div>
                <div className="author-container">
                    <div className="label">Author</div>
                    <InputText
                        value={editedAuthor}
                        onChange={e => setEditedAuthor(e.target.value)}
                        placeholder="Author"
                    />
                </div>
                <div className="actions-container">
                    <Button label="Cancel" className="p-button-secondary margin-right" onClick={cancelEditBookHandler} />
                    <Button label="Save" className="p-button-success" onClick={saveEditBookHandler} />
                </div>

            </Dialog>

            <Toast ref={toast} />
        </div>
    );
}
