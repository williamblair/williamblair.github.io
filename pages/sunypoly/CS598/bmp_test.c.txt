/* 
 * Example loading a BMP image
 */

#include <stdio.h>
#include <stdlib.h>
#include <psx.h>

/* Screen width and height */
#define S_WIDTH  320
#define S_HEIGHT 240

/* Max sprite texture size */
#define MAX_SPR_SIZE 255

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

typedef struct {

    uint16_t header; // the header field
    uint32_t filesize; // size of the file in bytes

    uint32_t reserved; // 4 bytes of reserved data (depending on the image that creates it)

    uint32_t pix_offset; // 4 bytes - offset (i.e. starting address) of where the pixmap can be found

} BMP_header;

/*
 * Load BMP (assumes is 16bit)
 */
void load_bmp(const char *filename, uint16_t *buffer)
{
    int i,j;
    uint8_t r,g,b;
    uint16_t pixel_buffer[(MAX_SPR_SIZE+1)*S_HEIGHT]; // holds the pixels from the bmp, before we process them
    BMP_header header;

    uint32_t dib_header_size;
    uint32_t image_width, image_height;
    uint16_t num_planes;
    uint16_t bits_per_pixel;
    uint32_t compression; // BI_BITFIELDS, 3 == no compression used
    uint32_t image_size; // size of raw bitmap data, including padding
    uint32_t x_meter, y_meter; // Pixels per meter (print resolution)
    uint32_t num_colors; // number of colors in a color table (CLUT)
    uint32_t important_colors; // important color count
    uint32_t rmask, gmask, bmask; // red, green, blue mask
    uint32_t amask; // alpha mask

    uint32_t bytes_read;

    uint32_t padded_width; // the image width aligned/padded to the nearest 4 bytes

    FILE *fp = fopen(filename, "r");
    if (!fp) {
        printf("Failed to open %s!\n", filename);
        return;
    }

    /* Read in the BMP header */
    fread(&header.header, 2, 1, fp); // Read in the header
    fread(&header.filesize, 4, 1, fp); // Read in the file size
    fread(&header.reserved, 4, 1, fp); // Read in reserved
    fread(&header.pix_offset, 4, 1, fp); // Read in the pixel offset

    /* DIB header info */
    fread(&dib_header_size, 4, 1, fp);
    fread(&image_width, 4, 1, fp);
    fread(&image_height, 4, 1, fp);
    fread(&num_planes, 2, 1, fp);
    fread(&bits_per_pixel, 2, 1, fp);
    fread(&compression, 4, 1, fp);
    fread(&image_size, 4, 1, fp);
    fread(&x_meter, 4, 1, fp);
    fread(&y_meter, 4, 1, fp);
    fread(&num_colors, 4, 1, fp);
    fread(&important_colors, 4, 1, fp);
    fread(&rmask, 4, 1, fp);
    fread(&gmask, 4, 1, fp);
    fread(&bmask, 4, 1, fp);
    fread(&amask, 4, 1, fp);
    /* don't really care about the rest of the header info, we'll skip to pixels now */
    fseek(fp, header.pix_offset, SEEK_SET);

    /* when reading, we might need to adjust width with 4byte aligned padding
     * e.g. the rowsize equation from here:
     *   https://en.wikipedia.org/wiki/BMP_file_format
     * align to 2 instead of 4 since uint16 = 2 bytes each
     */
    padded_width = image_width+(image_width%2);
    printf("Padded width: %d\n", padded_width);

    /* Info! */
    printf("Header: 0x%X\n", header.header);
    printf("Filesize: %d bytes\n", header.filesize);
    printf("Reserved: 0x%X\n", header.reserved);
    printf("Pix offset: %d\n", header.pix_offset);

    printf("\nDIB header size: %d\n", dib_header_size);
    printf("Image width, height: %d,%d\n", image_width, image_height);
    printf("Planes: %d\n", num_planes);
    printf("Bits Per Pixel: %d\n", bits_per_pixel);
    printf("Compression: %d\n", compression);
    printf("Image size: %d\n", image_size);
    printf("Print Resolution: %d, %d\n", x_meter, y_meter);
    printf("Colors in color table: %d\n", num_colors);
    printf("Important Colors: %d\n", important_colors);
    printf("RGBA masks: %X, %X, %X, %X\n", rmask, gmask, bmask, amask);
    
    printf("\nftell: %ld\n", ftell(fp));

    if (bits_per_pixel != 16) {
        printf("!!!!!UNIMPLEMENTED BITS PER PIXEL!!!!!\n");
        printf("  Bits Per Pixel: %d\n", bits_per_pixel);
        return;
    }

    /* read in the pixel data */
    bytes_read = fread(pixel_buffer, 2, padded_width*image_height, fp);
    printf("Read %d bytes\n", bytes_read);

    fclose(fp);

    /* now we need to flip Y, and swap the R and B components */
    for (i = 0; i < image_width; ++i) {
        for (j = 0; j < image_height; ++j) {

            /* get the pixel at the flipped y coordinate */
            uint16_t curpix = pixel_buffer[(image_height-j)*padded_width+i];

            b = curpix & 31;
            g = (curpix>>5)&31;
            r = (curpix>>10)&31;
    
            /* set the new color (switch b and r)
             * also y is flipped compared to curpix
             */
            buffer[j*image_width+i] = (b<<10) | (g<<5) | r;
        }
    }
}

int main(void)
{
    int i;
    int j;
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


    /*
     * Load the bmp image from cd into screen_buffer
     */
    load_bmp("cdrom:\\hi.bmp;1", screen_buffer);

    /*
     * Copy our local display buffer to VRAM 
     * 
     * We send it to location (320,0) as this corresponds
     * to texture page 5 that we specified above in 
     * screen_sprite (each tpage = 64px width, 64*5=320)
     */
    LoadImage(screen_buffer, 320, 0, MAX_SPR_SIZE, S_HEIGHT);
    while(GsIsDrawing());

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


