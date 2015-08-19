

var Toggle = function()
{
	this.container = svg
		.append( 'svg:g' )
			.attr( 'class', 'toggle-button' )
			.attr( 'transform', 'translate(' + (canvas_size.width - 270 - 100 - 10) + ',' + (canvas_size.height - 20 - 10) + ')' );

	this.button = this.container
		.append( 'svg:rect' )
			.attr( 'width', 100 ).attr( 'height', 20 )
			.on( 'click',
				function()
				{
					toggle_view();
				});
				
	this.text = this.container
		.append( 'svg:text' )
			.attr( 'text-anchor', 'middle' )
			.attr( 'transform', 'translate(50,10)' )
			.attr( 'dy', '0.25em' )
			.text( 'View Selected' );
			
	this.toggle_view = function()
	{
		if( view_all )
		{
			this.text.text( 'View Selected' );
		}
		else
		{
			this.text.text( 'View All' );
		}
	}
}