<?php

// ==============================================================
// This class implements the model used in the Book Search
// application. Google Books API calls are performed in this
// module. Functionalities include: order by asc/desc, order by
// relevance/newest, or get all books with no options.
// ==============================================================
class m_bookAPIModel extends CI_Model {


    // ==========================================================
    // This function performs an HTTP GET request to the Google
    // Books API using the URI provided, and the 'Order By'
    // method desired by the user. Response objects are of type
    // JSON called "volumes".
    //
    // Input:
    //      $input      -- The search string provided by the user
    //                     formatted as "phrase"+"phrase".
    //      $orderBy    -- The desired sort method (most relevant
    //                     or newest). The default value for this
    //                     parameter is to sort by relevance.
    //      $startIndex -- The starting index at which to begin
    //                     fetching volumes. Default is 0.
    //      $maxResults -- The number of volumes to fetch.
    //                     Default is set to 15.
    //
    // Output:
    //      $response   -- An object containing one or many
    //                     volumes.
    // ==========================================================
    public function getBooks($input, $orderBy="relevance", 
                                $startIndex=0, $maxResults=15) {

        // The Google Books URI.
        $URI = "https://www.googleapis.com/books/v1/volumes?q=";

        // Call the API and receive response.
        $response = file_get_contents($URI .$input . '&orderBy=' 
                                           .$orderBy . '&startIndex='
                                           .$startIndex . '&maxResults='
                                           .$maxResults);

        // Return the volumes.
        return $response;

    } // end "getBooks"

} // end class "m_booksAPIModel"

?>