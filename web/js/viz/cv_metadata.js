var app = app || {};//global Backbone

app.CameraVMetadataView = Backbone.View.extend({
	el: '#cv_metadata_view_holder',
	initialize: function() {
		this.timeseriesMapView = new app.InformaCamJ3MTimeseriesMapView({
			model: new app.InformaCamJ3MTimeStampedData({
				urlRoot: '/GPSData',
				id: app.docid
			}),
			el: '#cv_gps_coords_view_holder',
			header: 'GPS Coordinates',
		});
		
		this.J3MHeaderView = new app.InformaCamJ3MHeaderView({
			model: new app.InformaCamJ3MHeader({
				id: app.docid
			})
		});

		this.documentWrapperView = new app.InformaCamDocumentWrapperView({
			model: new app.InformaCamDocumentWrapper({
				id: app.docid
			})
		});

		this.appendedUserDataView = new app.InformaCamAppendedUserDataView({
			model: new app.InformaCamAppendedUserData({
				id: app.docid
			})
		});


		//LISTENERS
		
		views = [this.J3MHeaderView, this.timeseriesMapView, this.documentWrapperView];
		
		_.each(views, function(view) {
			this.listenTo(view.model, 'change', function() {
				view.$el.append(view.render().el);
				$c(app.docid);
				$c(this);
			});
		}, this);

		this.listenTo(this.appendedUserDataView.model, 'change', function() {
			$c('appendedUserDataView change');
			$c(this);
			this.appendedUserDataView.$el.append(this.appendedUserDataView.render().el);
		});
	},
});
