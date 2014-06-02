<?php 	if ( ! defined('BASEPATH')) 
		exit('No direct script access allowed');


// ==============================================================
// This class implements the controller for the Google Book 
// Search application.
// ==============================================================
class c_search extends CI_Controller {

	// ==========================================================
	// This function loads the home view.
	// ==========================================================
	public function index() {

		$data['title'] = "Google Books";
		$this->load->view("v_home", $data);

	} // end "index"

	// ==========================================================
	// This function receives the user input and sends it
	// to the model which will call the Google Books API
	// and return the results.
	// ==========================================================
	public function search() {

		// Fetch user input
		$userInput = $this->input->post('foo');

		// Replace all whitespace characters with "+"
		$str = str_replace(" ", "+", $userInput);

		// Load the model and pass the userInput value.
		$this->load->model('m_bookAPIModel', 'googleAPI');
		$results = $this->googleAPI->getAllBooks($str);

		// Return the JSON object.
		echo $results;

	} // end "search"

} // end class "c_search"