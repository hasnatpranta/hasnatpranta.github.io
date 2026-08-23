-- ============================================================
-- Seeds the CMS with the portfolio's current real content, so the
-- admin dashboard opens already populated instead of empty.
-- Run this ONCE, after schema.sql, in the Supabase SQL Editor.
-- Images point at the already-optimized files on hasnatpranta.github.io —
-- no re-upload needed. New items added later can use Supabase Storage.
-- ============================================================

-- ---------- PROFILE ----------
update profile set
  full_name = 'Kabirul Hasnat Pranta',
  headline = 'Urban Planner · MEL Specialist · GIS Analyst',
  location = 'Satkhira, Bangladesh',
  hero_tagline = 'I map places, measure change, and turn field data into decisions — for WASH, climate resilience and migration programmes across Bangladesh.',
  email = 'hasnatpranta@gmail.com',
  phone = '+8801627081889',
  cv_url = 'https://hasnatpranta.github.io/assets/files/Kabirul_Hasnat_Pranta_CV.pdf'
where id = 1;

-- ---------- ABOUT ----------
update about_content set
  paragraph_1 = 'I''m an urban and regional planner (B.URP, KUET) with <strong>6+ years across NGOs and consultancies</strong>, currently coordinating Monitoring, Evaluation &amp; Learning for <strong>GO4IMPact</strong> — a WaterAid–Swisscontact consortium programme funded by the Embassy of Switzerland — at Rupantar.',
  paragraph_2 = 'My work sits where field reality meets data: designing MEL frameworks and survey tools, running data collection with ODK and KoboToolbox, analysing results in SPSS, and turning it all into maps, dashboards and reports that stakeholders actually use — from union parishads to international donors.',
  paragraph_3 = 'Before this I worked as an urban planner on <strong>feasibility studies and GIS mapping projects</strong> for Dhaka''s city corporations, the Rural Electrification Board, Bangladesh Red Crescent Society and the Urban Development Directorate — including drone surveys for the Bangladesh Coast Guard.'
where id = 1;

insert into stats (value, suffix, label, order_index) values
  (6, '+', 'years of professional experience', 0),
  (15, '+', 'development & infrastructure projects', 1),
  (25, '+', 'five-star freelance map commissions', 2),
  (145, '', 'banknotes catalogued from 31 countries', 3);

insert into skill_groups (title, items, order_index) values
  ('Spatial', 'ArcGIS · QGIS · ERDAS Imagine · Google Earth Engine · AutoCAD · Pix4D · Agisoft Metashape', 0),
  ('Data & MEL', 'SPSS · MS Access · ODK · KoboToolbox · Mergin Maps · Logical frameworks · Indicator design', 1),
  ('Design & Reporting', 'Adobe Photoshop · Illustrator · InDesign · Report writing · Data visualization', 2);

-- ---------- HERO GLOBE PINS ----------
insert into hero_pins (layer, name, sub, lat, lon, order_index) values
  ('work', 'Satkhira', 'GO4IMPact — MEL Coordinator (current)', 22.72, 89.07, 0),
  ('work', 'Khulna', 'CRC — M&E Officer · KUET', 22.82, 89.55, 1),
  ('work', 'Dhaka', 'Traffic & feasibility studies (DNCC, DSCC)', 23.81, 90.41, 2),
  ('work', 'Gaibandha & Kurigram', 'GIS mapping — Red Crescent (BDRCS)', 25.55, 89.55, 3),
  ('work', 'Rajshahi', 'Urban LEDS II — open green space plan', 24.37, 88.6, 4),
  ('work', 'Bagerhat (Sarankhola)', 'Storm-surge vulnerability study', 22.31, 89.79, 5);

