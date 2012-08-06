package bookstore


import grails.converters.JSON
import grails.validation.ValidationErrors
import groovy.json.JsonBuilder;

import org.codehaus.groovy.grails.web.json.JSONObject;
import org.springframework.dao.DataIntegrityViolationException

class AuthorController {

    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    def index() {
        redirect(action: "list", params: params)
    }
	
    def list() {
      params.max = Math.min(params.max ? params.int('max') : 10, 100)
     	render Author.list(params) as JSON
    }

    def save() {
      def jsonObject = JSON.parse(params.author)
      Author authorInstance = new Author(jsonObject)
      if (!authorInstance.save(flush: true)) {
        ValidationErrors validationErrors = authorInstance.errors
        render validationErrors as JSON
      }
      render authorInstance as JSON
    }
    
    def show() {
      def authorInstance = Author.get(params.id)
      if (!authorInstance) {
        flash.message = message(code: 'default.not.found.message', args: [message(code: 'author.label', default: 'Author'), params.id])
        render flash as JSON
      }
      render AuthorInstance as JSON
    }

    def update() {
      def jsonObject = JSON.parse(params.author)
      Author authorReceived = new Author(jsonObject)

        def authorInstance = Author.get(jsonObject.id)
        if (!authorInstance) {
            flash.message = message(code: 'default.not.found.message', args: [message(code: 'author.label', default: 'Author'), params.id])
            render flash as JSON
        }

        if (jsonObject.version) {
          def version = jsonObject.version.toLong()
          if (authorInstance.version > version) {
            authorInstance.errors.rejectValue("version", "default.optimistic.locking.failure",
                          [message(code: 'author.label', default: 'Author')] as Object[],
                          "Another user has updated this Author while you were editing")
                ValidationErrors validationErrors = authorInstance.errors
                render validationErrors as JSON
                return
            }
        }

        authorInstance.properties = authorReceived.properties

        if (!authorInstance.save(flush: true)) {
          ValidationErrors validationErrors = authorInstance.errors
          render validationErrors as JSON
        }
		    render authorInstance as JSON
    }

    def delete() {
      def authorId = params.id
      def authorInstance = Author.get(params.id)
      if (!authorInstance) {
        flash.message = message(code: 'default.not.found.message', args: [message(code: 'author.label', default: 'Author'), params.id])
        render flash as JSON
      }
      try {
            authorInstance.delete(flush: true)
      }
      catch (DataIntegrityViolationException e) {
        flash.message = message(code: 'default.not.deleted.message', args: [message(code: 'author.label', default: 'Author'), params.id])
        render flash as JSON
      }
      render authorInstance as JSON
    }
}
