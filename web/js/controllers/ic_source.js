var source;

(function($) {
	var source_sammy = $.sammy("#content", function() {
		this.get(new RegExp("/source/([a-z0-9]{" + UV.SHA1_INDEX + "})/"), function(context) {

			source = new InformaCamSource(_.extend({ root_el : $('#ic_source_view_holder')},
				doInnerAjax("documents", "post", { _id : this.params.splat[0] }, null, false)));

			if(source.get('result') != 200) {
				failOut(source.get('root_el'));
				return;
			}

			source.unset('result');

			console.info("Source " + source.get('data')._id);
			console.info(source);

			$(source.get('root_el'))
				.html("Source is here in the DOM.  What does this look like?")
				.append($(document.createElement('textarea'))
					.addClass("ic_json_pre")
					.html(JSON.stringify(source.toJSON())));
		});
	});
	
	$(function() {
		try {
			updateConf();
		} catch(err) {
			console.warn(err);
			console.warn("no updateConf()");
		}
		
		try {
			onConfLoaded();
		} catch(err) {
			console.warn(err);
			console.warn("no onConfLoaded()");
		}
		
		source_sammy.run();
	});
})(jQuery);