insert into hero_pins (layer, name, count, lat, lon, order_index) values
  ('notes', 'Bangladesh', 81, 23.7, 90.4, 0),
  ('notes', 'India', 9, 21.0, 78.0, 1),
  ('notes', 'Pakistan', 8, 30.4, 69.4, 2),
  ('notes', 'Nepal', 6, 28.4, 84.1, 3),
  ('notes', 'China', 3, 35.0, 104.0, 4),
  ('notes', 'United States', 3, 39.8, -98.6, 5),
  ('notes', 'Mongolia', 3, 46.9, 103.8, 6),
  ('notes', 'Ukraine', 3, 48.4, 31.2, 7),
  ('notes', 'Trinidad and Tobago', 2, 10.7, -61.2, 8),
  ('notes', 'Saudi Arabia', 2, 24.0, 45.0, 9),
  ('notes', 'Qatar', 2, 25.3, 51.2, 10),
  ('notes', 'Malaysia', 2, 4.2, 102.0, 11),
  ('notes', 'Venezuela', 2, 6.4, -66.6, 12),
  ('notes', 'Iraq', 2, 33.2, 43.7, 13),
  ('notes', 'Philippines', 1, 12.9, 121.8, 14),
  ('notes', 'Croatia', 1, 45.1, 15.2, 15),
  ('notes', 'Nicaragua', 1, 12.9, -85.2, 16),
  ('notes', 'Kyrgyzstan', 1, 41.2, 74.8, 17),
  ('notes', 'Argentina', 1, -38.4, -63.6, 18),
  ('notes', 'Hong Kong', 1, 22.3, 114.2, 19),
  ('notes', 'Soviet Union', 1, 55.7, 37.6, 20),
  ('notes', 'South Sudan', 1, 6.9, 31.3, 21),
  ('notes', 'Myanmar', 1, 21.9, 95.9, 22),
  ('notes', 'Bahamas', 1, 25.0, -77.4, 23),
  ('notes', 'Transnistria', 1, 47.2, 29.5, 24),
  ('notes', 'Bhutan', 1, 27.5, 90.4, 25),
  ('notes', 'Cambodia', 1, 12.6, 104.9, 26),
  ('notes', 'Sri Lanka', 1, 7.9, 80.8, 27),
  ('notes', 'North Korea', 1, 40.3, 127.5, 28),
  ('notes', 'Egypt', 1, 26.8, 30.8, 29),
  ('notes', 'Oman', 1, 21.5, 55.9, 30);

-- ---------- EXPERIENCE ----------
insert into experience (date_range, title, org_line, description, order_index) values
  ('Apr 2024 — Present', 'Coordinator, MEL — Rupantar', 'GO4IMPact · WaterAid–Swisscontact consortium · Embassy of Switzerland', 'Designing and running the MEL system for a multi-partner WASH and climate-resilience programme: performance indicators, data quality assurance, learning sessions and donor reporting.', 0),
  ('Aug 2022 — Mar 2024', 'Urban Planner — IMAGE Research & Consultancy Ltd.', 'DNCC · DSCC · REB · BDRCS · UDD · Bangladesh Coast Guard', 'GIS mapping of civil structures, feasibility studies for urban interchanges and underground power distribution, comprehensive development plans for nine upazilas, drone surveys and traffic studies.', 1),
  ('Feb 2022 — Jul 2022', 'Project Coordinator — IMAGE Research & Consultancy Ltd.', 'DCNUP traffic study · Urban LEDS II open green space plan, Rajshahi', 'Coordinated project activities, resources and stakeholder communication across two urban projects.', 2),
  ('Jul 2019 — Jan 2022', 'Monitoring & Evaluation Officer — CRC, Khulna', 'Sanitation behaviour change in urban slums (JADE/JFGE) · SANDEE/ICIMOD research', 'Ran the M&E plan, workshops, FGDs and surveys; cleaned and validated field data and reported progress against the monitoring framework.', 3);

-- ---------- GIS WORK ----------
update featured_project set
  title = 'Cyclone shelter access & storm-surge vulnerability',
  location = 'Khontakata Union, Sarankhola Upazila, Bagerhat',
  description = 'A full spatial vulnerability study of a coastal union on the edge of the Sundarbans: terrain elevation modelling, storm-surge inundation scenarios at 4 m and 6 m, physical and building vulnerability indices (PVI/BVI), and cyclone shelter service-area analysis identifying served, unserved and overserved communities.',
  tools = 'ArcGIS · elevation modelling · service area analysis · risk indexing'
where id = 1;

