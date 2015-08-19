

var Map = function()
{
	this.size = { width: 560, height: 460 };
	this.position = { x: 10, y: 10 };
	
	this.data = null;
	this.fdata = null;
	
	this.projection = d3.geo.mercator().scale(90).center([0, 5]);
	
	this.container = svg.append( 'svg:g' )
		.attr( 'class', 'map' )
		.attr( 'transform', 'translate(' + 
			this.position.x + ',' + 
			this.position.y + ')' );
	
	this.container.append( 'svg:rect' )
		.attr( 'class', 'background' )
		.attr( 'width', this.size.width )
		.attr( 'height', this.size.height );
	
	svg.append( 'svg:rect' )
		.attr( 'class', 'map-cover' )
		.attr( 'transform', 'translate(0,0)' )
		.attr( 'width', this.position.x ).attr( 'height', canvas_size.height );

	svg.append( 'svg:rect' )
		.attr( 'class', 'map-cover' )
		.attr( 'transform', 'translate(0,0)' )
		.attr( 'width', canvas_size.width ).attr( 'height', this.position.y );
	
	svg.append( 'svg:rect' )
		.attr( 'class', 'map-cover' )
		.attr( 'transform', 'translate('+(this.position.x+this.size.width)+',0)' )
		.attr( 'width', canvas_size.width-(this.position.x+this.size.width) ).attr( 'height', canvas_size.height );

	svg.append( 'svg:rect' )
		.attr( 'class', 'map-cover' )
		.attr( 'transform', 'translate(0,'+(this.position.y+this.size.height)+')' )
		.attr( 'width', canvas_size.width ).attr( 'height', canvas_size.height-(this.position.y+this.size.height) );
	
	svg.append( 'svg:rect' )
		.attr( 'class', 'map-border' )
		.attr( 'transform', 'translate('+this.position.x+','+this.position.y+')' )
		.attr( 'width', this.size.width ).attr( 'height', this.size.height );
		
	this.play_button = svg.append( 'svg:g' )
		.attr( 'class', 'play-button' )
		.attr( 'transform', 'translate('+655+','+400+')' )
		.attr( 'width', 40 ).attr( 'height', 40 )
		.on( 'click', 
			function()
			{
				map.Animate();
			}
		);
	
	this.play_button.append('svg:circle')
		.attr( 'cx', 20 )
		.attr( 'cy', 20 )
		.attr( 'r', 40 );
		
	this.play_text = this.play_button.append( 'svg:text' )
		.attr( 'class', 'play-text' )
		.attr( 'transform', 'translate('+20+','+20+')' )
		.style("text-anchor", "middle")
		.attr('dy', '0.35em')
		.text('PLAY');
	
	this.currently_animating = false;
	this.button_disabled = false;
	
	this.path = null;
	this.world_map = null;
	this.plate_tectonics = null;
	this.earthquakes = null;
	
	this.animation_speed = 10; // in seconds
	this.first_day = null;
	this.last_day = null;
	this.divider = 1;
	
	this.chart = new MapChart();
	
	
	
	this.Init = function( world, tectonics )
	{
		this.path = d3.geo.path().projection( this.projection );
		
		this.world_map = this.container.append('svg:g')
			.attr("class", "world-map")
			.attr( 'transform', 'translate(' + 
				-200 + ',' + 
				-20 + ')' );;
		
		this.world_map.selectAll("path")
			.data( world.features )
			.enter()
			.append("path")
				.attr( "d", this.path );
		
		this.plate_tectonics = this.container.append('svg:g')
			.attr("class", "plate-tectonics")
			.attr( 'transform', 'translate(' + 
				-200 + ',' + 
				-20 + ')' );;
		
		this.plate_tectonics
			.insert( "path", ".graticule" )
				.datum( topojson.object(tectonics, tectonics.objects.tec) )
				.attr( "d", this.path );

		this.earthquakes = this.container.append('svg:g')
			.attr( 'transform', 'translate(' + 
				-200 + ',' + 
				-20 + ')' );;
		
		this.chart.Init();
	}
	
	
	
	this.Load = function( data )
	{
		var self = this;
		this.data = data;
		
		var month = parseInt( controls.MapMonth() ) - 1;
		var year = parseInt( controls.MapYear() );
		
		this.first_day = new Date(year, month, 1);
		this.last_day = new Date(year, month+1, 0, 23, 59, 59);
		
		this.data.forEach(
			function( e, i, a )
			{
				if( i == 0 )
					e.transition = e.date.valueOf() - self.first_day.valueOf();
				else
					e.transition = e.date.valueOf() - a[i-1].date.valueOf();
				
				e.total_transition = e.date.valueOf() - self.first_day.valueOf();
			});		

		this.chart.Load();
		this.Draw();
	}
	

	this.Draw = function()
	{
		var self = this;
		
		this.fdata = this.data.filter(
			function( d )
			{
				switch( d.class )
				{
					case "minor": return controls.ShowMinor(); break;
					case "light": return controls.ShowLight(); break;
					case "moderate": return controls.ShowModerate(); break;
					case "strong": return controls.ShowStrong(); break;
					case "major": return controls.ShowMajor(); break;
					case "great": return controls.ShowGreat(); break;
				}
				
				return false;
			});

		var circles = this.earthquakes.selectAll(".earthquake")
			.data(this.fdata)
				.attr("class", function(d) { return "earthquake " + d.class; })
				.attr("id", function(d) { return d.id; })
				.attr("cx", function(d) { return self.projection([d.longitude, d.latitude])[0]; })
				.attr("cy", function(d) { return self.projection([d.longitude, d.latitude])[1]; })
				.attr("r", function(d) { return (d.mag + 2) / 2; });
				
		circles
			.enter()
			.append("svg:circle")
				.attr("class", function(d) { return "earthquake " + d.class; })
				.attr("id", function(d) { return d.id; })
				.attr("cx", function(d) { return self.projection([d.longitude, d.latitude])[0]; })
				.attr("cy", function(d) { return self.projection([d.longitude, d.latitude])[1]; })
				.attr("r", function(d) { return (d.mag + 2) / 2; });
				
		circles.exit().remove();
		
				
		this.chart.Draw( this.fdata );
	}

	this.Animate = function()
	{
		if( this.button_disabled ) return;
		if( this.currently_animating == true )
		{
			this.EndAnimation();
			return;
		}
		
		if( this.fdata.length == 0 ) return;
		
		this.currently_animating = true;
		this.play_text.text("STOP");
		controls.DisableControls();

		var self = this;
		
		this.fdata.forEach(
			function( e, i, a )
			{
				if( i == 0 )
					e.transition = e.date.valueOf() - self.first_day.valueOf();
				else
					e.transition = e.date.valueOf() - a[i-1].date.valueOf();
				
				e.total_transition = e.date.valueOf() - self.first_day.valueOf();
			});
			
		// calculate speed...
		var total_speed = this.fdata.reduce(
			function( v, e, i, a )
			{
				v = parseInt(v);
				e = parseInt(e.transition);
				
				if( isNaN(v) ) v = 0;
				if( isNaN(e) ) e = 0;
				
				return v + e;
			});
			
// 		total_speed = this.fdata[ this.fdata.length-1 ].total_transition;
		this.divider = (total_speed > 0 ? (this.animation_speed * 1000) / total_speed : 0);

		this.fdata.forEach(
			function( e, i, a )
			{
				e.adjusted_transition = e.transition * self.divider;
				e.adjusted_total_transition = e.total_transition * self.divider;
			});
		
		// hide all earthquakes
		this.earthquakes.selectAll(".earthquake").attr("r", 0);
		
		// animate first earthquake
		this.AnimateEarthquake( -1 );
	}
	
	this.AnimateEarthquake = function( index )
	{
		if( !this.currently_animating ) return;

		var self = this;
		
		var start_index = index;
		var end_index = index+1;
		
		var start_date = null;
		var end_date = null;
		var transition_speed = 0;


		if( start_index > 0 )
		{
			start_date = this.fdata[start_index].date;
		}
		else
		{
			start_date = this.first_day;
		}

		
		if( end_index < this.fdata.length )
		{
			end_date = this.fdata[end_index].date;
			transition_speed = this.fdata[end_index].adjusted_transition;
		}
		else
		{
			end_date = this.last_day;
			transition_speed = (end_date.valueOf() - start_date.valueOf()) * this.divider;
		}
		
		
		var transition = this.chart.AnimateMapChart( start_date, end_date, transition_speed );
		transition.each( "end", 
			function()
			{
				if( end_index < self.fdata.length )
				{
					var t = self.earthquakes.transition().ease("linear").duration( 500 );	
					t.selectAll('#'+self.fdata[end_index].id)
						.attr("r", function(d) { return d.mag + 2; })
						.each("end",
							function()
							{
								var t = self.earthquakes.transition().ease("linear").duration( 500 );
								t.selectAll('#'+self.fdata[end_index].id)
									.attr("r", 0);
							});

					self.AnimateEarthquake( end_index );
				}
				else
				{
					self.EndAnimation();
				}
			}
		);

	}
	
	
	this.EndAnimation = function()
	{
		this.currently_animating = false;
		this.button_disabled = true;
		var self = this;
		
		// give time for current animations to finish.
		setTimeout(
			function()
			{
				var t = self.earthquakes.transition().ease("linear").duration( 100 );
				t.selectAll(".earthquake")
					.attr("r", function(d) { return (d.mag + 2) / 2; });
		
				self.chart.StopAnimation();
				controls.EnableControls();
				self.play_text.text("PLAY");
				self.button_disabled = false;
			},
			1000
		);

	}

}

