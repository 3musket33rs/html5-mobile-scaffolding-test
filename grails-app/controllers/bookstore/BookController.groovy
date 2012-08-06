package bookstore


import grails.converters.JSON
import grails.validation.ValidationErrors
import groovy.json.JsonBuilder;

import org.codehaus.groovy.grails.web.json.JSONObject;
import org.springframework.dao.DataIntegrityViolationException

class BookController {

    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    def index() {
        redirect(action: "list", params: params)
    }
	
    def list() {
      params.max = Math.min(params.max ? params.int('max') : 10, 100)
     	render Book.list(params) as JSON
    }

    def save() {
      def jsonObject = JSON.parse(params.book)
      Book bookInstance = new Book(jsonObject)
      if (!bookInstance.save(flush: true)) {
        ValidationErrors validationErrors = bookInstance.errors
        render validationErrors as JSON
      }
      render bookInstance as JSON
    }
    
    def show() {
      def bookInstance = Book.get(params.id)
      if (!bookInstance) {
        flash.message = message(code: 'default.not.found.message', args: [message(code: 'book.label', default: 'Book'), params.id])
        render flash as JSON
      }
      render BookInstance as JSON
    }

    def update() {
      def jsonObject = JSON.parse(params.book)
      Book bookReceived = new Book(jsonObject)

        def bookInstance = Book.get(jsonObject.id)
        if (!bookInstance) {
            flash.message = message(code: 'default.not.found.message', args: [message(code: 'book.label', default: 'Book'), params.id])
            render flash as JSON
        }

        if (jsonObject.version) {
          def version = jsonObject.version.toLong()
          if (bookInstance.version > version) {
            bookInstance.errors.rejectValue("version", "default.optimistic.locking.failure",
                          [message(code: 'book.label', default: 'Book')] as Object[],
                          "Another user has updated this Book while you were editing")
                ValidationErrors validationErrors = bookInstance.errors
                render validationErrors as JSON
                return
            }
        }

        bookInstance.properties = bookReceived.properties

        if (!bookInstance.save(flush: true)) {
          ValidationErrors validationErrors = bookInstance.errors
          render validationErrors as JSON
        }
		    render bookInstance as JSON
    }

    def delete() {
      def bookId = params.id
      def bookInstance = Book.get(params.id)
      if (!bookInstance) {
        flash.message = message(code: 'default.not.found.message', args: [message(code: 'book.label', default: 'Book'), params.id])
        render flash as JSON
      }
      try {
            bookInstance.delete(flush: true)
      }
      catch (DataIntegrityViolationException e) {
        flash.message = message(code: 'default.not.deleted.message', args: [message(code: 'book.label', default: 'Book'), params.id])
        render flash as JSON
      }
      render bookInstance as JSON
    }
}
