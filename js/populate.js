// ==============================================================
// When the form is submitted, this script performs an AJAX call
// handled by the controller (c_search.php), which will use the
// (m_bookAPIModel.php) to query the Google Books API.
// 
// The returned data consists of objects called "Volumes", 
// which will be used to populate the rows with books.
// 
// More info on working with volmes: http://goo.gl/GCp5DW
//
// Input:
//      userInput -- The search string entered by the user.
//
// Output:
//      The output consists of rows of books. Each row contains a
//      maximum of 3 books. 
// ==============================================================
$('#searchButton').click( function(event) {

    // Fetch user input
    var userInput = document.getElementById('searchInput').value;
    var sortType = $('#orderBy').html();

    // Before making an AJAX call, validate the user input.
    if(validateInput(userInput) == false) {
        return;
    }

    // Attempt to post the user input to the search controller.
    $.ajax({
        type: "POST",
        url: "c_search/search",
        data: { input  : userInput,
                sortBy : sortType },
        dataType: "json",
        beforeSend: function() {
            $('.ajax-loader').show();
        },
        complete: function(){
            $('.ajax-loader').hide();
        },
        success: function(bookInfo) {

            // Clear previous search results, if any.
            clearBooksContainer();

            // Add the search header 
            // (i.e. "55 Results for Albert Einstein").
            addSearchHeader(bookInfo.totalItems, userInput);

            // Check if results > 0, else exit.
            if(bookInfo.totalItems == 0) {
                displayError();
                return;
            }

            // Create book nodes & append them to the current row.
            for (var i = 0; i < bookInfo.items.length; i++) {
                
                // Select a book
                var item = bookInfo.items[i];

                // If a row is already filled, create new row.
                if((i % 3) == 0) addNewRow();

                // Check if a property is defined before accessing.
                var price = ("listPrice" in item.saleInfo) 
                            ? "$" + item.saleInfo.listPrice.amount 
                            : "No price listed";
                var publisher = ("publisher" in item.volumeInfo) 
                            ? item.volumeInfo.publisher 
                            : "Publisher not listed";
                var pubDate = ("publishedDate" in item.volumeInfo) 
                            ? (item.volumeInfo.publishedDate).substring(0, 4) 
                            : "Publication date not listed";
                var authors = ("authors" in item.volumeInfo) 
                            ? item.volumeInfo.authors 
                            : "No author listed";
                var img = ("imageLinks" in item.volumeInfo) 
                            ? item.volumeInfo.imageLinks.thumbnail 
                            : getDefaultThumb();
                var title = ("title" in item.volumeInfo) 
                            ? item.volumeInfo.title 
                            : "No title listed";


                // Create the book entry & populate the information fields.
                var bookNode = document.createElement('div');
                    $(bookNode).addClass("col-md-4 portfolio-item")
                               .html(createBook(title, authors, 
                                                publisher, pubDate, 
                                                price, img));

                // Insert book into its respective row.
                $("div.row", "#booksContainer").last().append(bookNode);

            }// end for
        }, // end success



        error: function(xhr, status, error) {
                  alert(xhr + status + error);
                }

    }) // end ajax

    event.preventDefault();

}); // end click event



// ==============================================================
// This function adds a new row to the document when the current
// row is full. Rows consist of a div element of class "row".
// 
// Input:
//      Nothing.
//
// Output:
//      Nothing.
// ============================================================== 
function addNewRow() {

    var row = document.createElement('div');
        $(row).addClass("row");
        $(row).appendTo("#booksContainer");

} // end "addNewRow"


// ==============================================================
// This function creates the HTML for a new book that will be 
// appended to a row. The HTML uses Bootstrap's responsive image
// class to size up the thumbnail.
//
// Input: 
//      title       -- Book title.
//      authors     -- Author Name(s).
//      publisher   -- Publisher name.
//      pubDate     -- Publication date.
//      price       -- Book price.
//      img         -- Thumbnail image.
//
// Output:
//      newBook     -- HTML for a new book node.
// ==============================================================
function createBook(title, authors, publisher, pubDate, price, img) {

    var newBook = 
        //<center>' +
            '<img class="img-responsive img-thumbnail"' +
                 'src="' +  img + '">' +
            '<h3>' + title + '</h3>' + 
            '<h5>by ' + authors + '</h5>' + 
            '<small><em>' + publisher + ", " + '</em></small>' + 
            '<small><em>' +  pubDate + '</em></small><br />' + 
            '<h4>' + price + '</h4>';
       //  '</center>';

    return newBook;

} // end "createBook"



// ==============================================================
// This function creates a div element of class "row" and appends 
// a div element of class "col-lg-12". This serves as the header 
// of the search results (i.e. 700 Search results for "Albert 
// Einstein").
//
// Input:
//      numResults      -- The number of results found in the
//                      search.
//      formInput       -- The search string.
//
// Output:
//      Nothing.
// ==============================================================
function addSearchHeader(numResults, formInput) {

    // Create div elements and add classes.
    var row = document.createElement('div');
        $(row).addClass("row");
    var header = document.createElement('div');
        $(header).addClass("col-lg-12")
                 .html(
                        '<h1 class="page-header">' + 
                            numResults + 
                        ' Search results for ' +  
                        '"' + formInput + '"' +
                        '</h1>'
                    );

    // Append elements.
    $(row).append(header);
    $('#booksContainer').append(row);
    return;

} // end "addSearchHeader"



// ==============================================================
// This function clears the results panel when a new search 
// is invoked. 
// 
// Input:
//      Nothing.
// 
// Output:
//      Nothing.
// ==============================================================
function clearBooksContainer() {

    $('#booksContainer').empty();
    return;

} // end of "clearBooksContainer"



// ==============================================================
// This function returns a default thumbnail link used for books
// that do not contain a thumbnail.
//
// Input:
//      Nothing.
//
// Output:
//      Nothing.
// ==============================================================
function getDefaultThumb() {

    return "http://www.neiu.edu/~insights/Nov10/images/NoPhoto.jpg";

} // end "getDefaultThumb"



// ==============================================================
// This function displays an error message for a bogus input.
//
// Input:
//      Nothing.
// 
// Output:
//      Nothing.
// ==============================================================
function displayError() {

    $('#booksContainer').notify("Oh snap! You got an error! " + 
                                "Please refine your search and try again", 
                                "error");

} // end "displayError"


// ==============================================================
// This function validates the user input by checking bogus
// inputs, such as no input or whitespace.
//
// Input:
//      userInput       -- The search string.
//
// Output:
//      If valid, return true. Else, false.
// ==============================================================
function validateInput(userInput) {

    if(userInput.trim().length == 0) {
        return false;
    }
    else {
        return true;
    }
}
