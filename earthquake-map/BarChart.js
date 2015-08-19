

var BarChart = function()
{
	this.start_year = -1;
	this.end_year = 9999;
	
	this.min_year = -1;
	this.max_year = -1;
	
	this.totals = null;
	
	this.size = { width: 600, height: 320 };
	this.position = { x: canvas_size.width - this.size.width - 10, y: 10 };
	
	this.x_scale = d3.scale.ordinal().rangeRoundBands([0, this.size.width]);
	this.y_scale = d3.scale.linear().rangeRound([this.size.height, 0]);
	
	this.x_axis = d3.svg.axis().scale( this.x_scale ).orient( 'bottom' );
	this.y_axis = d3.svg.axis().scale( this.y_scale ).orient( 'left' );
	
	this.color = d3.scale.ordinal()
		.range([ "#d0743c", "#a05d56", "#6b486b", "#7b6888", "#8a89a6", "#98abc5" ])
		.domain([ "great", "major", "strong", "moderate", "light", "minor" ]);
	
	//------------------------------------------------------------------------------------
	// Draw container
	//------------------------------------------------------------------------------------
	
	this.container = svg.append( 'svg:g' )
		.attr( 'class', 'barchart' )
		.attr( 'transform', 'translate('+this.position.x+','+this.position.y+')' );
	
	this.container.append( 'svg:rect' )
		.attr( 'class', 'background' )
		.attr( 'width', this.size.width )
		.attr( 'height', this.size.height );
	
	this.container.append( 'svg:g' )
		.attr( 'class', 'x axis' )
		.attr( 'transform', 'translate(0,'+this.size.height+')' )
		.call( this.x_axis );

	this.container.append( 'svg:g' )
		.attr( 'class', 'y axis' )
		.attr( 'transform', 'translate(0,0)' )
		.call( this.y_axis )
		.append("text")
			.attr("class", "y label")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("");

	this.bars = null;
	this.data = null;
	
	
	
	//====================================================================================
	//=============================================================== Initialization =====
	
	this.Init = function( data )
	{
		this.data = data;
		
		var extent = d3.extent( data, function(d) { return d.year; } );
		this.min_year = +extent[0]; this.max_year = +extent[1];
	
		this.Draw();
	}
	
	
	
	//====================================================================================
	//================================================================ Update / Draw =====
	
	this.Draw = function()
	{
		var self = this;
		
		
		//
		// Gather settings from the controls.
		//
		
		this.start_year = controls.StartYear();
		this.end_year = controls.EndYear();
		
		if( this.start_year < this.min_year ) this.start_year = this.min_year;
		if( this.end_year > this.max_year ) this.end_year = this.max_year;
		
		
		var selected = {
			great: controls.ShowGreat(),
			major: controls.ShowMajor(),
			strong: controls.ShowStrong(),
			moderate: controls.ShowModerate(),
			light: controls.ShowLight(),
			minor: controls.ShowMinor(),
		};
		
		
		//
		// Update data.
		//
		
		this.data.forEach(
			function(d)
			{
				var y0 = 0;
				d.quakes = self.color.domain().map(
					function(name)
					{
						if( selected[name] == true )
							return {name: name, y0: y0, y1: y0 += +d[name]}; 
						else	
							return {name: name, y0: y0, y1: y0}; 
					});
				d.total = d.quakes[d.quakes.length - 1].y1;
			});
			
		this.data.sort(function(a, b) { return a.year - b.year; });
		
		var fdata = this.data.filter(
			function(d)
			{
				return !( d.year < self.start_year || d.year > self.end_year )
			});
		
		
		//
		// Update X and Y scale and axis.
		//
			
		var max_ticks = 10; 
		var spacing = 1;
		if( fdata.length > max_ticks ) spacing = Math.floor(fdata.length / max_ticks);
		
		var max_value = d3.max(fdata, function(d) { return d.total; });
		var axis_label = '';
		
		this.x_scale.domain( fdata.map(function(d) { return d.year; }) );
		this.y_scale.domain( [0, max_value] );		

		this.x_axis.tickFormat( function(d, i) { if( i % spacing == 0 ) return d; else return ''; } );
		this.y_axis.tickFormat( function(d) { 
			if( max_value > 10000 ) { axis_label = "In Thousands"; return d / 1000; }
			if( max_value > 1000 ) { axis_label = "In Hundreds"; return d / 100 };
			return d;
		});
		
		this.container.select( ".x.axis" ).call( this.x_axis );
		this.container.select( ".y.axis" ).call( this.y_axis );
		this.container.select( ".y.label" ).text( axis_label );
		
		
		//
		// Draw / Update the stacked bars.
		//
		
		this.bars = this.container
			.selectAll( ".year" )
			.data( fdata )
				.attr( "transform", function(d) { return "translate("+self.x_scale(d.year)+",0)"; } );

		this.bars
			.enter()
			.append( "svg:g" )
				.attr( "class", "year" )
				.attr( "transform", function(d) { return "translate("+self.x_scale(d.year)+",0)"; } );
	
		var rects = this.bars.selectAll( "rect" )
			.data( function(d) { return d.quakes; } )
				.attr( "width", self.x_scale.rangeBand() )
				.attr( "y", function(d) { return self.y_scale(d.y1); } )
				.attr( "height", function(d) { return self.y_scale(d.y0) - self.y_scale(d.y1); } )
// 				.style( "fill", function(d) { return self.color(d.name); } );
				.attr( "class", function(d) { return d.name; } );
					
		rects.enter()
			.append( "svg:rect" )
				.attr( "width", self.x_scale.rangeBand() )
				.attr( "y", function(d) { return self.y_scale(d.y1); } )
				.attr( "height", function(d) { return self.y_scale(d.y0) - self.y_scale(d.y1); } )
// 				.style( "fill", function(d) { return self.color(d.name); } )
				.attr( "class", function(d) { return d.name; } );
					
		this.bars.exit().remove();
		rects.exit().remove();
	}
	
}

