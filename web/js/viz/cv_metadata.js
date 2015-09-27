var app = app || {};//global Backbone

app.CameraVMetadataView = Backbone.View.extend({
	el: '#cv_metadata_view_holder',
	initialize: function() {
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
		
		this.documentSourceView = new app.InformaCamDocumentSourceView({
			model: new Backbone.Model({
				id: app.docid
			})
		});


		/* MULTI-VIEW LINE CHART */	
				// http://stackoverflow.com/questions/7385629/backbone-js-complex-views-combining-multiple-models
				// http://stackoverflow.com/questions/7734559/backbone-js-passing-2-models-to-1-view
		this.lineChartMultiView = new app.InformaCamLineChartMultiView({
			model: new Backbone.Model({
				pressureAltitude: new app.InformaCamJ3MTimeStampedData({
					urlRoot: '/pressureAltitude',
					id: app.docid,
					title: 'Pressure Altitude',
					keys: ['pressureAltitude'],
				}),
				lightMeter: new app.InformaCamJ3MTimeStampedData({
					urlRoot: '/lightMeter',
					id: app.docid,
					title: 'Light Meter',
					keys: ['lightMeterValue'],
				}),
				Accelerometer: new app.InformaCamJ3MTimeStampedData({
					urlRoot: '/Accelerometer',
					id: app.docid,
					title: 'Accelerometer',
					keys: ['acc_x', 'acc_y', 'acc_z', ],
				}),
				pressureHPAOrMBAR: new app.InformaCamJ3MTimeStampedData({
					urlRoot: '/pressureHPAOrMBAR',
					id: app.docid,
					title: 'pressureHPAOrMBAR',
					keys: ['pressureHPAOrMBAR', ],
				}),
				dateCreated: new app.InformaCamJ3MHeader({
					id: app.docid,
				}),
			}),
			el: '#ic_linechart_view_holder',
		});	

/*
		this.lineChartMultiView.model.get("pressureAltitude").fetch();
		this.lineChartMultiView.model.get("lightMeter").fetch();
		this.lineChartMultiView.model.get("Accelerometer").fetch();
		this.lineChartMultiView.model.get("pressureHPAOrMBAR").fetch();
		
*/


		/* END MULTI-VIEW LINE CHART */	

		//LISTENERS
		
		views = [this.J3MHeaderView, this.documentWrapperView, ];
		
		_.each(views, function(view) {
			this.listenTo(view.model, 'change', function() {
				view.$el.append(view.render().el);
				$c(app.docid);
				$c(view);
			});
		}, this);

		this.listenTo(this.documentSourceView.model, 'change', function() {
			this.documentSourceView.$el.append(this.documentSourceView.render().el);
			$c('change documentSourceView');
		});
	},
});
