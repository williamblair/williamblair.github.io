
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
            board.tiles.push( CreateBoardEntry( x, y, 0, "#ABCDEF" ) );
        }
    }
    
    return board;
}

var Board = CreateBoard();
var DrawBoard = function()
{
    // fill in board background
    renderer.DrawRect( BOARD_X, 
                       BOARD_Y, 
                       BOARD_WIDTH * TILE_WIDTH_PX, 
                       BOARD_HEIGHT * TILE_HEIGHT_PX,
                       BOARD_COLOR );
    
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

// returns true if the input tile collides with a piece already
// on the board, otherwise returns false
var BoardCollision = function( tile )
{
    for ( var xIndex = 0; xIndex < TILE_WIDTH; xIndex++ )
    {
        for ( var yIndex = 0; yIndex < TILE_HEIGHT; yIndex++ )
        {
            if ( tile.tiles[ yIndex * TILE_WIDTH + xIndex ] )
            {              
                // assuming the tile pixel position has been properly
                // moved in increments of tile width and height px
                var boardX = ( tile.x + ( xIndex * TILE_WIDTH_PX ) - BOARD_X ) / 
                             TILE_WIDTH_PX;
                var boardY = ( tile.y + ( yIndex * TILE_HEIGHT_PX ) - BOARD_Y ) / 
                             TILE_HEIGHT_PX;
                //boardY -= 1; // off by 1 errors :(
                
                var boardIndex = ( boardY * BOARD_WIDTH ) + boardX;
                
                if ( boardIndex < Board.tiles.length && 
                     Board.tiles[ boardIndex ].filled )
                {
                    return true;
                }
            }
        }
    }
    
    return false;
}

var StoreTileOnBoard = function( tile )
{
    for ( var xIndex = 0; xIndex < TILE_WIDTH; xIndex++ )
    {
        for ( var yIndex = 0; yIndex < TILE_HEIGHT; yIndex++ )
        {
            if ( tile.tiles[ yIndex * TILE_WIDTH + xIndex ] )
            {
                // assuming the tile pixel position has been properly
                // moved in increments of tile width and height px
                var boardX = ( tile.x + ( xIndex * TILE_WIDTH_PX ) - BOARD_X ) / 
                             TILE_WIDTH_PX;
                var boardY = ( tile.y + ( yIndex * TILE_HEIGHT_PX ) - BOARD_Y ) / 
                             TILE_HEIGHT_PX;
                boardY -= 1; // off by 1 errors :(
                
                var boardIndex = ( boardY * BOARD_WIDTH ) + boardX;
                
                Board.tiles[ boardIndex ].filled = true;
                Board.tiles[ boardIndex ].color = tile.color;
            }
        }
    }
}