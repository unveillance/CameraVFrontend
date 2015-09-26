var app = app || {};//global Backbone

app.CameraVNotesView = Backbone.View.extend({
	el: '#cv_notes_view_holder',
	initialize: function() {
		this.appendedUserDataView = new app.InformaCamAppendedUserDataView({
			model: new app.InformaCamAppendedUserData({
				id: app.docid
			})
		});


		//LISTENERS
		
		this.listenTo(this.appendedUserDataView.model, 'change', function() {
			$c('appendedUserDataView change');
			$c(this);
			$c(this.appendedUserDataView.$el);
			$c(this.appendedUserDataView.render().el);
			this.appendedUserDataView.$el.append(this.appendedUserDataView.render().el);
		});
	},
});
