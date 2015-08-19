

var MapChart = function()
{
	this.size = { width: canvas_size.width - 40, height: 150 };
	this.position = { x: 30, y: canvas_size.height - this.size.height - 30 };
	
	
	this.x_scale = d3.time.scale().range([0, this.size.width]);
	this.y_scale = d3.scale.linear().range([this.size.height, 0]).domain( [-1.0, 10.0] );
	
	this.x_axis = d3.svg.axis().scale(this.x_scale).orient("bottom");
	this.y_axis = d3.svg.axis().scale(this.y_scale).orient("left");
	
	this.container = svg.append( 'svg:g' )
		.attr( 'class', 'map-chart' )
		.attr( 'transform', 'translate(' + 
			this.position.x + ',' + 
			this.position.y + ')' );
	
	this.container.append( 'svg:rect' )
		.attr( 'class', 'background' )
		.attr( 'width', this.size.width )
		.attr( 'height', this.size.height );
	
	
	this.Init = function()
	{
		var self = this;
		

		this.container.append("svg:g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + self.size.height + ")")
			.call(self.x_axis);

		this.container.append("svg:g")
			.attr("class", "y axis")
			.call(self.y_axis)
			.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text("Magnitude");

		this.animation_line = this.container.append("svg:rect")
			.attr("class", "animation-line")
			.attr('transform', 'translate(0,0)')
			.attr("height", this.size.height)
			.attr("width", 0);
		
		this.path = null;
	}
	
	
	
	this.Load = function( data )
	{
		this.data = data;

		var month = parseInt( controls.MapMonth() ) - 1;
		var year = parseInt( controls.MapYear() );
		
		var first_day = new Date(year, month, 1);
		var last_day = new Date(year, month+1, 0, 23, 59, 59);
		this.x_scale.domain( [ first_day, last_day ] );
	}
	
	
	
	this.Draw = function( fdata )
	{
		var self = this;
		
		this.container.select(".x.axis").call(this.x_axis);
		this.container.select(".y.axis").call(this.y_axis);

		var circles = this.container.selectAll(".earthquake")
			.data(fdata)
				.attr("cx", function(d) { return self.x_scale( d.date ); })
				.attr("cy", function(d) { return self.y_scale( d.mag ); });
				
		circles
			.enter()
			.append("svg:circle")
				.attr("class", "earthquake")
				.attr("r", "1px")
				.attr("cx", function(d) { return self.x_scale( d.date ); })
				.attr("cy", function(d) { return self.y_scale( d.mag ); });
				
		circles.exit().remove();
	}
	
	
	
	this.AnimateMapChart = function( start_date, end_date, transition_speed )
	{
		this.animation_line
			.attr('transform', 'translate('+this.x_scale(start_date)+',0)' )
			.attr("width", "1px");
		
		var transition_to_earthquake = this.container.transition().ease("linear").duration( transition_speed );
		transition_to_earthquake.selectAll(".animation-line")
			.attr('transform', 'translate('+this.x_scale(end_date)+',0)' );
			
		return transition_to_earthquake;
	}
	
	
	this.StopAnimation = function()
	{
		this.animation_line.attr("width", 0);
	}

}

