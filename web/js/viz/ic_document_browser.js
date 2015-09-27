var app = app || {};//global Backbone

app.InformaCamDocumentBrowserView = Backbone.View.extend({
	el: '#ic_document_browser',
	render: function() {
		this.$el.html(toHTML(this.model.attributes));
		return this;
	},
});
