<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Google Books API Application">
    <meta name="author" content="Carlos Zaragoza">

    <title><?php echo $title ?></title>

    <!-- Bootstrap core CSS -->
    <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">

    <!-- Custom CSS for the '3 Col' Template -->
    <link href="css/3-col-portfolio.css" rel="stylesheet">

    <!-- CSS tweaks -->
    <link href="css/styles.css" rel="stylesheet">

    <!-- JavaScript -->
    <script src="js/jquery-1.10.2.js"></script>
    <script src="//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>
    <script src="js/notify.min.js"></script>
</head>

<body>

    <nav class="navbar navbar-fixed-top navbar-inverse" role="navigation">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="index.php">Google Books API</a>
            </div>

            <!-- Search form -->
            <div class="collapse navbar-collapse navbar-ex1-collapse" style="float: right;">
				<form class="navbar-form navbar-left" method="POST" id="searchForm">
					<div class="form-group">
						<input type="text" id="searchInput" class="form-control" placeholder="Search" required>
					</div>
					<button type="submit" id="searchButton" class="btn btn-default">Submit</button>

                    <!-- Sort by -->
                    <span style="color: white; font-size:8pt">Sort by</span>
                    <div class="btn-group">
                      <button type="button" class="btn btn-primary btn-xs" id="orderBy">Relevance</button>
                      <button type="button" class="btn btn-primary btn-xs dropdown-toggle" data-toggle="dropdown">
                        <span class="caret"></span>
                        <span class="sr-only"></span>
                      </button>
                      <ul class="dropdown-menu" role="menu">
                        <li><a href="#" id="relevance">Relevance</a></li>
                        <li><a href="#" id="newest">Newest</a></li>
                      </ul>
                    </div>

                    <!-- Output per page -->
                    <span style="color: white; font-size:8pt">Results per page</span>
                    <div class="btn-group">
                      <button type="button" class="btn btn-primary btn-xs" id="numPerPage">9</button>
                      <button type="button" class="btn btn-primary btn-xs dropdown-toggle" data-toggle="dropdown">
                        <span class="caret"></span>
                        <span class="sr-only"></span>
                      </button>
                      <ul class="dropdown-menu" role="menu">
                        <li><a href="#" id="9per">9</a></li>
                        <li><a href="#" id="15per">15</a></li>
                        <li><a href="#" id="30per">30</a></li>
                      </ul>
                    </div>
				</form>
            </div>
            <!-- /.navbar-collapse -->
        </div>
        <!-- /.container -->
    </nav>

    <!-- Book Search Results -->
    <div class="container" id="booksContainer">
        <!-- Populate with rows of books -->
        <div class="jumbotron">
          <h1>Hello, world!</h1>
          <p>This application allows users to query the Google Books API and displays
             book results in a 3-column format.
             <br /> <br />
             Go ahead, use the search field to begin searching!</p>
          <small>This application was developed using the PHP Code Igniter framework and a
             whole bunch of JavaScript.</small>
        </div>
        
    </div>
    <!-- /.Books Results -->

    <!-- Footer -->
    <div class="container footer">
        <button type="button" id="loading-button" data-loading-text="Loading..." data-complete-text="No more results" class="btn btn-primary">
            Load More
        </button>
        <button type="button" class="btn btn-default" id="back-to-top">
            <span class="glyphicon glyphicon-arrow-up"></span> 
            Back to top
        </button>
        <br />
        <img src="images/page-loader.gif" alt="Loading..." class="ajax-loader" />
        <hr>
        <footer>
            <div class="row">
                <div class="col-lg-12">
                    <p>Copyright &copy; Carlos Zaragoza 2014 – Report bugs to CaZa@outlook.com</p>
                </div>
            </div>
        </footer>
    </div>
    <!-- /.footer -->

    <!-- JavaScript/AJAX that populates booksContainer -->
    <script src="js/populate.js"></script>

    <!-- Handlers for sorting type and number of books to display -->
    <script>
        $('#relevance').click(function() {
            $('#orderBy').html('Relevance');
        });

        $('#newest').click(function() {
            $('#orderBy').html('Newest');
        });

        $('#9per').click(function() {
            $('#numPerPage').html('9');
        })

        $('#15per').click(function () {
            $('#numPerPage').html('15');
        });

        $('#30per').click(function() {
            $('#numPerPage').html('30');
        });
    </script>

</body>
</html>
