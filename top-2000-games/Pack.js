

var Pack = function( index, title, key, offset )
{
	this.index = index;
	this.title = title;
	this.key = key;
	this.root_offset = offset;
	this.root_diameter = 100;
	
	this.diameter = 600;
	this.x_scale = d3.scale.linear().range( [ 0, this.root_diameter ] );
	this.y_scale = d3.scale.linear().range( [ 0, this.root_diameter ] );

	this.layout = d3.layout.pack()
		.size( [this.diameter, this.diameter] )
		.sort(
			function(a, b)
			{
				if( a.name > b.name ) return 1;
				else if( a.name < b.name ) return -1;
				return 0;
			});
			
	this.container = svg
		.append( 'svg:g' )
			.attr( 'class', 'circle-pack' )
			.attr( 'transform', 'translate(' + (canvas_size.width - this.root_diameter) / 2 + ',' + (canvas_size.height - this.root_diameter) / 2 + ')' );

	this.all_tree = null;
	this.all_nodes = null;
	
	this.selected_tree = null;
	this.selected_nodes = null;
	
	this.node = null;
	this.node_index = -1;
	this.depth = -2;
	
	this.nodes = null;
	
	this.init = function()
	{
		this.all_tree = { name:this.title, children: [] };
		this.all_tree.children.push( this.get_game_tree( 'Games', {} ) );
		this.all_tree.children.push( this.get_genre_tree( {} ) );
		this.all_tree.children.push( this.get_platform_tree( {} ) );

		this.node = null;
		this.all_nodes = this.layout.nodes( this.all_tree );
		this.root_node = this.all_nodes[0];
		this.nodes = this.all_nodes;
		
		this.selected_nodes = [];
		var self = this;
		this.all_nodes.forEach(
			function( e, i, a )
			{
				self.selected_nodes.push({
					name: e.name,
					value: 0,
					parent: e.parent,
					children: e.children,
					depth: e.depth,
					r: 0,
					x: 0,
					y: 0,
				});
			});
	}
	
	this.populate = function( node )
	{
		var self = this;
		
		this.container.selectAll( 'circle' )
			.data( this.nodes )
			.enter()
			.append( 'svg:circle' )
				.attr( 'class', function(d) { return d.children ? 'parent' : 'child'; })
				.on( 'mouseover', 
					function(d,i)
					{
						if( d.children ) return;
						highlight_data( d.name, i );
					})
				.on( 'mouseout', 
					function(d,i)
					{
						if( d.children ) return;
						highlight_data( null, -1 );
					})
				.on( 'click',
					function(d)
					{
						if( !d.children )
						{
							if( view_all && d3.event.shiftKey )
							{
								d.selected = !d.selected;
								games_list[d.name].selected = d.selected;
								select_data( d );
							}
							return;
						}
					
						if( self.node == d )
						{
							if( d.parent ) focus_on_node( d.parent, self.index );
							else focus_on_node( null, self.index );
						}
						else
						{
							focus_on_node( d, self.index );
						}
					});

		this.container.selectAll( 'text' )
			.data( this.nodes.filter(function(d) { return d.children; }) )
			.enter()
			.append( 'svg:text' )
				.attr( 'class', function(d) { return d.children ? 'parent' : 'child'; })
				.attr( 'dy', '.25em' )
				.attr( 'text-anchor', 'middle' );

		background.on( 'click', function() { focus_on_node(null, self.index); } );
		this.focus_on_node(node, false, false, true);
	}
	
	this.focus_on_node = function( node, skip_transition, hide, force )
	{
		var depth = this.depth;
		if( node == null )
		{
			if( hide ) depth = -2;
			else depth = -1;
		}
		
		if( (node == this.node) && (depth == this.depth) && (!force) ) return;
		
		var self = this;
		var diameter = 0;
		var offset = 0;
		var d = null;
		if( node == null )
		{
			diameter = this.root_diameter;
			offset = this.root_offset;
			d = this.root_node;
			this.node_index = -1;
		}
		else
		{
			depth = node.depth;
			diameter = this.diameter;
			offset = [0,0];
			d = node;

			// find node index
			this.nodes.forEach(
				function( e, i, a )
				{
					if( e == d ) { self.node_index = i; }
				});
		}
		
		var k = diameter / d.r / 2;
		this.x_scale.range( [ 0, diameter ] );
		this.y_scale.range( [ 0, diameter ] );
		this.x_scale.domain( [ d.x - d.r, d.x + d.r ] );
		this.y_scale.domain( [ d.y - d.r, d.y + d.r ] );

		this.depth = depth;
		this.node = node;
		current_node = node;
	
		var time = ( skip_transition ? 0 : 1000 );
		var transition = this.container.transition().duration( time );

		transition
			.attr( 'transform', 'translate(' + (canvas_size.width - diameter) / 2 + ',' + (canvas_size.height - diameter) / 2 + ')' );

		transition.selectAll( 'circle' )
			.attr( 'cx', function(d) { return self.x_scale(d.x) + offset[0]; })
			.attr( 'cy', function(d) { return self.y_scale(d.y) + offset[1]; })
			.attr( 'r', 
				function( d ) 
				{
					if( hide ) return 0;
					
					var r = k * d.r;
					if( d.depth > depth + 1 ) return 0;			// deeper than current zoom	
					if( node == null && d.depth == 0 ) return r;		// when small, show outer circle only
					if( d.parent == node ) return r;					// immediate child of current node
					if( d == node )	return r;							// is current node
					if( depth > 0 && d.depth < 2 ) return r;		// always show the first two depths
					if( d.parent == node.parent ) return r;				// is sibling of current node
				
					var is_in_line = false; var n = node;				// is a ancestor of current node
					while( n.parent )
					{
						if( d == n.parent ) { is_in_line = true; break; }
						n = n.parent;
					}
					if( !is_in_line ) return 0;
					return r;
				});

		transition.selectAll( 'text' )
			.attr( 'x', function(d) { return self.x_scale(d.x) + offset[0]; })
			.attr( 'y', function(d) { return self.y_scale(d.y) + offset[1]; })
			.text(function( d ) 
				{
					if( hide ) return '';
					
					if( d.parent == node && d.value > 0 ) return d.name;
					return '';
				});
	}
	
	this.highlight_data = function( name )
	{
		this.container.selectAll( 'circle' )
			.attr( 'class',
				function( d, i )
				{
					var c = ( d.children ? 'parent' : 'child' );
					if( d.name == name ) return c + ' highlight';
					if( d.selected ) return c + ' selected';
					return c;
				});
	}

	this.select_data = function( node )
	{
		this.all_nodes.forEach(
			function( e, i, a )
			{
				if( e.name == node.name ) e.selected = node.selected;
			});
			
		this.container.selectAll( 'circle' )
			.attr( 'class',
				function( d, i )
				{
					var c = ( d.children ? 'parent' : 'child' );
					if( d.selected ) return c + ' selected';
					return c;
				});
	}

	this.toggle_view = function()
	{
		if( view_all )
		{
			this.update_data( this.all_nodes );
		}
		else
		{
			this.selected_tree = null;	
			this.selected_tree = { name:this.title, children: [] };
			this.selected_tree.children.push( this.get_game_tree( 'Games', {}, true ) );
			this.selected_tree.children.push( this.get_genre_tree( {}, true ) );
			this.selected_tree.children.push( this.get_platform_tree( {}, true ) );

			this.layout.sort( function(a, b) { return a - b; } );
			var sn = this.layout.nodes( this.selected_tree );

			var sni = 0;
			var i = 0;
			var previous_parent = null;
			while( (i < this.selected_nodes.length) && (sni < sn.length) )
			{
				if( this.selected_nodes[i].name == sn[sni].name )
				{
					this.selected_nodes[i] = sn[sni];
					sni++;
				}
				else
				{
					this.selected_nodes[i].r = 0;
					this.selected_nodes[i].value = 0;
				}
				i++;
			}
			
			while( i < this.selected_nodes.length )
			{
				this.selected_nodes[i].r = 0;
				this.selected_nodes[i].value = 0;
				i++;
			}
				
			this.update_data( this.selected_nodes );
		}

		highlight_data( null, -1 );
	}
	
	this.update_data = function( nodes )
	{
		this.root_node = nodes[0];
		this.nodes = nodes;

		this.container.selectAll( 'circle' )
			.data( nodes );
			
		this.container.selectAll( 'text' )
			.data( nodes.filter(function(d) { return d.children; }) )
		
		if( this.depth < 0 )
		{
			if( this.depth == -1 ) this.focus_on_node( null, false, false, true );
			else this.focus_on_node( null, false, true, true );
		}
		else
		{
			var new_node = this.nodes[this.node_index];
			this.focus_on_node( this.nodes[this.node_index], false, false, true );
		}
	}
	
	this.get_game_tree = function( title, filters, create_toggle_tree )
	{
		var self = this;
		
		var selected_nodes = 0;
		var game_tree = [];
		for( var k in games_list )
		{
			var e = games_list[k];
			
			var is_valid_game = true;
			for( var f in filters )
			{
				if( e[f] !== filters[f] ) is_valid_game = false;
			}
			
			var v = e[self.key];
			if( is_valid_game && create_toggle_tree )
			{
				if( e.selected ) selected_nodes++;
				else is_valid_game = false; //v = 0.01;
			}
			
			if( is_valid_game ) game_tree.push({ name:k, value:v, selected:e.selected });
		}
	
		return { name:title, children:game_tree, selected:selected_nodes };
	}

	this.get_platform_tree = function( filters, create_toggle_tree )
	{
		var self = this;
		var platform_tree = [];
		platforms.forEach(
			function( e )
			{
				var platform_filter = self.get_filter( filters, { platform:e } );
				var game_list = self.get_game_tree( e, platform_filter, create_toggle_tree );
				if( (!create_toggle_tree) || (create_toggle_tree && game_list.selected > 0) ) 
					platform_tree.push( game_list );
			});

		return { name:'Platforms', children:platform_tree };
	}

	this.get_genre_tree = function( filters, create_toggle_tree )
	{
		var self = this;
		var genre_tree = [];
		genres.forEach(
			function( e )
			{
				var genre_filter = self.get_filter( filters, { genre:e } );
				var game_list = self.get_game_tree( e, genre_filter, create_toggle_tree );
				if( (!create_toggle_tree) || (create_toggle_tree && game_list.selected > 0) ) 
					genre_tree.push( game_list );
			});

		return { name:'Genres', children:genre_tree };
	}

	this.get_filter = function( old_filters, new_filters )
	{
		var filter = {};
		for( var f in old_filters )
		{
			filter[f] = old_filters[f];
		}
		for( var f in new_filters )
		{
			filter[f] = new_filters[f];
		}
		return filter;
	}

}

