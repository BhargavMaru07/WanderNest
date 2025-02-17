// Timeline for navbar and heading animations
let t1 = gsap.timeline();

t1.from(".navbar-brand, .nav-item, .d-flex", {
  y: -30,
  duration: 0.5,
  delay: 0.4,
  opacity: 0,
  stagger: 0.1,
});

t1.from(
  ".all-listings-heading",
  {
    x: -200,
    duration: 0.5,
    delay: 0.2,
    opacity: 0,
  },
  "-=1"
);

let cards = gsap.utils.toArray(".card");

function createRows() {
  let rows = [];
  let cardsPerRow = 4; // Default to 4 cards per row for large screens

  // Determine how many cards should be in each row based on screen size
  if (window.innerWidth < 768) {
    cardsPerRow = 1; // 1 card per row for small screens
  } else if (window.innerWidth < 992) {
    cardsPerRow = 2; // 2 cards per row for medium screens
  } else if (window.innerWidth < 1200) {
    cardsPerRow = 3; // 3 cards per row for large screens
  }

  // Group the cards into rows based on the calculated cards per row
  for (let i = 0; i < cards.length; i += cardsPerRow) {
    rows.push(cards.slice(i, i + cardsPerRow));
  }
  return rows;
}

function animateRow(row, timeline, delay = 0) {
  const numCards = row.length;

  if (numCards === 4) {
    timeline.from(row[0], { x: -200, opacity: 0, duration: 0.8 }, delay); // 1st card from left
    timeline.from(row[1], { y: 200, opacity: 0, duration: 0.8 }, delay); // 2nd card from bottom
    timeline.from(row[2], { y: 200, opacity: 0, duration: 0.8 }, delay); // 3rd card from right
    timeline.from(row[3], { x: 200, opacity: 0, duration: 0.8 }, delay); // 4th card from top
  } else if (numCards === 3) {
    timeline.from(row[0], { x: -200, opacity: 0, duration: 0.8 }, delay); // 1st card from left
    timeline.from(row[1], { y: 200, opacity: 0, duration: 0.8 }, delay); // 2nd card from bottom
    timeline.from(row[2], { x: 200, opacity: 0, duration: 0.8 }, delay); // 3rd card from right
  } else if (numCards === 2) {
    timeline.from(row[0], { x: -200, opacity: 0, duration: 0.8 }, delay); // 1st card from left
    timeline.from(row[1], { x: 200, opacity: 0, duration: 0.8 }, delay); // 2nd card from right
  } else {
    timeline.from(row[0], { y: 200, opacity: 0, duration: 0.8 }, delay); // Card from bottom
  }
}

// Create rows based on screen size (at page load)
let rows = createRows();

rows.slice(0, 2).forEach((row, index) => {
  animateRow(row, t1, index === 0 ? 0.5 : index * 0.7); // Slight delay between rows
});

rows.slice(2).forEach((row) => {
  let scrollTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: row[0], // Use the first card in the row as the trigger
      start: "top 80%",
      end: "top 50%",
      scroller: "body",
      scrub: 1.5,
      // markers: true, // Optional for debugging
    },
  });
  animateRow(row, scrollTimeline);
});

// Recalculate rows when the window is resized (to handle responsiveness)

window.addEventListener("resize", () => {
  rows = createRows();

  // Clear any existing animations and reapply them based on the new row setup

  t1.kill();

  t1 = gsap.timeline();

  rows.slice(0, 2).forEach((row, index) => {
    animateRow(row, t1, index === 0 ? 0.5 : index * 0.7); // Slight delay between rows
  });

  rows.slice(2).forEach((row) => {
    let scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: row[0], // Use the first card in the row as the trigger
        start: "top 80%",
        end: "top 50%",
        scroller: "body",
        scrub: 1.5,
        // markers: true, // Optional for debugging
      },
    });
    animateRow(row, scrollTimeline);
  });
});


//perticular card 

gsap.from(".information-heading",{
    opacity : 0,
    x : -300,
    duration:1,
    delay:0.3
});


//new  & edit listings page 

gsap.from(".new-listings-heading,.edit-listings-heading", {
  opacity: 0,
  x: -300,
  duration: 1,
  delay: 0.3,
});


gsap.from(".title,.description,.image,.price-country,.location,.btn", {
  opacity: 0,
  y: -100,
  duration: 0.4,
  delay: 0.3,
  stagger: 0.2,
});

