

var Scatterplot = function( x_key, y_key )
{
	this.size = { width: 230, height: 200 };
	
	this.x_key = x_key;
	this.y_key = y_key;
	
	this.x_scale = d3.scale.pow().exponent(.1).range( [ this.size.width, 0 ] );
	this.y_scale = d3.scale.linear().range( [ this.size.height, 0 ] );
	
	this.x_axis = null;
	this.y_axis = null;
	
	this.container = svg
		.append( 'svg:g' )
			.attr( 'class', 'scatterplot' )
			.attr( 'transform', 'translate(' + 
				(canvas_size.width - this.size.width - 30) + ',' + 
				(canvas_size.height - this.size.height - 30) + ')' );
	this.container
		.append( 'rect' )
			.attr( 'class', 'background' )
			.attr( 'width', this.size.width )
			.attr( 'height', this.size.height );
	
	this.init = function()
	{
		var self = this;
		
		var x_range = d3.extent( d3.values(games_list), function( d ) { return d[self.x_key]; } );	
		var y_range = d3.extent( d3.values(games_list), function( d ) { return d[self.y_key]; } );	
		this.x_scale.domain( x_range );
		this.y_scale.domain( y_range );
		
		this.x_axis = d3.svg.axis()
			.scale( this.x_scale )
			.orient( 'bottom' );

		this.y_axis = d3.svg.axis()
    		.scale( this.y_scale )
    		.orient( 'right' );

		this.container.append( 'g' )
    		.attr( 'class', 'x axis' )
    		.attr( 'transform', 'translate(0,' + self.size.height + ')' )
    		.call( this.x_axis );

  		this.container.append( 'g' )
    		.attr( 'class', 'y axis' )
    		.attr( 'transform', 'translate(' + self.size.width + ',0)' )
    		.call( this.y_axis );
	}

	this.populate = function( node )
	{
		var self = this;
		this.container.selectAll('circle').data([]).exit().remove();

		if( node == null || !node.children ) return;
		if( node.children[0].children ) return;

		this.container.selectAll( 'circle' )
			.data( node.children.filter(function(d) { return d.value; }) )
			.enter()
			.append( 'svg:circle' )
				.attr( 'cx',
					function( d, i )
					{
						return self.x_scale( games_list[d.name][self.x_key] );
					})
				.attr( 'cy',
					function( d, i )
					{
						return self.y_scale( games_list[d.name][self.y_key] );
					})
				.attr( 'r', 2 )
				.on( 'mouseover',
					function( d, i )
					{
						highlight_data( d.name, i );
					})
				.on( 'mouseout',
					function( d, i )
					{
						highlight_data( null, -1 );
					})
				.on( 'click',
					function(d)
					{
						if( view_all && d3.event.shiftKey )
						{
							d.selected = !d.selected;
							games_list[d.name].selected = d.selected;
							select_data( d );
						}
					});
		this.highlight_data( null );
	}

	this.highlight_data = function( name )
	{
		this.container.selectAll( 'circle' )
			.attr( 'class',
				function( d, i )
				{
					if( d.name == name ) return 'highlight';
					if( d.selected ) return 'selected';
					return '';
				})
			.sort(function( a, b ) 
				{
					if( a.name != name ) return -1;
					if( a.selected == b.selected ) return 0;
					if( a.selected ) return 1;
					return -1;
				});
	}

	this.select_data = function( node )
	{
		this.container.selectAll( 'circle' )
			.attr( 'class',
				function( d, i )
				{
					if( d.selected ) return 'selected';
					return '';
				})
			.sort(function( a, b ) 
				{
					if( a != node ) return -1;
					if( a.selected == b.selected ) return 0;
					if( a.selected ) return 1;
					return -1;
				});
	}

}

