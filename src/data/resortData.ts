export interface Amenity {
  id: number;
  title: string;
  subtitle: string;
  desc: string;
  tag: string;
  img: string;
}

export interface Room {
  title: string;
  pax: string;
  price: string;
  img: string;
  features: string[];
}

export interface Review {
  name: string;
  rating: number;
  text: string;
}

export interface GalleryItem {
  common: string;
  photo: {
    url: string;
    text: string;
  };
}

export const amenities: Amenity[] = [
  {
    id: 1,
    title: 'Beachfront Teepee Cottages',
    subtitle: 'SIGNATURE STAY',
    desc: 'Rustic A-frame teepee cottages built from native bamboo, positioned directly on the white sand shore. Wake to the sound of waves, steps from the ocean.',
    tag: 'Sleeps 2–3 guests',
    img: '/assets/137b10b5-e357-4d34-99e5-f41b1e482a3c.jpg',
  },
  {
    id: 2,
    title: 'Family Villa',
    subtitle: 'FAMILY RETREAT',
    desc: 'Spacious air-conditioned family villas with private balcony sea views, a dedicated dining area, shared cooking facilities, and complimentary parking.',
    tag: 'Sleeps up to 12 guests',
    img: '/assets/a4c91579-d589-489d-9968-1606a80913c1.jpg',
  },
  {
    id: 3,
    title: 'Floating Cottage Experience',
    subtitle: 'ON-WATER DINING',
    desc: 'Dine suspended over the crystal-clear bay in our iconic floating cottages. An unforgettable setting for family feasts, celebrations, and quiet afternoon retreats.',
    tag: 'Exclusive add-on',
    img: '/assets/7b5aae7c-53c3-423a-a8a9-2cc915d074ba.jpg',
  },
  {
    id: 4,
    title: 'Island Boat Rides',
    subtitle: 'ADVENTURE',
    desc: 'Explore the pristine coastline of Casiguran Bay. Our traditional bancas take you through hidden coves, coral gardens, and untouched beaches inaccessible by road.',
    tag: 'Available daily',
    img: '/assets/dacf8509-3080-43eb-b543-ed979a7c0391.jpg',
  },
  {
    id: 5,
    title: 'Event & Celebration Catering',
    subtitle: 'GROUP EVENTS',
    desc: 'From beachside reunions to intimate celebrations, our team handles full event catering with fresh local seafood, native dishes, and customized spreads.',
    tag: 'Advance booking required',
    img: '/assets/84ab8a76-91b1-4992-954f-d99047bb6a8f.jpg',
  },
  {
    id: 6,
    title: 'Bring Your Own Tent / Camp',
    subtitle: 'CAMPSITE EXPERIENCE',
    desc: 'Pitch your tent under the stars and wake up to the sound of waves. Our open beachfront grounds welcome campers — just bring your gear and we take care of the rest.',
    tag: 'Open grounds available',
    img: '/assets/dacf8509-3080-43eb-b543-ed979a7c0391.jpg',
  },
  {
    id: 7,
    title: 'Jet Ski & Kayak Rentals',
    subtitle: 'WATER ACTIVITIES',
    desc: 'Race across the bay on a jet ski or glide through calm waters on a kayak. Casiguran Bay is your playground — our equipment rentals are available daily on request.',
    tag: 'Available on request',
    img: '/assets/a4c91579-d589-489d-9968-1606a80913c1.jpg',
  },
];

export const rooms: Room[] = [
  {
    title: 'Teepee Room',
    pax: '2–3 pax',
    price: '₱1,500',
    img: '/assets/8e38018f-0406-4a4d-8141-8a54f51e1bda.jpg',
    features: ['Porch Front', 'Shared Comfort Room', 'Shared Cooking Area', 'Electric Fan', 'Free Parking'],
  },
  {
    title: 'Family Villa (Small)',
    pax: '6–7 pax',
    price: '₱5,000',
    img: '/assets/2a91de7d-7842-4ce3-aee9-d24abddb9681.jpg',
    features: ['Own Comfort Room', 'Balcony View', 'Dining Area', 'Air-conditioned', 'Free Parking'],
  },
  {
    title: 'Family Villa (Medium)',
    pax: '8–9 pax',
    price: '₱6,000',
    img: '/assets/4b42ed90-bcd8-421a-95c7-4dff5f0fc807.jpg',
    features: ['Own Comfort Room', 'Balcony View', 'Shared Cooking Area', 'Air-conditioned', 'Free Parking'],
  },
  {
    title: 'Family Villa (Large)',
    pax: '10–12 pax',
    price: '₱7,000',
    img: '/assets/5bb331bc-8d34-4ad3-80be-5591b43ff4f4.jpg',
    features: ['Own Comfort Room', 'Balcony View', 'Dining Area', 'Air-conditioned', 'Free Parking'],
  },
];

export const reviews: Review[] = [
  { name: 'Cristina Reyes', rating: 5, text: 'Perfect weekend escape! The teepee cottage was such a unique experience, right on the sand. The staff were incredibly warm and welcoming.' },
  { name: 'Marco Bautista', rating: 5, text: 'Brought the whole family for a reunion. The large villa fit all 11 of us, the floating cottage lunch was absolutely unforgettable.' },
  { name: 'Arlene Santos', rating: 5, text: 'Casiguran is hidden gem territory. Golden 8 is that gem. Clean, beautiful, and so authentically Filipino. We will be back.' },
];

