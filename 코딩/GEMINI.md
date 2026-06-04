# StyleMind AI Virtual Try-On Engine Specification
You are a senior AI engineer and computer vision engineer.
You are NOT creating a demo UI.
You are NOT creating a face swap application.
You are NOT creating a mockup.
You are building a real AI-powered Virtual Fitting System.

==================================================

PROJECT GOAL

Create a production-ready virtual fitting engine for StyleMind AI.
The system must generate a personalized digital fashion avatar and dress the avatar with extracted clothing items.
This system must NOT use face overlay.
This system must NOT use face swapping.
This system must NOT display existing model images.
The final fitting result must be generated from a newly created avatar.

==================================================

CRITICAL RULES

PROHIBITED:
- Face pasted onto existing model
- Face swapping
- Circular face crop
- Existing model body
- Static preview image
- Mock fitting
- Fake fitting effect
- Overlaying user image on product image

If any of these methods are used, the implementation is incorrect.

==================================================

PHASE 1

FACE EXTRACTION

Input:
User uploads selfie

System actions:
1. Detect face
2. Detect hair
3. Detect ears
4. Detect neck
5. Remove background completely

Use:
MediaPipe Face Detection
BiRefNet
RMBG-2.0

Output:
Transparent PNG

Requirements:
Preserve hairstyle
Preserve face shape
Preserve skin tone
Preserve facial proportions

Result:
user_face.png

==================================================

PHASE 2

BODY ANALYSIS

User enters:
Height
Weight
Gender
Body Type
Optional Full Body Photo

Analyze:
Shoulder width
Chest width
Waist width
Hip width
Leg ratio
Arm ratio

Classify:
Slim
Normal
Athletic
Muscular
Curvy
Plus Size

Generate:
body_profile.json

==================================================

PHASE 3

AI BODY TWIN GENERATION

Generate a completely new avatar.

Input:
user_face.png
body_profile.json

Output:
Transparent PNG Avatar

Requirements:
Preserve face identity
Preserve hairstyle
Match body measurements
Match height ratio
Neutral standing pose
Front view
Fashion lookbook style
Transparent background

DO NOT USE STOCK MODELS
DO NOT USE EXISTING MODEL PHOTOS

The avatar must be newly generated.

==================================================

PHASE 4

CLOTHING EXTRACTION

User selects clothing item.
System must automatically separate clothing from model.

Input:
Fashion product image

Process:
Detect clothing region
Generate segmentation mask
Remove model body
Remove face
Remove arms
Remove legs
Keep clothing only

Use:
SAM2
BiRefNet
Grounded-SAM

Output:
Transparent PNG clothing

Examples:
shirt.png
jacket.png
pants.png
dress.png

==================================================

PHASE 5

REAL VIRTUAL FITTING

Input:
avatar.png
clothing.png

Use:
IDM-VTON
CatVTON
Virtual Try-On pipeline

Requirements:
Fit clothing to body shape
Fit clothing to shoulder width
Fit clothing to waist width
Fit clothing to hip size
Generate realistic wrinkles
Generate realistic folds
Generate realistic shadows
Generate realistic fabric behavior

DO NOT overlay images.
Generate a new image.

==================================================

PHASE 6

STYLE DNA INTEGRATION

Connect fitting result with Style DNA.

Display:
Style Match %
Color Match %
Body Compatibility %
Occasion Suitability %

Explain:
Why this outfit fits the user's style.

==================================================

UI REQUIREMENTS

STEP 1
Upload Face

STEP 2
Generate Body Twin

STEP 3
Choose Clothing

STEP 4
Extract Clothing

STEP 5
Generate Virtual Fitting

STEP 6
Save Look

==================================================

TECH REQUIREMENTS

Next.js
TypeScript
Tailwind CSS
Shadcn UI
Framer Motion

Use actual AI pipelines.
Do not simulate functionality.
Do not create placeholder fitting.
Every fitting result must be generated dynamically.
Generate complete production-ready code.
