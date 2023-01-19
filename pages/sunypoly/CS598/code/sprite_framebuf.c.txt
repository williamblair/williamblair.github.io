/* 
 * Base Example of having a Sprite framebuffer
 */

#include <stdio.h>
#include <stdlib.h>
#include <psx.h>

/* Screen width and height */
#define S_WIDTH  320
#define S_HEIGHT 240

/* Max sprite texture size */
#define MAX_SPR_SIZE 256

/* Macro for creating a 16bit BGR color
 * PSX does Blue, Green, Red instead of Red, Green Blue
 */
#define RGB16(R,G,B) \
    ((((B) << 10) | ((G) << 5) | (R)) & 0xFFFF)

static unsigned int prim_list[0x4000];
static volatile int display_is_old = 1;
static volatile int time_counter = 0;
static int dbuf = 0;

static void prog_vblank_handler(void) {
    display_is_old = 1;
    time_counter++;
}

/*
 * Initialize the PSX
 */
void init(void)
{
    /* Basic Inits */
    PSX_Init();
    GsInit();
    GsSetList(prim_list);
    GsClearMem();

    /* Video Mode */
    GsSetVideoMode(S_WIDTH, S_HEIGHT, VMODE_NTSC);

    /* BIOS Font */
    GsLoadFont(768, 0, 768, 256);

    /* VBlank handler */
    SetVBlankHandler(prog_vblank_handler);
}

int main(void)
{
    int i;
    uint16_t screen_buffer[MAX_SPR_SIZE * S_HEIGHT]; // our local buffer to draw to
    GsSprite screen_sprite;                          // sprite that will map to the above buffer

    /* Used to draw a random pixel */
    int R, G, B;
    int x, y;

    /* Initialize the PSX */
    init();

    /* Set screen sprite information */
    screen_sprite.x = (S_WIDTH - MAX_SPR_SIZE) / 2; // center the sprite on the screen
    screen_sprite.y = 0;

    screen_sprite.w = MAX_SPR_SIZE; // NOT screen width, but instead max sprite size
    screen_sprite.h = S_HEIGHT;

    screen_sprite.u = 0; // texture coordinates I believe
    screen_sprite.v = 0;

    screen_sprite.cx = 0; // CLUT x and y I believe
    screen_sprite.cy = 0;

    screen_sprite.r = screen_sprite.g = screen_sprite.b = NORMAL_LUMINOSITY; // color offsets

    screen_sprite.scalex = 1; // how much to scale the sprite
    screen_sprite.scaley = 1;

    screen_sprite.mx = (screen_sprite.w/2) * (screen_sprite.scalex / SCALE_ONE); // defines the point which the sprite is rotated around
    screen_sprite.mx = (screen_sprite.h/2) * (screen_sprite.scaley / SCALE_ONE);
    screen_sprite.rotate = ROTATE_ONE * 0; // rotation

    screen_sprite.tpage = 5; // which texture page is this stored in (from left to right) the image is stored in - in this case 5 maps to the x,y location (320,0)

    screen_sprite.attribute = COLORMODE(COLORMODE_16BPP); // What color depth


    /* Fill in the screen buffer */
    for (i=0; i < MAX_SPR_SIZE * S_HEIGHT; ++i) {
        screen_buffer[i] = RGB16(0,0,31); // Blue
    }

    /* Main Loop */
    for (;;) 
    {
        if (display_is_old) {

            /* Switch the drawing and display areas */
            GsSetDispEnvSimple(0, dbuf ? 0 : 256);
            GsSetDrawEnvSimple(0, dbuf ? 256 : 0, 320, 240);

            /* Switch display buffers */
            dbuf = !dbuf;

            /* Clear the Screen */
            GsSortCls(0,0,0);

            /*
             * Copy our local display buffer to VRAM 
             * 
             * We send it to location (320,0) as this corresponds
             * to texture page 5 that we specified above in 
             * screen_sprite (each tpage = 64px width, 64*5=320)
             */
            LoadImage(screen_buffer, 320, 0, MAX_SPR_SIZE, S_HEIGHT);
            while(GsIsDrawing());

            /* Add the sprite to prim list, so it can be drawn */
            GsSortSprite(&screen_sprite);

            /* Because the image is just a sprite, we can still
             * draw other stuff on the screen via the PSX, for
             * example some text:
             */
            GsPrintFont(20, 20, "Hello World!");

            /* Draw everything in the prim list */
            GsDrawList();
            while(GsIsDrawing());

            /* Set the flag to prevent redrawing
             * until the image has been sent to the t.v.
             */
            display_is_old = 0;
        }
    }

    return 0;
}


