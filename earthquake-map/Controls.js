

var Controls = function()
{
	this.size = { width: 430, height: 110 };
	this.position = { x: canvas_size.width - this.size.width - 10, y: 360 };
	
	this.start_year = null;
	this.end_year = null;
	
	this.map_month = null;
	this.map_year = null;
	
	this.show_great = null;
	this.show_major = null;
	this.show_strong = null;
	this.show_moderate = null;
	this.show_light = null;
	this.show_minor = null;

	//------------------------------------------------------------------------------------
	// Draw container
	//------------------------------------------------------------------------------------

	this.container = d3.select( '#diagram' )
		.append( 'div' )
			.attr( 'class', 'controls' )
			.style( 'position', 'absolute' )
			.style( 'left', this.position.x+'px' )
			.style( 'top', this.position.y+'px' )
			.style( 'width', this.size.width+'px' )
			.style( 'height', this.size.height+'px' )
			.style( 'z-index', 10 );
	
	
	
	//====================================================================================
	//=============================================================== Initialization =====
	
	this.Init = function( years )
	{
		var container_div;
		var line_div
		
		
		//
		// Start and End Year
		//
		
		container_div = this.container.append('div').attr('class', 'dates');
		container_div.append('h3').text('Bar Chart');
		
		line_div = container_div.append('div');
		line_div.append('label').text('Start Year');
		this.start_year = line_div.append("select").on( "change", update_barchart );
		this.start_year.selectAll( "option" )
			.data( years )
			.enter()
				.append( "option" )
				.text( function(d) { return d; } );

		line_div = container_div.append('div');
		line_div.append('label').text('End Year');
		this.end_year = line_div.append("select").on( "change", update_barchart );
		this.end_year.selectAll( "option" )
			.data( years )
			.enter()
				.append( "option" )
				.text( function(d) { return d; } );
		
		
		//
		// Magnitude Types
		//
		
		container_div = this.container.append('div').attr('class', 'magnitude');
		container_div.append('h3').text('Magnitude Types');
		
		line_div = container_div.append('div');
		this.show_great = line_div.append("input").attr('type', 'checkbox').on( "change", update_graphs );
		line_div.append("span").attr("class", "key great");
		line_div.append("label").text("Great");
				
		line_div = container_div.append('div');
		this.show_major = line_div.append("input").attr('type', 'checkbox').on( "change", update_graphs );
		line_div.append("span").attr("class", "key major");
		line_div.append("label").text("Major");
		
		line_div = container_div.append('div');
		this.show_strong = line_div.append("input").attr('type', 'checkbox').on( "change", update_graphs );
		line_div.append("span").attr("class", "key strong");
		line_div.append("label").text("Strong");
		
		line_div = container_div.append('div');
		this.show_moderate = line_div.append("input").attr('type', 'checkbox').on( "change", update_graphs );
		line_div.append("span").attr("class", "key moderate");
		line_div.append("label").text("Moderate");
		
		line_div = container_div.append('div');
		this.show_light = line_div.append("input").attr('type', 'checkbox').on( "change", update_graphs );
		line_div.append("span").attr("class", "key light");
		line_div.append("label").text("Light");
		
		line_div = container_div.append('div');
		this.show_minor = line_div.append("input").attr('type', 'checkbox').on( "change", update_graphs );
		line_div.append("span").attr("class", "key minor");
		line_div.append("label").text("Minor");
				
		
		//
		// Month and Year
		//
		
		container_div = this.container.append('div').attr('class', 'map');
		container_div.append('h3').text('Map');
		
		line_div = container_div.append('div');
		line_div.append('label').text('Month');
		this.map_month = line_div.append("select").on( "change", update_map );
		this.map_month.selectAll( "option" )
			.data( ["01","02","03","04","05","06","07","08","09","10","11","12"] )
			.enter()
				.append( "option" )
				.text( function(d) { return d; } );
		
		line_div = container_div.append('div');
		line_div.append('label').text('Year');
		this.map_year = line_div.append("select").on( "change", update_map );
		this.map_year.selectAll( "option" )
			.data( years )
			.enter()
				.append( "option" )
				.text( function(d) { return d; } );
				
		
		//
		// Set defaults
		//

		this.show_great.attr('checked','checked');
		this.show_major.attr('checked','checked');
		this.show_strong.attr('checked','checked');
		this.show_moderate.attr('checked','checked');
// 		this.show_light.attr('checked','checked');
// 		this.show_minor.attr('checked','checked');

		var extent = d3.extent( years, function(d) { return d; } );
		this.min_year = +extent[0]; this.max_year = +extent[1];
		
		this.SetStartYear( this.min_year );
		this.SetEndYear( this.max_year );
		
		this.SetMapMonth( 12 );
		this.SetMapYear( this.max_year );
	}
	
	
	this.DisableControls = function()
	{
		this.start_year.attr('disabled', 'disabled');
		this.end_year.attr('disabled', 'disabled');
	
		this.map_month.attr('disabled', 'disabled');
		this.map_year.attr('disabled', 'disabled');
	
		this.show_great.attr('disabled', 'disabled');
		this.show_major.attr('disabled', 'disabled');
		this.show_strong.attr('disabled', 'disabled');
		this.show_moderate.attr('disabled', 'disabled');
		this.show_light.attr('disabled', 'disabled');
		this.show_minor.attr('disabled', 'disabled');
	}
	
	this.EnableControls = function()
	{
		this.start_year.attr('disabled', null);
		this.end_year.attr('disabled', null);
	
		this.map_month.attr('disabled', null);
		this.map_year.attr('disabled', null);
	
		this.show_great.attr('disabled', null);
		this.show_major.attr('disabled', null);
		this.show_strong.attr('disabled', null);
		this.show_moderate.attr('disabled', null);
		this.show_light.attr('disabled', null);
		this.show_minor.attr('disabled', null);
	}
	
	
	
	//====================================================================================
	//========================================================= Properties Modifiers =====
	
	this.SetStartYear = function( year )
	{
		this.start_year.property( "value", year );
	}
	
	this.SetEndYear = function( year )
	{
		this.end_year.property( "value", year );
	}
	
	this.SetMapMonth = function( month )
	{
		this.map_month.property( "value", month );
	}
	
	this.SetMapYear = function( year )
	{
		this.map_year.property( "value", year );
	}
	
	
	
	//====================================================================================
	//========================================================= Properties Accessors =====
	
	this.StartYear = function()
	{
		return this.start_year.property( "value" );
	}
	
	this.EndYear = function()
	{
		return this.end_year.property( "value" );
	}
	
	this.MapMonth = function()
	{
		return this.map_month.property( "value" );
	}
	
	this.MapYear = function()
	{
		return this.map_year.property( "value" );
	}	
	
	this.ShowGreat = function()
	{
		return this.show_great.property("checked");
	}
	
	this.ShowMajor = function()
	{
		return this.show_major.property("checked");
	}
	
	this.ShowStrong = function()
	{
		return this.show_strong.property("checked");
	}
	
	this.ShowModerate = function()
	{
		return this.show_moderate.property("checked");
	}
	
	this.ShowLight = function()
	{
		return this.show_light.property("checked");
	}
	
	this.ShowMinor = function()
	{
		return this.show_minor.property("checked");
	}
	
	
	
	
	
}

