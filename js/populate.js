// ==============================================================
// When the form is submitted, this script performs an AJAX call
// handled by the controller (c_search.php), which will use the
// (m_bookAPIModel.php) to query the Google Books API. More data
// is loaded via AJAX calls when the user reaches the bottom of
// the page and clicks the "load more" button.
// 
// The returned data consists of objects called "Volumes", 
// which will be used to populate the rows with books.
// 
// More info on working with volmes: http://goo.gl/GCp5DW
//
// Global Vars:
//      userInput   -- The search string entered by the user.
//      sortType    -- The desired sort method.
//      currentPage -- The index of the current page.
//      currentIndex -- The index at which we began fetching data
//      finished    -- Refers to the final AJAX execution call,
//                     is true by default, set to false if there
//                     is more data to load.
//
// Output:
//      The output consists of rows of books. Each row contains a
//      maximum of 3 books.
// ==============================================================

    // Global Vars
    var userInput = "";
    var sortType = "";
    var numPerPage = 10;
    var currentPage = 1;
    var finished = true;


// Responds to the "load more" button.
$('#loading-button').click(function () {

    if(finished == false) {

        // Show button "loading" state.
        $(this).button('loading');

        // Increment the page #
        ++currentPage;

        // Request more data
        processAJAX(userInput, sortType, currentPage, numPerPage);

    }
});


// Responds to search button clicks. 
$('#searchButton').click( function(event) {

    // Fetch user input
    userInput = $('#searchInput').val();
    sortType = $('#orderBy').html();
    numPerPage = $('#numPerPage').html();

    // Before making an AJAX call, validate the user input.
    if(validateInput(userInput) == false) {
        return;
    }

    // Clear previous search results, if any.
    clearBooksContainer();

    // Reset the current page #
    currentPage = 1;

    // Hide lower buttons.
    $('#loading-button').hide();
    $('#back-to-top').hide();

    // Request data
    processAJAX(userInput, sortType, currentPage, numPerPage);

    event.preventDefault();

}); // end of search button handler.


// Responds to "back to top" button, and takes the user back
// to the top of the page.
$('#back-to-top').click(function() {

    $("html, body").animate({scrollTop: 0}, 1000);

})



// ==============================================================
// This function uses the userInput, sortType, and the number of
// results to display per page to process AJAX calls. It is 
// called when the user first submits a search, and also when
// the users clicks on the "Load More" button at the bottom of
// each search result.
//
// Input:
//      userInput       -- The user's search string.
//      sortType        -- The user's desired sort type.
//      currentPage     -- The number of pages that have loaded.
//      numPerPage      -- The number of books to load per page.
//
// Output:
//      If all goes well, more content will be loaded.
// ==============================================================
function processAJAX(userInput, sortType, currentPage, numPerPage) {

    finished = false;

    // Attempt to post the user input to the search controller.
    $.ajax({
        type: "POST",
        url: "index.php/c_search/search",
        data: { _input      : userInput,
                _sortBy     : sortType,
                _currPage   : currentPage,
                _numPer     : numPerPage },
        dataType: "json",
        beforeSend: function() {
            // Loading spinner Show
            $('.ajax-loader').show();
        },
        complete: function(){
            // Loading spinner Hide
            $('.ajax-loader').hide();
            $('#loading-button').button('reset');
        },
        success: function(bookInfo) {

            // If ajax call receives no results, display an
            // error message and abort.
            if(bookInfo.totalItems == 0) {
                displayError();
                return false;
            }
            else {
                // Add the search header to each page.
                // (i.e. "700 Results found for..." etc.)
                addSearchHeader(bookInfo.totalItems, userInput, 
                                        currentPage, numPerPage);
            }

            // If there is no more data to display, we are finished.
            if(bookInfo.items.length < numPerPage) { 
                finished = true; 
            }

            // This loop creates "books" and appends each to the current
            // row. Each row contains 3 books maximum. 
            for (var i = 0; i < bookInfo.items.length; i++) {
                
                // Select a book
                var item = bookInfo.items[i];

                // If a row is already filled, create new row.
                if((i % 3) == 0) addNewRow();

                // Check if a property is defined before accessing.
                var price = ("saleInfo" in item) && 
                            ("listPrice" in item.saleInfo) 
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

                // Insert book into the current row.
                $("div.row", "#booksContainer").last().append(bookNode);

            }// end for

            // Show the "Load More" and "Back to top" buttons
            $('#loading-button').show();
            $('#back-to-top').show();


        }, // end success

        error: function(jqXHR, exception) {
            if (jqXHR.status === 0) {
                alert('Not connected.\n Verify Network.');
            } else if (jqXHR.status == 404) {
                alert('Requested page not found. [404]');
            } else if (jqXHR.status == 500) {
                alert('Internal Server Error [500].');
            } else if (exception === 'parsererror') {
                alert('Requested JSON parse failed.');
            } else if (exception === 'timeout') {
                alert('Time out error.');
            } else if (exception === 'abort') {
                alert('Ajax request aborted.');
            } else {
                alert('Uncaught Error.\n' + jqXHR.responseText);
            }

            // Decrement page on error.
            --currentPage;

        } // end error

    }) // end ajax

} // end click event


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
// added to a row. The HTML uses Bootstrap's responsive image
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
        '<center>' +
            '<img class="img-responsive img-thumbnail"' +
                 'src="' +  img + '">' +
            '<h3>' + title + '</h3>' + 
            '<h5>by ' + authors + '</h5>' + 
            '<small><em>' + publisher + ", " + '</em></small>' + 
            '<small><em>' +  pubDate + '</em></small><br />' + 
            '<h4>' + price + '</h4>'
        '</center>';

    return newBook;

} // end "createBook"



// ==============================================================
// This function creates a div element of class "row" and appends 
// a div element of class "col-lg-12". The header 
//
// Input:
//      numResults      -- The number of results found in the
//                      search.
//      formInput       -- The search string.
//
// Output:
//      Nothing.
// ==============================================================
function addSearchHeader(numResults, formInput, currentPage, numPerPage) {

    // Calculate current indices being displayed.
    var highIndex = (currentPage * numPerPage);
    var lowIndex  = ((highIndex) - numPerPage) + 1;

    // Create div elements and add classes.
    var row = document.createElement('div');
        $(row).addClass("row");
    var header = document.createElement('div');
        $(header).addClass("col-lg-12");

    // Display "700 Results for "Albert Einstein"" on first page.
    if(currentPage == 1) {
        
        $(header).html(
            '<h2 class="page-header">' +
                numResults + 
            ' Search results for ' +  
            '"' + formInput + '"' + '</h2>' +
            '<div class="well well-sm">' +
            '<strong>Page ' + currentPage + '</strong>' +
            ', Results ' + lowIndex + 
            ' – ' + highIndex +
            '</div>'
            
        );
    }

    // Else, display "Showing results 30-45" on following pages.
    else {

        $(header).html(

            '<div class="well well-sm">' +
            '<strong>Page ' + currentPage + '</strong>' +
            ', Results ' + lowIndex + 
            ' – ' + highIndex +
            '</div>'
            );
    }

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

    return "https://i.imgur.com/r5WTEYx.jpg";

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

    $("#booksContainer").append(addNewRow());
    $("#booksContainer").last().append(
                            '<div class="page-header errorHeader">' +
                                '<h1 class="text-center">' +
                                    'ERROR: ' +
                                '</h1>' +
                                '<h3 class="text-center">' +
                                    'Invalid input "' + 
                                    userInput + '"' +
                                '<h3>' +
                            '</div>');
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
