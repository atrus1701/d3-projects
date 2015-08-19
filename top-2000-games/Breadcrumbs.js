

var Breadcrumbs = function()
{
	
	this.container = svg
		.append( 'svg:g' )
			.attr( 'class', 'breadcrumbs' )
			.attr( 'transform', 'translate(' + (canvas_size.width - 10) + ',0)' );
	
	this.text = this.container
		.append( 'svg:text' )
			.attr( 'transform', 'translate(0,15)' )
			.attr( 'dy', '0.35em' )
			.attr( 'text-anchor', 'end' )
			.text( '' );

	this.init = function()
	{
	}
	
	this.populate = function( node )
	{
		if( node == null )
		{
			this.text.text( '' );
			return;
		}
		
		var n = node;
		var s = n.name;

		while( n.parent )
		{
			s = n.parent.name + ' > ' + s;
			n = n.parent;
		}
	
		this.text.text( s );
	}
}