insert into gis_items (title, caption, image_url, thumb_url, featured, order_index) values
  ('Physical Vulnerability Index (PVI) risk map', 'Physical Vulnerability Index (PVI) risk map', 'https://hasnatpranta.github.io/assets/img/gis/Picture5.jpg', 'https://hasnatpranta.github.io/assets/img/gis/thumb/Picture5.jpg', true, 0),
  ('Khontakata Union — study area', 'Khontakata Union — study area', 'https://hasnatpranta.github.io/assets/img/gis/Picture1.jpg', 'https://hasnatpranta.github.io/assets/img/gis/thumb/Picture1.jpg', true, 1),
  ('Terrain elevation model', 'Terrain elevation model', 'https://hasnatpranta.github.io/assets/img/gis/Picture2.jpg', 'https://hasnatpranta.github.io/assets/img/gis/thumb/Picture2.jpg', true, 2),
  ('Storm-surge inundation, 6 m scenario', 'Storm-surge inundation, 6 m scenario', 'https://hasnatpranta.github.io/assets/img/gis/Picture4.jpg', 'https://hasnatpranta.github.io/assets/img/gis/thumb/Picture4.jpg', true, 3),
  ('Storm-surge inundation, 4 m scenario', 'Storm-surge inundation, 4 m scenario', 'https://hasnatpranta.github.io/assets/img/gis/Picture3.jpg', 'https://hasnatpranta.github.io/assets/img/gis/thumb/Picture3.jpg', true, 4),
  ('Building Vulnerability Index (BVI) risk map', 'Building Vulnerability Index (BVI) risk map', 'https://hasnatpranta.github.io/assets/img/gis/Picture6.jpg', 'https://hasnatpranta.github.io/assets/img/gis/thumb/Picture6.jpg', true, 5),
  ('Cyclone shelter service areas — served', 'Cyclone shelter service areas — served', 'https://hasnatpranta.github.io/assets/img/gis/Picture7.jpg', 'https://hasnatpranta.github.io/assets/img/gis/thumb/Picture7.jpg', true, 6),
  ('Cyclone shelter service areas — unserved', 'Cyclone shelter service areas — unserved', 'https://hasnatpranta.github.io/assets/img/gis/Picture8.jpg', 'https://hasnatpranta.github.io/assets/img/gis/thumb/Picture8.jpg', true, 7),
  ('Cyclone shelter service areas — overserved', 'Cyclone shelter service areas — overserved', 'https://hasnatpranta.github.io/assets/img/gis/Picture9.jpg', 'https://hasnatpranta.github.io/assets/img/gis/thumb/Picture9.jpg', true, 8),
  ('Assasuni activity coverage', 'Programme activity coverage — Assasuni Upazila, Satkhira', 'https://hasnatpranta.github.io/assets/img/gis/Assasuni.jpg', 'https://hasnatpranta.github.io/assets/img/gis/thumb/Assasuni.jpg', false, 0),
  ('Shyamnagar activity coverage', 'Activity coverage on the edge of the Sundarbans — Shyamnagar', 'https://hasnatpranta.github.io/assets/img/gis/Shyamnagar.jpg', 'https://hasnatpranta.github.io/assets/img/gis/thumb/Shyamnagar.jpg', false, 1),
  ('Satkhira Municipality activity coverage', 'Activity coverage — Satkhira Municipality', 'https://hasnatpranta.github.io/assets/img/gis/Municipality.jpg', 'https://hasnatpranta.github.io/assets/img/gis/thumb/Municipality.jpg', false, 2);

