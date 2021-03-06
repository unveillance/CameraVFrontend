var InformaCamCollection = Backbone.Model.extend({
	constructor: function() {
		Backbone.Model.apply(this, arguments);
	},
	addItem: function(_id) {
		if(!_.findWhere(this.get('collection'), { _id : _id })) {
			this.get('collection').push({ _id : _id });
		}
	},
	removeItem: function(_id) {
		var item = _.findWhere(this.get('collection'), { _id : _id });
		if(item) {
			this.set('collection', _.reject(this.get('collection'), function(_item) {
				return _item._id == _id;
			}));
		}
	},
	save: function() {
	
	},
	update: function() {
		this.updateCommonModules();
		this.updateViews();
	},
	updateViews: function() {
		$("#ic_collection_num").html(this.get('collection').length);
		
		var _ids = _.flatten(_.pluck(this.get('collection'), "_id"));
		var file_names = _.pluck(_.filter(document_browser.get('data'), function(doc) {
			return _.indexOf(_ids, doc._id) >= 0;
		}), "file_name");
		
		_.each(file_names, function(name) {
			$("#ic_collection_doc_list").append($(document.createElement('span'))
				.addClass('ic_file_name ic_inactive')
				.html(name));
		});
		
		getTemplate("module_ctrl.html", function(res) {
			if(res.status != 200) { return; }

			_.each(this.get('modules'), function(module) {
				if(module._ids.length == 0) { return; }
				
				$("#ic_collection_common_funcs_list").append(
					$(document.createElement('li'))
						.html(Mustache.to_html(res.responseText, module)));
			});
		}, null, this);
		
	},
	updateCommonModules: function() {
		this.set('modules', _.clone([
			{
				name : "merge_j3m",
				label : "View J3M data",
				asset_tags : [UV.ASSET_TAGS.J3M],
				_ids : []
			}
		]));
		
		var ctx = this;
		
		_.each(this.get('collection'), function(item) {
			var document = _.findWhere(document_browser.get('data'), { _id : item._id });
			if(!document) { return; }
			
			var document_modules = _.filter(ctx.get('modules'), function(mod) {
				var doc_tags = _.flatten(_.pluck(document.assets, 'tags'));
				var common_tags = _.intersection(doc_tags, mod.asset_tags);
				
				return common_tags.length > 0;
			});
			
			_.each(document_modules, function(mod) {
				var module = _.findWhere(ctx.get('modules'), { name : mod.name });
				if(module) {
					var idx = _.indexOf(
						_.flatten(_.pluck(ctx.get('modules'), "name")),
						module.name);
					
					if(idx >= 0) { ctx.get('modules')[idx]._ids.push(document._id); }
				}
			});			
		});
	}
});