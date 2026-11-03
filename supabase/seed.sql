-- ============================================================================
-- THE FIFTH WALL — Complete Seed Data
-- Luxury Lighting, Furniture, and Décor
-- ============================================================================

-- 1. Categories
INSERT INTO public.categories (id, name, slug, description, image_url, display_order, is_active) VALUES
('c0000001-0000-0000-0000-000000000001', 'Chandeliers', 'chandeliers', 'Sculptural statement chandeliers designed to hold the room with quiet drama and radiant warmth.', 'https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?auto=format&fit=crop&w=1200&q=85', 1, true),
('c0000001-0000-0000-0000-000000000002', 'Ceiling Lights', 'ceiling-lights', 'Sculptural overhead lighting and flush-mount fixtures that make the ceiling speak.', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85', 2, true),
('c0000001-0000-0000-0000-000000000003', 'Wall Lights', 'wall-lights', 'Artistic wall sconces and architectural lights casting patterned warmth across textured walls.', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=85', 3, true),
('c0000001-0000-0000-0000-000000000004', 'Pendant Lights', 'pendant-lights', 'Suspended poetic luminaires crafted with handblown glass, brushed brass, and honed stone.', 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=1200&q=85', 4, true),
('c0000001-0000-0000-0000-000000000005', 'Floor Lamps', 'floor-lamps', 'Sculptural standing lamps tailored for tranquil reading corners and ambient evening light.', 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=85', 5, true),
('c0000001-0000-0000-0000-000000000006', 'Table Lamps', 'table-lamps', 'Handcrafted bedside and console luminaires marrying tactile stone, ceramic, and amber glass.', 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=1200&q=85', 6, true),
('c0000001-0000-0000-0000-000000000007', 'Outdoor Lighting', 'outdoor-lighting', 'Architectural IP65-rated bronze sconces, landscape bollards, and terrace lanterns.', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85', 7, true),
('c0000001-0000-0000-0000-000000000008', 'Ceiling Fans', 'ceiling-fans', 'Aerodynamic whisper-quiet luxury ceiling fans finished in natural walnut and brushed champagne.', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85', 8, true),
('c0000001-0000-0000-0000-000000000009', 'Furniture', 'furniture', 'Considered consoles, lounge chairs, and sculptural marble tables built for intentional living.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85', 9, true),
('c0000001-0000-0000-0000-000000000010', 'Interior Décor', 'interior-decor', 'Artisanal mirrors, brass vessels, sculptural objects, and atmospheric finishing touches.', 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=85', 10, true)
ON CONFLICT (id) DO NOTHING;

-- 2. Products (Prices stored in integer paise: ₹24,800 = 2480000 paise)
INSERT INTO public.products (
    id, name, slug, category_id, short_description, description,
    price_in_paise, compare_at_price_in_paise, material, dimensions,
    finish, color, style, stock_quantity, is_featured, is_bestseller, is_new_arrival, is_active, primary_image_url
) VALUES
(
    'p0000001-0000-0000-0000-000000000001',
    'Halo Drift',
    'halo-drift-ceiling-light',
    'c0000001-0000-0000-0000-000000000002',
    'Sculptural floating halo fixture with diffuse 360-degree ambient perimeter illumination.',
    'The Halo Drift is a contemporary masterwork that redefines overhead illumination. Crafted from aeronautical grade spun aluminum with a satin champagne brass electroplated exterior, it floats effortlessly below the ceiling. A continuous perimeter diffuser softens the warm 3000K LED glow, washing the room in architectural luxury.',
    2480000, 2950000, 'Spun Aluminum, Optical Acrylic', 'Diameter: 85 cm, Drop: 12 cm',
    'Satin Champagne Brass', 'Champagne Gold', 'Contemporary Minimalist', 14, true, true, false, true,
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85'
),
(
    'p0000001-0000-0000-0000-000000000002',
    'Heritage Crest',
    'heritage-crest-bronze-lantern',
    'c0000001-0000-0000-0000-000000000003',
    'Architectural antiqued bronze wall lantern featuring fluted water glass panels.',
    'Rooted in classic architectural geometry, Heritage Crest pairs hand-patinated antiqued bronze framing with kiln-fired fluted glass panes. Designed for distinguished entryways, long galleries, and veranda courtyards, casting soft prismatic refractions along vertical surfaces.',
    890000, 1150000, 'Hand-Patinated Bronze, Fluted Glass', 'Height: 46 cm, Width: 18 cm, Depth: 16 cm',
    'Antiqued Bronze', 'Charcoal Bronze', 'Transitional Classical', 20, true, false, false, true,
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=85'
),
(
    'p0000001-0000-0000-0000-000000000003',
    'Botanica Glow',
    'botanica-glow-double-sconce',
    'c0000001-0000-0000-0000-000000000003',
    'Double handblown opal glass globes anchored on a sculpted organic brass branch.',
    'Inspired by emergent buds along morning branches, Botanica Glow features dual mouth-blown matte opal glass diffusers held gently by hand-cast solid brass branchwork. Provides soothing, glare-free indirect warmth suited for bedroom suites and powder rooms.',
    1260000, 1500000, 'Cast Solid Brass, Mouth-blown Opal Glass', 'Height: 52 cm, Width: 28 cm, Depth: 20 cm',
    'Aged Warm Brass', 'Warm Brass / Opal White', 'Organic Modern', 12, true, true, false, true,
    'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=85'
),
(
    'p0000001-0000-0000-0000-000000000004',
    'Oro Loop',
    'oro-loop-three-ring-pendant',
    'c0000001-0000-0000-0000-000000000004',
    'Interlocking triple ring pendant system with adjustable suspension geometry.',
    'Oro Loop commands attention through fluid harmony. Three interlocking brushed gold concentric rings can be individually tilted and rotated along micro-aircraft cables, allowing homeowners and designers to curate an ever-evolving kinetic light sculpture over dining tables.',
    1975000, 2400000, 'Machined Brass & Silicone Diffusers', 'Ring Diameters: 60 cm, 40 cm, 20 cm',
    'Brushed Champagne Gold', 'Champagne Gold', 'Modern Kinetic', 10, true, true, false, true,
    'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=1200&q=85'
),
(
    'p0000001-0000-0000-0000-000000000005',
    'Galaxy Arc',
    'galaxy-arc-statement-chandelier',
    'c0000001-0000-0000-0000-000000000001',
    'Panoramic multi-tier statement chandelier evoking celestial orbital trajectories.',
    'Galaxy Arc is the pinnacle of grand scale residential lighting. Twelve precision-counterweighted orbital arms radiate outward from a solid brass central orb. Each arm culminates in an ambient dual-emitting crystal lens, creating unmatched atmospheric presence in double-height living spaces.',
    3150000, 3800000, 'Forged Brass, Optical Grade K9 Crystal', 'Diameter: 125 cm, Height: 75 cm',
    'Brushed French Brass', 'French Brass', 'Architectural Luxury', 8, true, true, true, true,
    'https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?auto=format&fit=crop&w=1200&q=85'
),
(
    'p0000001-0000-0000-0000-000000000006',
    'Luna Stack',
    'luna-stack-layered-disc-chandelier',
    'c0000001-0000-0000-0000-000000000001',
    'Cascading tiered disc chandelier with textured travertine and brass plates.',
    'Luna Stack balances mineral permanence with ethereal glow. Hand-carved discs of Italian Roman travertine alternate with spun brass plates, filtering soft downlight while projecting a warm halo across ceiling coffers.',
    2840000, 3350000, 'Roman Travertine, Spun Brass', 'Diameter: 70 cm, Height: 90 cm',
    'Natural Honed Travertine & Brass', 'Ivory / Warm Gold', 'Modern Editorial', 6, true, false, true, true,
    'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?auto=format&fit=crop&w=1200&q=85'
),
(
    'p0000001-0000-0000-0000-000000000007',
    'Arbor Halo',
    'arbor-halo-sculptural-led-wall',
    'c0000001-0000-0000-0000-000000000003',
    'Sculptural backlit feature wall installation with organic dendritic tree motifs.',
    'A breathtaking intersection of wall art and architectural illumination. Laser-cut brass fretwork in an intricate botanical tree silhouette is backlit by concealed dimmable LEDs, turning any feature wall into a gallery-calibre focal point.',
    4280000, 4900000, 'Engineered Brass, Textured Matte Black Backplate', 'Height: 180 cm, Width: 100 cm, Depth: 8 cm',
    'Dual Finish: Antique Brass & Matte Noir', 'Brass / Noir', 'Luxury Statement Art', 5, true, false, true, true,
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85'
),
(
    'p0000001-0000-0000-0000-000000000008',
    'Moon Mosaic',
    'moon-mosaic-circular-wall-installation',
    'c0000001-0000-0000-0000-000000000003',
    'Moon-inspired illuminated circular wall installation with textured metallic crater reliefs.',
    'Recalling the tranquil lunar surface, Moon Mosaic features hammered copper and gilded gold leaf tesserae encased in a minimalist black steel rim. When illuminated, the perimeter wash reveals deeply mesmerizing textural shadows.',
    2190000, 2600000, 'Hammered Copper, Gold Leaf, Mild Steel', 'Diameter: 90 cm, Depth: 7 cm',
    'Hand-Applied Gold Leaf & Charcoal Rim', 'Gold Leaf / Deep Charcoal', 'Sculptural Art', 9, false, true, false, true,
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=85'
),
(
    'p0000001-0000-0000-0000-000000000009',
    'Crystal Trio',
    'crystal-trio-warm-pendants',
    'c0000001-0000-0000-0000-000000000004',
    'Set of three fluted crystal cylinder pendants with knurled champagne brass collars.',
    'Designed for kitchen islands, breakfast nooks, and vanity areas. Three slender fluted crystal pendants deliver targeted direct task lighting downwards while illuminating the lead crystal cylinder with warm champagne facets.',
    1675000, 2100000, 'Solid Fluted Lead Crystal, Knurled Brass', 'Individual Pendant: Dia 10 cm, Height 32 cm',
    'Champagne Brass', 'Champagne Gold / Clear Crystal', 'Contemporary Modern', 15, true, true, false, true,
    'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=85'
),
(
    'p0000001-0000-0000-0000-000000000010',
    'Gilded Duet',
    'gilded-duet-double-arm-sconce',
    'c0000001-0000-0000-0000-000000000003',
    'Gold double-arm wall sconce crowned with hand-pleated silk cream shades.',
    'Timeless residential elegance. Two gracefully curving cast arms in lustrous brushed gold support delicate cream raw-silk pleated mini-shades with hand-finished trim. Ideal for formal dining alcoves and corridor accents.',
    1480000, 1850000, 'Solid Cast Brass, Raw Silk Pleated Shades', 'Height: 44 cm, Width: 34 cm, Depth: 19 cm',
    'Lustrous Brushed Gold', 'Gold / Warm Cream', 'Classic Modern', 16, true, false, false, true,
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=85'
),
(
    'p0000001-0000-0000-0000-000000000011',
    'Beam Noir',
    'beam-noir-symmetrical-sconce',
    'c0000001-0000-0000-0000-000000000003',
    'Architectural matte black sconce projecting razor-sharp bidirectional light beams.',
    'Minimalism stripped to its pure geometric essence. An extruded block of aero-grade anodized matte black aluminum houses precision optical lenses casting narrow 24-degree warm light columns upward and downward in exact symmetry.',
    795000, 990000, 'Die-Cast Aluminum, Optical Glass Lenses', 'Height: 22 cm, Width: 8 cm, Depth: 9 cm',
    'Anodized Matte Noir', 'Deep Black', 'Architectural Minimalist', 25, true, true, false, true,
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=85'
),
(
    'p0000001-0000-0000-0000-000000000012',
    'Orbit Sculpt',
    'orbit-sculpt-golden-loop-pendant',
    'c0000001-0000-0000-0000-000000000004',
    'Seamless continuous ribbon loop pendant cast in flowing champagne brass.',
    'A fluid sculpture frozen mid-air. One continuous loop of curved brass ribbon wraps around itself, concealing a flexible 360-degree high-CRI 95+ LED engine. Appears differently from every angle in the living room.',
    2760000, 3400000, 'Curved Extruded Brass, Frosted Silicone', 'Length: 110 cm, Width: 45 cm, Drop: 150 cm (Adj.)',
    'Mirror-Polished Brass', 'Champagne Gold', 'Sculptural Modern', 8, true, false, true, true,
    'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=1200&q=85'
),
(
    'p0000001-0000-0000-0000-000000000013',
    'Solstice Arc Floor Lamp',
    'solstice-arc-floor-lamp',
    'c0000001-0000-0000-0000-000000000005',
    'Sweeping cantilevered arch floor lamp anchored in heavy white Calacatta marble.',
    'A dramatic cantilever that spans gracefully across luxury sectional sofas. Grounded by a 35 kg solid Calacatta marble plinth, the telescoping brushed brass mast supports a spun brass dome with integrated step-dimming.',
    3850000, 4600000, 'Calacatta Marble, Brushed Brass, Spun Steel', 'Reach: 195 cm, Height: 220 cm',
    'Brushed Champagne & Calacatta', 'Gold / White Veined Marble', 'Modern Iconic', 7, true, true, false, true,
    'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=85'
),
(
    'p0000001-0000-0000-0000-000000000014',
    'Aura Spiral Table Lamp',
    'aura-spiral-table-lamp',
    'c0000001-0000-0000-0000-000000000006',
    'Sculptural spiral table lamp with handblown amber glass and matte graphite base.',
    'Like molten glass arrested mid-twist, the Aura Spiral table lamp emits an inviting honey-amber glow that enriches bedside tables, library consoles, and executive studies.',
    1450000, 1800000, 'Hand-Twisted Amber Art Glass, Cast Graphite Base', 'Height: 42 cm, Diameter: 24 cm',
    'Amber Glass & Matte Graphite', 'Warm Amber / Charcoal', 'Sculptural Contemporary', 18, true, false, true, true,
    'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=1200&q=85'
),
(
    'p0000001-0000-0000-0000-000000000015',
    'Zephyr Aerofoil Ceiling Fan',
    'zephyr-aerofoil-ceiling-fan',
    'c0000001-0000-0000-0000-000000000008',
    'Aerodynamic 3-blade solid American walnut ceiling fan with brushless DC motor.',
    'Engineered for silent high-volume airflow. Carved from sustainably harvested North American walnut with aerofoil profiling, driven by a quiet 30W BLDC motor with 6-speed reverse mode and integrated warm LED downlight.',
    3290000, 3950000, 'Solid American Walnut, Brushed Brass Hub', 'Blade Span: 142 cm (56 inch)',
    'Natural Walnut & Brushed Brass', 'Walnut Wood / Warm Brass', 'Contemporary Organic', 11, true, true, false, true,
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85'
),
(
    'p0000001-0000-0000-0000-000000000016',
    'Monolith Walnut Console',
    'monolith-walnut-console',
    'c0000001-0000-0000-0000-000000000009',
    'Architectural entryway console in fluted dark walnut with inset Nero Marquina marble.',
    'The anchor of an unforgettable entrance. Monolith showcases rhythmically milled solid walnut fluting supporting a honed Spanish Nero Marquina marble top with delicate white veining and concealed soft-close drawer compartments.',
    6400000, 7500000, 'Solid Canaletto Walnut, Nero Marquina Marble', 'Length: 160 cm, Depth: 42 cm, Height: 82 cm',
    'Smoked Walnut & Honed Marble', 'Smoked Walnut / Black Marble', 'Modern Architectural', 4, true, false, false, true,
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85'
)
ON CONFLICT (id) DO NOTHING;

-- 3. Coupons
INSERT INTO public.coupons (id, code, discount_type, discount_value, minimum_order_in_paise, max_discount_in_paise, is_active, usage_limit, times_used) VALUES
('d0000001-0000-0000-0000-000000000001', 'WELCOME10', 'percentage', 10, 500000, 500000, true, 1000, 12),
('d0000001-0000-0000-0000-000000000002', 'FIFTHWALL15', 'percentage', 15, 2000000, 1000000, true, 500, 4),
('d0000001-0000-0000-0000-000000000003', 'LUXURY5000', 'fixed', 500000, 3000000, 500000, true, 200, 2)
ON CONFLICT (id) DO NOTHING;

-- 4. Site Settings
INSERT INTO public.site_settings (id, key, value, description) VALUES
('e0000001-0000-0000-0000-000000000001', 'general', '{
    "brand_name": "THE FIFTH WALL",
    "tagline": "Lighting. Interiors. Beyond.",
    "brand_statement": "Transforming Spaces Into Experiences.",
    "showroom_address": "1/803, Sector 1, Gomti Nagar Vistar, Lucknow",
    "showroom_hours": "Mon – Sat, 10:30 am – 8:00 pm",
    "email": "studio@thefifthwall.in",
    "phone": "+91 98765 43210",
    "whatsapp": "+91 98765 43210",
    "free_shipping_threshold_paise": 499900,
    "flat_shipping_rate_paise": 49900,
    "warranty_years": 2,
    "instagram_url": "https://instagram.com/thefifthwall.in",
    "facebook_url": "https://facebook.com/thefifthwall.in",
    "pinterest_url": "https://pinterest.com/thefifthwall"
}'::jsonb, 'Brand general settings and contact info'),
('e0000001-0000-0000-0000-000000000002', 'hero_slides', '[
    {
        "id": 1,
        "eyebrow": "The Art of Lighting",
        "title": "Lighting. Interiors. Beyond.",
        "subtitle": "Transforming Spaces Into Experiences.",
        "description": "Discover thoughtfully curated lighting and interior pieces that bring character, warmth and timeless elegance to your spaces.",
        "cta_text": "EXPLORE COLLECTION",
        "cta_link": "/shop",
        "secondary_text": "DISCOVER OUR STORY",
        "secondary_link": "/about",
        "image_url": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=90"
    },
    {
        "id": 2,
        "eyebrow": "Spaces That Inspire",
        "title": "Light That Holds The Room.",
        "subtitle": "Sculptural Chandeliers & Pendants",
        "description": "Each fixture is a considered study in balance, material and atmosphere — engineered to become an organic part of the architecture around it.",
        "cta_text": "VIEW CHANDELIERS",
        "cta_link": "/collections/chandeliers",
        "secondary_text": "BOOK CONSULTATION",
        "secondary_link": "/contact",
        "image_url": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2200&q=90"
    },
    {
        "id": 3,
        "eyebrow": "Designed for Extraordinary Living",
        "title": "Where Material Meets Atmosphere.",
        "subtitle": "Handcrafted Metals & Honed Travertine",
        "description": "From statement chandeliers to ambient wall luminaires, elevate every ceiling and corner beyond the expected.",
        "cta_text": "SHOP ALL PIECES",
        "cta_link": "/shop",
        "secondary_text": "EXPLORE ROOMS",
        "secondary_link": "/shop#rooms",
        "image_url": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2200&q=90"
    }
]'::jsonb, 'Homepage rotating hero slides')
ON CONFLICT (id) DO NOTHING;

-- 5. Genuine Product Reviews
INSERT INTO public.product_reviews (id, product_id, customer_name, rating, title, comment, is_verified_purchase, is_approved) VALUES
('r0000001-0000-0000-0000-000000000001', 'p0000001-0000-0000-0000-000000000001', 'Vikram Malhotra', 5, 'Breathtaking centerpiece', 'The Halo Drift completely transformed our duplex living room. The warm champagne finish looks even more magnificent in person. Truly international quality.', true, true),
('r0000001-0000-0000-0000-000000000002', 'p0000001-0000-0000-0000-000000000004', 'Radhika Singhania', 5, 'Museum-grade perfection', 'We ordered the Oro Loop for our dining area in Delhi. The packaging was immaculate, and the three adjustable rings allow you to create distinct geometric moods.', true, true),
('r0000001-0000-0000-0000-000000000003', 'p0000001-0000-0000-0000-000000000003', 'Arjun Kapoor', 5, 'Subtle and warm', 'The Botanica Glow sconces bring such a serene warmth to our master bedroom corridor. The cast brass feels substantial and timeless.', true, true),
('r0000001-0000-0000-0000-000000000004', 'p0000001-0000-0000-0000-000000000005', 'Meera Deora', 5, 'Remarkable craftsmanship', 'Galaxy Arc is simply mesmerizing. Our guests never stop talking about it. The customer support from The Fifth Wall was top notch.', true, true)
ON CONFLICT (id) DO NOTHING;