-- ---------- EVENT MAPS ----------
insert into event_map_items (title, caption, image_url, thumb_url, order_index) values
  ('Festival site map', 'Festival site map — Fiverr client, USA', 'https://hasnatpranta.github.io/assets/img/event/7fe45255-a83f-4f7c-90f2-ee856b70003a.jpg', 'https://hasnatpranta.github.io/assets/img/event/thumb/7fe45255-a83f-4f7c-90f2-ee856b70003a.jpg', 0),
  ('Event map commission', 'Event map commission — Fiverr', 'https://hasnatpranta.github.io/assets/img/event/a4efd411-8028-4287-88ab-ac80ba167df6.jpg', 'https://hasnatpranta.github.io/assets/img/event/thumb/a4efd411-8028-4287-88ab-ac80ba167df6.jpg', 1),
  ('Event map commission', 'Event map commission — Fiverr', 'https://hasnatpranta.github.io/assets/img/event/ac50b61a-58cb-4323-8b1e-94251ef39891.jpg', 'https://hasnatpranta.github.io/assets/img/event/thumb/ac50b61a-58cb-4323-8b1e-94251ef39891.jpg', 2),
  ('Event map commission', 'Event map commission — Fiverr', 'https://hasnatpranta.github.io/assets/img/event/ac88045b-5831-45a2-a3d1-4156ba134d07.jpg', 'https://hasnatpranta.github.io/assets/img/event/thumb/ac88045b-5831-45a2-a3d1-4156ba134d07.jpg', 3),
  ('Event map commission', 'Event map commission — Fiverr', 'https://hasnatpranta.github.io/assets/img/event/e6a57742-9803-4331-9369-68d018e89a75.jpg', 'https://hasnatpranta.github.io/assets/img/event/thumb/e6a57742-9803-4331-9369-68d018e89a75.jpg', 4);

-- ---------- DESIGN WORK ----------
insert into design_items (title, caption, image_url, thumb_url, order_index) values
  ('Programme roll-up banner', 'Programme roll-up banner — GO4IMPact / WaterAid–Swisscontact', 'https://hasnatpranta.github.io/assets/img/design/Banner_DDLG.jpg', 'https://hasnatpranta.github.io/assets/img/design/thumb/Banner_DDLG.jpg', 0),
  ('Photo gallery banner', 'Photo gallery banner — programme event', 'https://hasnatpranta.github.io/assets/img/design/Banner_Photo_gallery.jpg', 'https://hasnatpranta.github.io/assets/img/design/thumb/Banner_Photo_gallery.jpg', 1),
  ('Campaign poster', 'Campaign poster', 'https://hasnatpranta.github.io/assets/img/design/Poster.jpg', 'https://hasnatpranta.github.io/assets/img/design/thumb/Poster.jpg', 2),
  ('News / bulletin design', 'News / bulletin design', 'https://hasnatpranta.github.io/assets/img/design/News.jpg', 'https://hasnatpranta.github.io/assets/img/design/thumb/News.jpg', 3),
  ('Event photobooth frame', 'Event photobooth frame', 'https://hasnatpranta.github.io/assets/img/design/Photobooth.jpg', 'https://hasnatpranta.github.io/assets/img/design/thumb/Photobooth.jpg', 4);

-- ---------- REPORTS ----------
insert into reports (title, description, tag, order_index) values
  ('PWVA Report — Satkhira Municipality, Ward 8', 'Ward-level vulnerability assessment combining household data, spatial analysis and community consultation under the GO4IMPact programme.', 'MEL · WASH · climate resilience', 0),
  ('Traffic Impact Assessment — Final Report', 'Transport analysis supporting junction design and feasibility work in Dhaka, from survey design through data analysis to recommendations.', 'Urban planning · transport', 1),
  ('Post-migration socio-economic lifestyles', 'Undergraduate thesis exploring how displaced households in Sarankhola rebuild livelihoods after migration — the same coastal geography as my vulnerability mapping work.', 'Research · migration', 2);

-- ---------- BANKNOTE COLLECTION ----------
insert into collection_groups (slug, title, description, order_index) values
  ('world', 'Around the world', 'One-note-per-country showcase and regional sets, from South Asia to the Americas', 0),
  ('bd', 'Bangladesh', 'The home collection — 81 notes tracing every taka denomination through the decades', 1),
  ('theme', 'Themes', 'Cross-cutting stories — faces, colours, timelines and the number one', 2),
  ('denom', 'Denominations', 'Ones to thousands — the same value, told by different countries', 3);

