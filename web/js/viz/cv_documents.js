var app = app || {};//global Backbone

app.CameraVDocumentsView = Backbone.View.extend({
	el: '#cv_documents_view_holder',
	initialize: function() {
		this.documentBrowserView = new app.InformaCamDocumentBrowserView({
			model: new app.InformaCamDocumentBrowser({
			})
		});
		
		//LISTENERS
		views = [this.documentBrowserView, ];
		
		_.each(views, function(view) {
			this.listenTo(view.model, 'change', function() {
				view.$el.append(view.render().el);
				$c(view);
			});
		}, this);
	},
});
