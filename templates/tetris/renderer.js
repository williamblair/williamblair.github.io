var renderer = {

	width: 0,
	height: 0,
	canvas: undefined,
	ctx: undefined,
	
	Init: function( width, height )
	{
		this.width  = width;
		this.height = height;
		
		this.canvas = document.getElementById( "mycanvas" );
		this.ctx = this.canvas.getContext( "2d" );
	},
	
	Clear: function()
	{
        this.ctx.stroke();
		this.ctx.fillStyle = "#000000";
		this.ctx.fillRect( 0, 0, this.width, this.height );
	},
	
	DrawCircle( x, y, radius, color )
	{
		this.ctx.fillStyle = color;
		this.ctx.beginPath();
		this.ctx.arc( x, y, radius, 0, 2 * Math.PI );
		this.ctx.stroke();
	},
	
	DrawSquare( x, y, size, color )
	{
		this.ctx.fillStyle = color;
		this.ctx.fillRect( x, y, size, size );
	},
    
    DrawSquareOutline( x, y, size, color )
    {
        this.ctx.strokeStyle = color;
        this.ctx.rect( x, y, size, size );
    },
    
    DrawText( x, y, font, color, message )
    {
        this.ctx.font = font;
        this.ctx.fillStyle = color;
        this.ctx.fillText( message, x, y );
    }
};