export const galleryItems: GalleryItem[] = [
  { common: 'Beach Stroll', photo: { url: '/assets/carosel/0ac705f2-eae2-4e3a-8cee-671d4ecd3289.jpg', text: 'A guest enjoying a peaceful morning walk along the golden sands.' } },
  { common: 'Resort Fun', photo: { url: '/assets/carosel/17cc0cfc-89ef-44d0-8ec4-0c0732f25096.jpg', text: 'Kids and families enjoying themed social events at the resort.' } },
  { common: 'Celebration', photo: { url: '/assets/carosel/206b909a-e2fc-4ae6-a7a3-da83df5ea961.jpg', text: 'Celebrating special milestones with balloons and fun entertainment.' } },
  { common: 'Group Photo', photo: { url: '/assets/carosel/364161d6-eea5-4295-a900-228b8a7b88e7.jpg', text: 'Guests coming together for a memorable group photo by the bay.' } },
  { common: 'Birthday Smiles', photo: { url: '/assets/carosel/4bec0757-9b05-4d39-954a-5a443fb74ef4.jpg', text: 'One of our younger guests celebrating her birthday in paradise.' } },
  { common: 'Coastal Views', photo: { url: '/assets/carosel/52a60014-00da-46c9-8a9e-0af4cb3a8e8c.jpg', text: 'The stunning coastline of Casiguran, Aurora, as seen from the resort.' } },
  { common: 'Kids Sandy Fun', photo: { url: '/assets/carosel/5d6ad537-04c8-4074-9a50-d588b1b9c34a.jpg', text: 'Little ones building memories (and sandcastles) at Golden 8.' } },
  { common: 'Banana Boat Thrills', photo: { url: '/assets/carosel/62cb6f6f-ebe3-4bfc-a196-1bfdfa7e6e46.jpg', text: 'A group of kids experiencing the excitement of our banana boat ride.' } },
  { common: 'Kayaking for Two', photo: { url: '/assets/carosel/72a86148-58aa-4b77-a436-18bca7c7e690.jpg', text: 'Exploring the calm waters of the bay in our rental kayaks.' } },
  { common: 'Magic Show Fun', photo: { url: '/assets/carosel/72d8b899-bca0-4b95-96eb-1073489b0f10.jpg', text: 'Interactive magic shows providing endless entertainment for our guests.' } },
  { common: 'Birthday Bubbles', photo: { url: '/assets/carosel/94fd148f-5d4f-4d2b-9359-adf9fdf2f35a.jpg', text: 'Laughter and bubbles during a festive birthday party at the resort.' } },
  { common: 'Memorable Events', photo: { url: '/assets/carosel/9cfcbca1-a910-4227-8452-c9bc4ac18a68.jpg', text: 'Our resort is the perfect venue for birthdays and social gatherings.' } },
  { common: 'Aurora Sunsets', photo: { url: '/assets/carosel/9ef3b794-6848-4f90-95d7-7cf94baa3b54.jpg', text: "Witnessing the breathtaking 'Aurora Glow' as the day comes to an end." } },
  { common: 'Banana Boat Fun', photo: { url: '/assets/carosel/aba07167-6523-4229-90ec-badfd0d37f36.jpg', text: 'High-speed water fun with friends on the Golden 8 banana boat.' } },
  { common: 'Sunset Serenity', photo: { url: '/assets/carosel/aca3c4e6-1e03-45db-93c2-df491068cfbb.jpg', text: 'Watching the sun dip below the mountains from the Golden 8 shore.' } },
  { common: 'Exploring the Bay', photo: { url: '/assets/carosel/b42a1a82-e600-44c5-b57b-18febe2d3323.jpg', text: 'Paddling across the serene waters for a closer look at the mountains.' } },
  { common: 'Group Outing', photo: { url: '/assets/carosel/b73d3cc4-2145-45e0-834b-341f56cd2c5e.jpg', text: 'A family and friends selfie during their water sports adventure.' } },
  { common: 'Glow of Golden 8', photo: { url: '/assets/carosel/c4735116-aec5-4edc-aae4-43150742d332.jpg', text: 'Capturing the magical transition from day to night at the resort.' } },
  { common: 'Resort Entertainment', photo: { url: '/assets/carosel/e0396716-9d48-47b5-8125-465f29a8f475.jpg', text: 'Our dedicated staff and entertainers making every guest feel special.' } },
  { common: 'Birthday Party', photo: { url: '/assets/carosel/e1beada5-baa7-4634-a09e-23ce26a0caac.jpg', text: 'A vibrant and joyful birthday celebration at our dedicated event area.' } },
  { common: 'Golden Aurora Sunset', photo: { url: '/assets/carosel/e917c70b-18ae-44cd-8c02-6d4270674067.jpg', text: 'One of the many reasons why guests keep coming back to Golden 8.' } },
  { common: 'Crystal Clear Waters', photo: { url: '/assets/carosel/ed03735a-450f-4cf9-a9ee-5cb87adfff68.jpg', text: 'Guests enjoying a refreshing dip in the clean and safe beach area.' } },
  { common: 'Water Sports', photo: { url: '/assets/carosel/fb197fa9-26fa-4f1e-ad69-69c3712772c6.jpg', text: 'Thrilling jet ski rides for the whole family to enjoy together.' } },
  { common: 'Birthday Celebrations', photo: { url: '/assets/carosel/ff567965-9d68-42c6-89b4-9968c4556cfb.jpg', text: 'Creating personalized and memorable experiences for guest birthdays.' } },
];