insert into collection_items (group_id, title, image_url, thumb_url, order_index)
select g.id, v.title, v.image_url, v.thumb_url, v.order_index
from (values
  ('world', 'One note per country — the whole collection', 'World_00_One_Note_Per_Country', 0),
  ('world', 'India', 'World_01_India', 1),
  ('world', 'Pakistan', 'World_02_Pakistan', 2),
  ('world', 'Nepal, Bhutan & Sri Lanka', 'World_03_Nepal_Bhutan_SriLanka', 3),
  ('world', 'The Middle East', 'World_04_Middle_East', 4),
  ('world', 'East & Southeast Asia', 'World_05_East_Southeast_Asia', 5),
  ('world', 'Europe & the former USSR', 'World_06_Europe_ExUSSR', 6),
  ('world', 'The Americas & Africa', 'World_07_Americas_Africa', 7),
  ('bd', 'Bangladesh — denomination showcase', 'Bangladesh_00_Denomination_Showcase', 0),
  ('bd', 'Evolution of the one taka', 'Bangladesh_01_One_Taka_Evolution', 1),
  ('bd', 'Two taka variations', 'Bangladesh_02_Two_Taka_Variations', 2),
  ('bd', 'Evolution of the five taka', 'Bangladesh_03_Five_Taka_Evolution', 3),
  ('bd', 'Ten taka variations', 'Bangladesh_04_Ten_Taka_Variations', 4),
  ('bd', 'Twenty taka', 'Bangladesh_05_Twenty_Taka', 5),
  ('bd', 'Fifty taka', 'Bangladesh_06_Fifty_Taka', 6),
  ('bd', 'Higher denominations of Bangladesh', 'Bangladesh_07_Higher_Denominations', 7),
  ('theme', 'A timeline of the world — arranged by year of issue', 'Theme_03_Chronological_Timeline', 0),
  ('theme', 'Faces of currency', 'Theme_02_Faces_of_Currency', 1),
  ('theme', 'The colour spectrum of money', 'Theme_04_Colour_Spectrum', 2),
  ('theme', 'The number one, around the world', 'Theme_01_The_Number_One', 3),
  ('denom', 'Ones of the world', 'Denomination_01_Ones', 0),
  ('denom', 'Twos of the world', 'Denomination_02_Twos', 1),
  ('denom', 'Fives of the world', 'Denomination_03_Fives', 2),
  ('denom', 'Tens of the world', 'Denomination_04_Tens', 3),
  ('denom', 'Twenties of the world', 'Denomination_05_Twenties', 4),
  ('denom', 'Fifties of the world', 'Denomination_06_Fifties', 5),
  ('denom', 'Hundreds of the world', 'Denomination_07_Hundreds', 6),
  ('denom', 'High denominations — 200, 500 & 1000', 'Denomination_08_High_200_500_1000', 7),
  ('denom', 'Odd & fractional denominations', 'Denomination_09_Odd_Fractional', 8)
) as v(group_slug, title, base, order_index)
join collection_groups g on g.slug = v.group_slug
cross join lateral (
  select
    ('https://hasnatpranta.github.io/assets/img/collages/' || v.base || '.jpg') as image_url,
    ('https://hasnatpranta.github.io/assets/img/collages/thumb/' || v.base || '.jpg') as thumb_url
) img;

-- ---------- SEO METADATA ----------
update seo_meta set title = 'Kabirul Hasnat Pranta — Urban Planner · MEL Specialist · GIS Analyst',
  description = 'Portfolio of Kabirul Hasnat Pranta — urban planner and MEL specialist working in WASH, climate change and migration. GIS mapping, data visualization, event map design and a world banknote collection.'
  where page_slug = 'home';
update seo_meta set title = 'GIS & Spatial Analysis — Kabirul Hasnat Pranta',
  description = 'GIS and spatial analysis work by Kabirul Hasnat Pranta — programme activity mapping, storm-surge vulnerability modelling and cyclone shelter analysis.'
  where page_slug = 'gis';
update seo_meta set title = 'Freelance Event Maps — Kabirul Hasnat Pranta',
  description = 'Freelance event map commissions by Kabirul Hasnat Pranta — 25+ five-star Fiverr projects for festivals and events worldwide.'
  where page_slug = 'event-maps';
update seo_meta set title = 'Design for Development — Kabirul Hasnat Pranta',
  description = 'Design work by Kabirul Hasnat Pranta — banners, posters and event material for development programmes, in Adobe Illustrator, Photoshop and InDesign.'
  where page_slug = 'design';
update seo_meta set title = 'Banknote Collection — Kabirul Hasnat Pranta',
  description = 'A numismatic collection of 145 banknotes from 31 countries, curated into collages — by Kabirul Hasnat Pranta.'
  where page_slug = 'collection';
