
var CreateTile = function( tileArray, inColor )
{
    var tileObj = {
        
        // px position on screen
        x: BOARD_X,
        y: BOARD_Y,
        
        tiles: tileArray,
        color: inColor
    };
    return tileObj;
}

var DrawTile = function( tile )
{
    var xIndex = 0;
    var yIndex = 0;
    for ( var x = tile.x; 
          x < tile.x + TILE_WIDTH_PX*TILE_WIDTH; 
          x += TILE_WIDTH_PX )
    {
        yIndex = 0;
        for ( var y = tile.y; 
              y < tile.y + TILE_HEIGHT_PX*TILE_HEIGHT; 
              y += TILE_HEIGHT_PX )
        {
            var index = yIndex * TILE_WIDTH + xIndex;
            if ( tile.tiles[index] !== 0 )
            {
                renderer.DrawSquare( x, y, TILE_WIDTH_PX, tile.color );
            }
            yIndex++;
        }
        xIndex++;
    }
}

// check for board collision or end of board
var TileShouldStop = function( tile )
{
    for ( var xIndex = 0; xIndex < TILE_WIDTH; xIndex++ )
    {
        for ( var yIndex = 0; yIndex < TILE_HEIGHT; yIndex++ )
        {
            if ( tile.tiles[ yIndex * TILE_WIDTH + xIndex ] )
            {
                var tileX = tile.x + (xIndex * TILE_WIDTH_PX);
                var tileY = tile.y + (yIndex * TILE_HEIGHT_PX);
                
                // check if hitting bottom of board
                if ( tileY + TILE_HEIGHT_PX >
                     BOARD_Y + (BOARD_HEIGHT * TILE_HEIGHT_PX) )
                {
                    return true;
                }
                
                
                // check if colliding with a piece on the board
                if (BoardCollision( tile ))
                {
                    return true;
                }
            }
        }
    }
    
    return false;
}

var NextTile = CreateTile( AllTiles[ Math.floor( Math.random() * AllTiles.length ) ],
                           AllColors[ Math.floor( Math.random() * AllColors.length ) ] );
var CurTile = CreateTile( AllTiles[ Math.floor( Math.random() * AllTiles.length ) ],
                           AllColors[ Math.floor( Math.random() * AllColors.length ) ] );

var gameTimeCounter = 0;
const tileUpdateTime = 500; // time until update in milliseconds
var UpdateTile = function()
{
    gameTimeCounter += GetGameTimeDiff();
    if ( gameTimeCounter > tileUpdateTime )
    {
        gameTimeCounter = 0;
        
        //CurTile.x = (CurTile.x + 1);
        var CurTileCopy = CurTile;
        CurTile.y = ( CurTile.y + TILE_HEIGHT_PX );
    
        if (TileShouldStop( CurTile ))
        {
            StoreTileOnBoard( CurTileCopy );
            
            CurTile = NextTile;
            NextTile = CreateTile( AllTiles[Math.floor(Math.random() * AllTiles.length)],
                                   AllColors[Math.floor(Math.random() * AllColors.length)] );
            CurTile.x = BOARD_X;
            CurTile.y = BOARD_Y;
        }
    }
}

// functions for keyboard input
var MoveTileRight = function()
{
    CurTile.x += TILE_WIDTH_PX;
    
    // prevent moving off the board
    for ( var xIndex = 0; 
          xIndex < TILE_WIDTH; 
          xIndex++ )
    {
        for ( var yIndex = 0; 
              yIndex < TILE_HEIGHT;
              yIndex++ )
        {
            if ( CurTile.tiles[ yIndex * TILE_WIDTH + xIndex ] )
            {
                var tileX = CurTile.x + (xIndex * TILE_WIDTH_PX);
                var tileY = CurTile.y + (yIndex * TILE_HEIGHT_PX);
                
                if ( tileX + TILE_WIDTH_PX >
                     BOARD_X + (BOARD_WIDTH * TILE_WIDTH_PX) )
                {
                    // undo the move right
                    CurTile.x -= TILE_WIDTH_PX;
                    return;
                }
            }
        }
    }
    
    // check for another tile on the board
    if (BoardCollision( CurTile ))
    {
        CurTile.x -= TILE_WIDTH_PX; // undo the move right
    }
}

var MoveTileLeft = function()
{
    CurTile.x -= TILE_WIDTH_PX;
    
    // Check against far left side of board
    if ( CurTile.x < BOARD_X )
    {
        // undo the move left
        CurTile.x += TILE_WIDTH_PX;
        return;
    }

    // check for another tile on the board
    if (BoardCollision( CurTile ))
    {
        CurTile.x += TILE_WIDTH_PX;
    }
}

// register keyboard input
document.addEventListener( 'keydown', function(event)
{
    switch ( event.key )
    {
    case 'd':
        MoveTileRight();
        break;
    case 'a':
        MoveTileLeft();
        break;
    default:
        break;
    }
});
