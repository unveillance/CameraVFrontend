var app = app || {};//global Backbone

app.CameraVFileView = Backbone.View.extend({
	el: '#cv_file_view_holder',
	initialize: function() {
/*
		this.J3MHeaderView = new app.InformaCamJ3MHeaderView({
			model: new app.InformaCamJ3MHeader({
				id: app.docid
			})
		});

		this.documentSourceView = new app.InformaCamDocumentSourceView({
			model: new Backbone.Model({
				id: app.docid
			})
		});

		this.appendedUserDataView = new app.InformaCamAppendedUserDataView({
			model: new app.InformaCamAppendedUserData({
				id: app.docid
			})
		});

		this.documentWrapperView = new app.InformaCamDocumentWrapperView({
			model: new app.InformaCamDocumentWrapper({
				id: app.docid
			})
		});
*/
		this.timeseriesMapView = new app.InformaCamJ3MTimeseriesMapView({
			model: new app.InformaCamJ3MTimeStampedData({
				urlRoot: '/GPSData',
				id: app.docid
			}),
			el: '#ic_gps_coords_view_holder',
		});
		
		//LISTENERS
		
		views = [this.timeseriesMapView, ];
		
		_.each(views, function(view) {
			this.listenTo(view.model, 'change', function() {
				view.$el.append(view.render().el);
				$c('');
				$c(app.docid);
				$c(view);
			});
//			view.model.fetch();
		}, this);
		
		
/*
		this.listenTo(this.documentSourceView.model, 'change', function() {
			this.documentSourceView.$el.append(this.documentSourceView.render().el);
			$c('change documentSourceView');
		});
*/
//		this.documentSourceView.model.fetch({url: '/files/.data/' + app.docid + '/j3m.json'});
		
/*
		this.listenTo(this.appendedUserDataView.model, 'change', function() {
			this.appendedUserDataView.$el.append(this.appendedUserDataView.render().el);
			$c('change appendedUserDataView');
		});
*/
//		this.appendedUserDataView.model.fetch();
	},
});
