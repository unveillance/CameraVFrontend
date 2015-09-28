var app = app || {};//global Backbone

app.CameraVExportView = Backbone.View.extend({
	el: '#cv_export_view_holder',
	initialize: function() {
		this.assetBrowserView = new app.InformaCamAssetBrowserView({
			model: new app.InformaCamAssetBrowser({
				id: app.docid
			})
		});
		

		
		//LISTENERS
		
		
		this.listenTo(this.assetBrowserView.model, 'change', function() {
			$c('this.assetBrowserView change');
			$c(this);
			this.assetBrowserView.render();
		});

	},
});