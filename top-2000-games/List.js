

var List = function()
{
	this.width = 250;
	this.height = canvas_size.height;
	this.scrollbar_width = 15;
	
	this.bar_scale = d3.scale.linear()
		.range( [ 0, this.width - this.scrollbar_width ] );
		
	this.item_height = 20;
	this.items_per_page = Math.floor( this.height / this.item_height );
	this.current_page = 0;
	this.total_pages = 0;
	this.handle_height = 0;
	
	this.container = svg
		.append( 'svg:g' )
			.attr( 'class', 'list-container' )
			.attr( 'transform', 'translate(10,0)' );
	this.container
		.append( 'svg:rect' )
			.attr( 'class', 'list-background' )
			.attr( 'width', this.width )
			.attr( 'height', this.height );
		
	this.scrollbar = this.container
		.append( 'svg:g' )
			.attr( 'class', 'scrollbar' );
	this.scrollbar
		.append( 'svg:rect' )
			.attr( 'class', 'background' )
			.attr( 'transform', 'translate(0,' + this.scrollbar_width + ')' )
			.attr( 'width', this.scrollbar_width )
			.attr( 'height', this.height - (this.scrollbar_width * 2) );
	this.scrollbar
		.append( 'svg:rect' )
			.attr( 'class', 'up arrow' )
			.attr( 'transform', 'translate(0,0)' )
			.attr( 'width', this.scrollbar_width )
			.attr( 'height', this.scrollbar_width );
	this.scrollbar
		.append( 'svg:rect' )
			.attr( 'class', 'down arrow' )
			.attr( 'transform', 'translate(0, ' + (this.height - 15) + ')' )
			.attr( 'width', this.scrollbar_width )
			.attr( 'height', this.scrollbar_width );
	this.scrollbar
		.append( 'svg:rect' )
			.attr( 'class', 'handle' )
			.attr( 'transform', 'translate(0, ' + this.scrollbar_width + ')' )
			.attr( 'width', this.scrollbar_width );
	
	this.list = this.container
		.append( 'svg:g' )
			.attr( 'transform', 'translate(' + this.scrollbar_width + ',0)' );

	this.init = function()
	{
	}
	
	this.populate = function( node )
	{
		var self = this;
		
		this.list.selectAll('rect').data([]).exit().remove();
		this.list.selectAll('text').data([]).exit().remove();
	
		if( node == null || !node.children ) return;
		if( node.depth < 1 ) return;

		node.children.sort( 
			function( a, b )
			{
				if( a.name < b.name ) return -1;
				else if( a.name > b.name ) return 1;
				return 0;
			});

		var max_value = d3.max( node.children, function(d) { return d.value; } );
		this.bar_scale.domain( [ 0, max_value ] );
		
		this.list.selectAll( '.bar' )
			.data( node.children.filter(function(d) { return d.value; }) )
			.enter()
			.append( 'svg:rect' )
				.attr( 'class', 'bar' )
				.attr( 'x', 0 )
				.attr( 'y', function( d, i ) { return i * self.item_height; } )
				.attr( 'height', this.item_height )
				.attr( 'width',
					function( d, i )
					{
						return self.bar_scale(d.value);
					});
				
		this.list.selectAll( 'text' )
			.data( node.children.filter(function(d) { return d.value; }) )
			.enter()
			.append( 'svg:text' )
				.attr( 'x', function(d, i) { return 5; } )
				.attr( 'y', function(d, i) { return i * 20 + (self.item_height / 2); } )
				.attr( 'dy', '0.35em' )
				.text(function(d) { return d.name; });
		
		this.list.selectAll( '.selector' )
			.data( node.children.filter(function(d) { return d.value; }) )
			.enter()
			.append( 'svg:rect' )
				.attr( 'class', 'selector' )
				.attr( 'x', 0 )
				.attr( 'y', function( d, i ) { return i * self.item_height; } )
				.attr( 'height', this.item_height )
				.attr( 'width', this.width - this.scrollbar_width )
				.attr( 'fill', 'transparent' )
				.on( 'mouseover', function( d, i ) { highlight_data(d.name, i); })
				.on( 'mouseout', function( d, i ) { highlight_data(null, -1); })
				.on( 'click',
					function( d, i )
					{
						if( d.children )
						{
							focus_on_node( d, selected_pack_index );
						}
						else if( view_all && d3.event.shiftKey )
						{
							d.selected = !d.selected;
							games_list[d.name].selected = d.selected;
							select_data( d );
						}
					});
				
		this.total_pages = Math.ceil( node.children.length / this.items_per_page );
		this.current_page = 0;
		
		this.handle_height = ( this.height - (this.scrollbar_width * 2) ) / this.total_pages;
		this.scrollbar.selectAll('.handle').attr( 'height', this.handle_height );
		this.scrollbar.selectAll('.handle').attr( 'y', 0 );

		this.list.attr( 'transform', 'translate(' + this.scrollbar_width + ',0)' );
	
		this.scrollbar.selectAll('.down.arrow' )
			.on( 'click', 
				function()
				{
					self.change_page( 1 );
				});
	
		this.scrollbar.selectAll('.up.arrow' )
			.on( 'click',
				function()
				{
					self.change_page( -1 );
				});
				
		this.highlight_data( null );
	}
	
	this.change_page = function( modifier )
	{
		var new_page = this.current_page + modifier;
		if( (new_page >= this.total_pages) || (new_page < 0) ) return;
		this.current_page = new_page;
		
		var t = this.list.transition().duration( 500 );
		t.attr( 'transform', 'translate(' + this.scrollbar_width + ',' + ( -this.current_page * (this.items_per_page * this.item_height) ) + ')' );
		this.scrollbar.selectAll('.handle').attr( 'y', this.handle_height * this.current_page );
	}

	this.highlight_data = function( name )
	{
		this.list.selectAll( 'text' )
			.attr( 'class',
				function( d, i )
				{
					if( d.name == name ) return 'highlight';
					if( d.selected ) return 'selected';
					return '';
				});
	}

	this.select_data = function( node )
	{
		this.list.selectAll( 'text' )
			.attr( 'class',
				function( d, i )
				{
					if( d.selected ) return 'selected';
					return '';
				});
	}

}

