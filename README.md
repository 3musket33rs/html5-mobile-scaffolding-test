html5-mobile-scaffolding-test
=============================

Grails test project for grails html5-mobile-scaffolding. In this sample we will demonstrate ho

Step done to create this sample app
===================================

	grails create-app html5-mobile-scaffolding-test
	grails install-plugin html5-mobile-scaffolding
	grails create-domain-class bookstore.Author

Add fields in Author: String lastname, String firstname, Date birthday

	grails create-domain-class bookstore.Book

Add fields in Book: String title, Author author

	grails html-generate-all bookstore.Author
	grails html-generate-all bookstore.Book
	grails run-app

To run this sample taken from github
====================================	
	
	grails run-app

