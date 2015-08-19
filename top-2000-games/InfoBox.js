


var InfoBox = function()
{
	
	this.width = 250;
	this.height = 420;
	
	this.container = svg
		.append( 'svg:g' )
			.attr( 'class', 'game-info-container hide' )
			.attr( 'transform', 'translate(' + (canvas_size.width - this.width - 10) + ', 20)' );

	this.container.append( 'rect' )
		.attr( 'class', 'background' )
		.attr( 'width', this.width )
		.attr( 'height', this.height );
		
	this.container.append( 'rect' )
		.attr( 'class', 'title-background' )
		.attr( 'x', 140 ).attr( 'y', 40 )
		.attr( 'width', 110 )
		.attr( 'height', this.height - 60 );

	this.container.append( 'text' )
		.attr( 'class', 'title rank' )
		.attr( 'x', 150 ).attr( 'y', 60 )
		.text( 'Rank' );
	this.container.append( 'text' )
		.attr( 'class', 'title publisher' )
		.attr( 'x', 150 ).attr( 'y', 90 )
		.text( 'Publisher' );
	this.container.append( 'text' )
		.attr( 'class', 'title platform' )
		.attr( 'x', 150 ).attr( 'y', 120 )
		.text( 'Platform' );
	this.container.append( 'text' )
		.attr( 'class', 'title genre' )
		.attr( 'x', 150 ).attr( 'y', 150 )
		.text( 'Genre' );
	this.container.append( 'text' )
		.attr( 'class', 'title year' )
		.attr( 'x', 150 ).attr( 'y', 180 )
		.text( 'Year' );
	this.container.append( 'text' )
		.attr( 'class', 'title rating' )
		.attr( 'x', 150 ).attr( 'y', 210 )
		.text( 'Rating' );
	this.container.append( 'text' )
		.attr( 'class', 'title sales' )
		.attr( 'x', 150 ).attr( 'y', 240 )
		.text( 'Sales' );
	this.container.append( 'text' )
		.attr( 'class', 'title us-sales' )
		.attr( 'x', 150 ).attr( 'y', 270 )
		.text( 'US' );
	this.container.append( 'text' )
		.attr( 'class', 'title japan-sales' )
		.attr( 'x', 150 ).attr( 'y', 300 )
		.text( 'Japan' );
	this.container.append( 'text' )
		.attr( 'class', 'title europe-sales' )
		.attr( 'x', 150 ).attr( 'y', 330 )
		.text( 'Europe' );
	this.container.append( 'text' )
		.attr( 'class', 'title world-sales' )
		.attr( 'x', 150 ).attr( 'y', 360 )
		.text( 'Rest of the World' );
	this.container.append( 'text' )
		.attr( 'class', 'title global-sales' )
		.attr( 'x', 150 ).attr( 'y', 390 )
		.text( 'Global' );

	this.text_title = this.container
		.append( 'text' )
			.attr( 'class', 'game-title' )
			.attr( 'text-anchor', 'end' )
			.attr( 'x', this.width ).attr( 'y', 30 )
			.text( 'Title' );
	this.text_rank = this.container
		.append( 'text' )
			.attr( 'class', 'value rank' )
			.attr( 'text-anchor', 'end' )
			.attr( 'x', 130 ).attr( 'y', 60 )
			.text( 'Rank' );
	this.text_publisher = this.container
		.append( 'text' )
			.attr( 'class', 'value publisher' )
			.attr( 'text-anchor', 'end' )
			.attr( 'x', 130 ).attr( 'y', 90 )
			.text( 'Publisher' );
	this.text_platform = this.container
		.append( 'text' )
			.attr( 'class', 'value platform' )
			.attr( 'text-anchor', 'end' )
			.attr( 'x', 130 ).attr( 'y', 120 )
			.text( 'Platform' );
	this.text_genre = this.container
		.append( 'text' )
			.attr( 'class', 'value genre' )
			.attr( 'text-anchor', 'end' )
			.attr( 'x', 130 ).attr( 'y', 150 )
			.text( 'Genre' );
	this.text_year = this.container
		.append( 'text' )
			.attr( 'class', 'value year' )
			.attr( 'text-anchor', 'end' )
			.attr( 'x', 130 ).attr( 'y', 180 )
			.text( 'Year' );
	this.text_rating = this.container
		.append( 'text' )
			.attr( 'class', 'value rating' )
			.attr( 'text-anchor', 'end' )
			.attr( 'x', 130 ).attr( 'y', 210 )
			.text( 'Rating' );
	this.text_us = this.container
		.append( 'text' )
			.attr( 'class', 'value us-sales' )
			.attr( 'text-anchor', 'end' )
			.attr( 'x', 130 ).attr( 'y', 270 )
			.text( 'US' );
	this.text_japan = this.container
		.append( 'text' )
			.attr( 'class', 'value japan-sales' )
			.attr( 'text-anchor', 'end' )
			.attr( 'x', 130 ).attr( 'y', 300 )
			.text( 'Japan' );
	this.text_europe = this.container
		.append( 'text' )
			.attr( 'class', 'value europe-sales' )
			.attr( 'text-anchor', 'end' )
			.attr( 'x', 130 ).attr( 'y', 330 )
			.text( 'Europe' );
	this.text_world = this.container
		.append( 'text' )
			.attr( 'class', 'value world-sales' )
			.attr( 'text-anchor', 'end' )
			.attr( 'x', 130 ).attr( 'y', 360 )
			.text( 'Rest of the World' );
	this.text_global = this.container
		.append( 'text' )
			.attr( 'class', 'value global-sales' )
			.attr( 'text-anchor', 'end' )
			.attr( 'x', 130 ).attr( 'y', 390 )
			.text( 'Global' );
	

	this.init = function()
	{
	}
	
	this.populate = function( name )
	{
		if( name == null ) { this.clear(); return; }
		
		var game = games_list[name];
		if( !game ) { this.clear(); return; }

		this.show();
		this.text_title.text(game['title']);
		this.text_rank.text(game['rank']);
		this.text_platform.text(game['platform']);
		this.text_year.text(game['year']);
		this.text_genre.text(game['genre']);
		this.text_publisher.text(game['publisher']);
		this.text_rating.text(game['review-rating']);
		this.text_us.text(game['north-america-sales']);
		this.text_japan.text(game['japan-sales']);
		this.text_europe.text(game['europe-sales']);
		this.text_world.text(game['rest-of-world-sales']);
		this.text_global.text(game['global-sales']);
		
		return true;
	}
	
	this.clear = function()
	{
		this.hide();
		this.text_title.text('');
		this.text_rank.text('');
		this.text_platform.text('');
		this.text_year.text('');
		this.text_genre.text('');
		this.text_publisher.text('');
		this.text_rating.text('');
		this.text_us.text('');
		this.text_japan.text('');
		this.text_europe.text('');
		this.text_world.text('');
		this.text_global.text('');
	}
	
	this.show = function()
	{
		this.container.attr( 'class', 'game-info-container show' );
	}
	
	this.hide = function()
	{
		this.container.attr( 'class', 'game-info-container hide' );
	}
}

