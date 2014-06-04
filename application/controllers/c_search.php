<?php 	if ( ! defined('BASEPATH'))  exit('No direct script access allowed');


// ==============================================================
// This class implements the controller for the Google Book 
// Search application.
// ==============================================================
class c_search extends CI_Controller {

	// ==========================================================
	// This function loads the home view.
	//
	// Input:
	//		Nothing.
	//
	// Output:
	//		Nothing.
	// ==========================================================
	public function index() {

		$data['title'] = "Carlos's Google Book App";
		$this->load->view("v_home", $data);

	} // end "index"



	// ==========================================================
	// This function receives the user input and sends it
	// to the model which will call the Google Books API
	// and return the results. All input data is formatted in
	// this function, so it 
	//
	// Input:
	//		$_POST['input']		-- The search string entered by
	//							the user.
	// 		$_POST['sortBy'] 	-- The sort method selected by
	//							the user.
	//		$_POST['_currPage'] -- The current page being loaded
	//
	//		$_POST['_numPer']	-- The number of books to get.
	//
	// Output:
	//		$results 	-- The JSON object fetched from the model
	//					if everything went smoothly.
	// ==========================================================
	public function search() {

		// Fetch POST data.
		$userInput = $this->input->post('_input');
		$sortType = $this->input->post('_sortBy');
		$currPage = $this->input->post('_currPage');
		$numPerPg = $this->input->post('_numPer');

		// Calculate the start index based on the current page.
		$startIndex = ($currPage * $numPerPg) - $numPerPg;

		// Replace all whitespace characters with "+"
		// The Google Books URI requires words to be separated
		// by "+".
		$str = str_replace(" ", "+", $userInput);

		// Load the model and call the function getBooks.
		$this->load->model('m_bookAPIModel', 'googleAPI');
		$results = $this->googleAPI->getBooks($str, 
											  $sortType, 
											  $startIndex,
											  $numPerPg);

	 	header('Content-type: application/json');
		echo $results;

	} // end "search"

} // end class "c_search"

?>