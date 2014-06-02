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

		$data['title'] = "Google Books";
		// $data['default_view'] = getDefaultView();
		$this->load->view("v_home", $data);

	} // end "index"

	// ==========================================================
	// This function generates a default HTML template for the
	// view when it is first loaded. This view will disappear
	// when a search is invoked.
	// 
	// Input:
	//		Nothing.
	//
	// Output:
	//		A partial HTML view.
	// ==========================================================
	function getDefaultView() {
		$defaultView = '';
	}



	// ==========================================================
	// This function receives the user input and sends it
	// to the model which will call the Google Books API
	// and return the results.
	//
	// Input:
	//		$_POST['input']		-- The search string entered by
	//							the user.
	// 		$_POST['sortBy'] 	-- The sort method selected by
	//							the user.
	//		$status 			-- A reference variable that will
	//							store the HTTP status code.
	// Output:
	//		$results 	-- The JSON object fetched from the model
	//					if everything went smoothly.
	// ==========================================================
	public function search() {

		// Fetch POST data.
		$userInput = $this->input->post('input');
		$sortType = $this->input->post('sortBy');

		// Replace all whitespace characters with "+"
		// The Google Books URI requires words to be separated
		// by "+".
		$str = str_replace(" ", "+", $userInput);

		// Load the model and call the function getBooks.
		$this->load->model('m_bookAPIModel', 'googleAPI');
		$results = $this->googleAPI->getBooks($str, 
											  $sortType, 
											  $status);

		// Check HTTP status code and handle errors.
		switch($status) {
			case 200:
			 	header('Content-type: application/json');
				echo $results;
				break;
			// TODO: Provide handlers for these errors in
			// the ajax call.
			case 429:
				header('Content-type: application/json');
				echo json_encode(
						array('status' => "Rate limit exceeded."));
				break;
			case 404:
				header('Content-type: application/json');
				echo json_encode(
						array('status' => "Page not found.
										This should not hapepen. 
										Please email me."));
				break;
			default:
				header('Content-type: application/json');
				echo json_encode(
						array('status' => "Status code: "
											. $status));
				break;
		} // end switch

	} // end "search"

} // end class "c_search"

?>