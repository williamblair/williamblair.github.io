
var CreateBoardEntry = function( tileX, tileY, isFilled, tileColor )
{
    return {
        x: tileX,
        y: tileY,
        filled: isFilled,
        color: tileColor
    };
}

var CreateBoard = function()
{
    var board = { 
        tiles: []
    };
    
    for ( var x = 0; x < BOARD_WIDTH; x++ )
    {
        for ( var y = 0; y < BOARD_HEIGHT; y++ )
        {
            board.tiles.push( CreateBoardEntry( x, y, 1, "#ABCDEF" ) );
        }
    }
    
    return board;
}

var Board = CreateBoard();
var DrawBoard = function()
{
    for ( var x = 0; x < BOARD_WIDTH; x++ )
    {
        for ( var y = 0; y < BOARD_HEIGHT; y++ )
        {
            var tileIndex = y * BOARD_WIDTH + x;
            var curTile = Board.tiles[ tileIndex ];
            if ( curTile.filled )
            {
                var drawX = BOARD_X + x * TILE_WIDTH_PX;
                var drawY = BOARD_Y + y * TILE_HEIGHT_PX;
                renderer.DrawSquare( drawX, drawY, TILE_WIDTH_PX, curTile.color );
                
                // draw an outline to show tiles as well
                //renderer.DrawSquareOutline( drawX, drawY, TILE_WIDTH_PX, "#000000" ); 
            }
        }
    }
}
