

var Data = new function()
{
	this.canvas_size = { width:1220, height: 670 };
	this.node = null;
	this.svg = null;
	
	
	this.getCanvasWidth()
	{
		this.canvas_size.width;
	}
	
	this.getCanvasHeight()
	{
		return this.canvas_size.height;
	}
	
	this.storeSvg( svg )
	{
		this.svg = svg;
	}
	
	this.getSvg()
	{
		return this.svg;
	}
}
