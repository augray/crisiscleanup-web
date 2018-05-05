import argparse
from os import listdir, makedirs
from os.path import isfile, splitext, basename
from os.path import join as path_join

from PIL import Image, ImageFilter

class SpriteGenerator(object):
    """
    Object for transforming icons into sprites
    """
    SUPPORTED_ICON_FORMATS = [".png"]
    
    def __init__(self):
        pass
    
    def _get_icons_to_transform(self, source_directory):
        #TODO: if sprite exists for an icon, exclude it
        return _list_files_with_extensions(source_directory,
                                           SpriteGenerator.SUPPORTED_ICON_FORMATS)
    
    def generate_from_directory(self, source_directory):
        """
        Apply the transformation on any icons not possesing sprites
        """
        source_icon_paths = self._get_icons_to_transform(source_directory)
        for source_icon_path in source_icon_paths:
            sprite_icons = self.generate_from_icon(Image.open(source_icon_path))
            self._write_sprite_directory(sprite_icons, source_icon_path)
    
    def _write_sprite_directory(self, sprite_icons, source_icon_path):
        """
        Create a directory containing all permutations of a source icon
        
        Arguments:
            sprite_icons: A dict from icon class to image object
            source_icon_path: the full path to the source icon generating 
                the sprite icons.
        """
        sprite_directory = splitext(source_icon_path)[0]
        makedirs(sprite_directory, exist_ok=True)
        
        source_name = basename(sprite_directory)
        for icon_class, sprite_icon in sprite_icons.items():
            file_name = path_join(sprite_directory, source_name+"-"+icon_class+".png")
            try:
                sprite_icon.save(file_name)
            except IOError as e:
                e.print_exc()
                print("cannot convert icon '{}' with icon class '{}'".format(source_name,icon_class))

    
    def generate_from_icon(self, icon):
        """
        Create a sprite for an icon located at the specified path
        """
        icon = icon.convert("RGBA")
        alpha_channel = icon.split()[3]
        
        hsv_icon = icon.convert("HSV")
        transform_configs = self._get_transform_configs()
        sprite_icons = {}
        for sprite_icon_class, transform_config in transform_configs.items():
            sprite_icon = self._apply_transforms(hsv_icon, alpha_channel, transform_config)
            sprite_icons[sprite_icon_class] = sprite_icon
        
        return sprite_icons
    
    def _get_transform_configs(self):
        """
        Get a dictionary mapping from sprite icon class to transforms
        
        Sprite icon class is a string that identifies the status, 
        claim state, and age of an icon completely. Each transform
        specifies how the corresponding source icon should be changed
        to produce the sprite icon for that sprite icon class.
        """
        return {
            "Thing1" : {"hue-rotation" : 150, "grayscale" : True},
            "Thing2" : {"hue-rotation" : -150, "grayscale" : False}
            }
    
    def _apply_transforms(self, hsv_icon, alpha_channel, transform_config):
        """
        For a given set of icon transforms, apply them and produce result
        
        For instance, for a specific status/claim state/age the hue might
        need to be rotated by x, the transparency changed by y, etc.
        """
        transforms = {
            "hue-rotation" : self._rotate_hue,
            "grayscale" : self._make_grayscale
            }
        for transform_key, transform_value in transform_config.items():
            if transform_key not in transforms:
                continue
            hsv_icon = transforms[transform_key](hsv_icon, transform_value)
        
        r, g, b = hsv_icon.convert("RGB").split()
        sprite_icon = Image.merge("RGBA", (r, g, b, alpha_channel))
        sprite_icon = self._add_dropshadow(sprite_icon)
        
        return sprite_icon
        
    @staticmethod
    def _add_dropshadow(sprite_icon):
        shadow = SpriteGenerator._create_shadow(sprite_icon)
        
        sprite_icon = Image.alpha_composite(shadow, sprite_icon)
        
        return sprite_icon
    
    @staticmethod
    def _create_shadow(sprite_icon):
        """
        Create a shadow (without the image it's shadowing)
        """
        scale_factor = 1.05 #how much larger should shadow be than image?
        shadow_lightness = 50 #what shade should the shadow be?
        shadow_channel_threshold = 10 #what is the opacity at which something deserves shadowing?
        blur_radius = 5 #how "blurry" should the shadow be?
        
        alpha_channel = sprite_icon.split()[3]
        
        #shadow channel is low where the image is, 255 elsewhere
        shadow_channel_filter = lambda i: shadow_lightness if i>shadow_channel_threshold else 255
        shadow_channel = alpha_channel.point(shadow_channel_filter)
        
        #A version of the icon that is completely black
        grayscale_icon = Image.merge("RGBA", (shadow_channel, shadow_channel, shadow_channel, alpha_channel))
        
        #create the shadow from a larger version of icon
        size_x, size_y = grayscale_icon.size
        shadow = grayscale_icon.resize((int(scale_factor*size_x), int(scale_factor*size_y)))
        
        shadow = shadow.filter(ImageFilter.GaussianBlur(blur_radius))
        
        #crop to original size
        crop_offset_x, crop_offset_y = (scale_factor-1)*size_x/2, (scale_factor-1)*size_y/2
        crop_box = (crop_offset_x, crop_offset_y, crop_offset_x+size_x, crop_offset_y+size_y)
        shadow = shadow.crop(crop_box)
        
        return shadow
        
        
    @staticmethod
    def _rotate_hue(hsv_icon, rotation_amount):
        HUE, SATURATION, VALUE = 0,1,2
        hsv_channels = hsv_icon.split()
        adapted_hue_channel = hsv_channels[HUE].point(lambda h: (h+rotation_amount+360) % 360)
        
        hsv_channels = adapted_hue_channel, hsv_channels[SATURATION], hsv_channels[VALUE]
        
        return Image.merge("HSV", hsv_channels)
    
    @staticmethod
    def _make_grayscale(hsv_icon, is_greyscale):
        if not is_greyscale:
            return hsv_icon
        
        #You can convert between RGB and L/HSV, but not HSV and L
        return hsv_icon.convert("L").convert("RGB").convert("HSV")
    
def _list_files_with_extensions(directory, extensions=None):
    extensions = extensions if extensions is not None else [""]
    include = lambda d, f: (isfile(path_join(d, f)) 
                            and any(f.endswith(extension) for extension in extensions))
    
    return [path_join(directory, f) for f in listdir(directory) if include(directory, f)]

def parse_args():
    parser = argparse.ArgumentParser(description="A script to transform "
                                     "source icons into sprites using a "
                                     "set of transformation rules for "
                                     "representing status/age/claim state")
    parser.add_argument("-d","--directory", 
                        help="The directory containing the source icons",
                        required=True)
    
    return vars(parser.parse_args())

def main():
    parsed_args = parse_args()
    source_dir = parsed_args["directory"]
    
    generator = SpriteGenerator()
    generator.generate_from_directory(source_dir)
    
    #test_image = "/home/jrbauer/code/crisiscleanup-web/scss/crisiscleanup/sprites/Debris.png"
    #generator.generate_from_icon(Image.open(test_image))
    

if __name__=="__main__":
    main()