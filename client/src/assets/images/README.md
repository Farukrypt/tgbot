# Images Folder

This folder contains all images used in the Dream Telegram App.

## Image Files to Add

### Card Images (for Home page reward cards)

Add these image files for the 4 reward cards:

- `streak.png` or `streak.jpg` - Image for the "Streak" reward card
- `scratch.png` or `scratch.jpg` - Image for the "Scratch" reward card
- `quest.png` or `quest.jpg` - Image for the "Quest" reward card
- `bonus.png` or `bonus.jpg` - Image for the "Bonus" reward card

### Logo Image (for Header)

- `logo.png` or `logo.svg` - Your app logo/brand image

### Winner Avatar Images (Optional)

- `winner1.png` - Avatar for winner 1
- `winner2.png` - Avatar for winner 2
- `winner3.png` - Avatar for winner 3

## Image Specifications

- **Card Images**: Recommended size 300x300px or larger
- **Logo Image**: Recommended size 120x40px (width x height)
- **Avatar Images**: Recommended size 100x100px
- **Format**: PNG or JPG (PNG preferred for transparency)

## How to Add Images

1. Place your image files in this directory
2. Update the import paths in the respective React components:
   - `Home.jsx` - for card images
   - `Header.jsx` - for logo image
   - `Home.jsx` - for winner avatars (optional)

## Current Image References

### In Home.jsx

```javascript
// Card backgrounds (currently using placeholder URLs)
{['Streak', 'Scratch', 'Quest', 'Bonus'].map((title, i) => (
    ...
    backgroundImage: `url('path/to/images/${title.toLowerCase()}.png')`
))}

// Winner avatars (currently using placeholder URLs)
<img src={`/src/assets/images/winner${i}.png`} alt="Winner" />
```

### In Header.jsx

```javascript
// Logo image (currently using placeholder URL)
<img src='/src/assets/images/logo.png' alt='Dream Logo' />
```

## Notes

- Ensure all images are optimized for web (compressed)
- Use transparent PNGs for best quality with overlays
- Test responsive design on mobile devices after adding images
