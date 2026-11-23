
// ==========================================
// GRANDVISTA LUXURY HOTEL
// MAIN JAVASCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

  // ========================================
  // 01. PAGE LOADER
  // ========================================

  const pageLoader = document.getElementById("pageLoader");

  window.addEventListener("load", () => {
    if (pageLoader) {
      setTimeout(() => {
        pageLoader.style.display = "none";
      }, 1600);
    }
  });


  // ========================================
  // 02. MOBILE HAMBURGER MENU
  // ========================================

  const menuToggle = document.getElementById("menuToggle");
  const navWrap = document.getElementById("navWrap");
  const navigationLinks = document.querySelectorAll(".navbar a");

  function closeMenu() {
    if (!menuToggle || !navWrap) return;

    menuToggle.classList.remove("active");
    navWrap.classList.remove("active");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  }

  if (menuToggle && navWrap) {

    menuToggle.addEventListener("click", () => {
      const isOpen = navWrap.classList.toggle("active");

      menuToggle.classList.toggle("active", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));

      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );
    });

    // Close menu after clicking a navigation link
    navigationLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close menu when clicking outside
    document.addEventListener("click", (event) => {
      const clickedInsideMenu =
        navWrap.contains(event.target) ||
        menuToggle.contains(event.target);

      if (!clickedInsideMenu) {
        closeMenu();
      }
    });

    // Close menu with Escape key
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    // Close mobile menu when returning to desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 800) {
        closeMenu();
      }
    });
  }


  // ========================================
  // 03. STICKY HEADER
  // ========================================

  const siteHeader = document.getElementById("siteHeader");

  function updateHeader() {
    if (!siteHeader) return;

    if (window.scrollY > 80) {
      siteHeader.classList.add("scrolled");
    } else {
      siteHeader.classList.remove("scrolled");
    }
  }

  updateHeader();

  window.addEventListener("scroll", updateHeader);


  // ========================================
  // 04. SCROLL REVEAL ANIMATIONS
  // ========================================

  const revealElements = document.querySelectorAll("[data-reveal]");

  if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }

        });

      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });

  } else {

    revealElements.forEach((element) => {
      element.classList.add("revealed");
    });

  }


  // ========================================
  // 05. BACK TO TOP BUTTON
  // ========================================

  const backToTop = document.getElementById("backToTop");

  function updateBackToTop() {
    if (!backToTop) return;

    if (window.scrollY > 450) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  }

  updateBackToTop();

  window.addEventListener("scroll", updateBackToTop);

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }


  // ========================================
  // 06. AUTOMATIC FOOTER YEAR
  // ========================================

  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }


  // ========================================
  // 07. IMAGE LOADING EFFECT
  // ========================================

  const images = document.querySelectorAll("img");

  images.forEach((image) => {

    image.addEventListener("load", () => {
      image.classList.add("image-loaded");
    });

    if (image.complete && image.naturalWidth > 0) {
      image.classList.add("image-loaded");
    }

  });


  // ========================================
  // 08. TOAST NOTIFICATION
  // ========================================

  const toast = document.getElementById("toast");
  let toastTimer;

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 4000);
  }


  // ========================================
  // 09. HOTEL BOOKING DATE VALIDATION
  // ========================================

  const bookingForm = document.getElementById("bookingForm");
  const checkInInput = document.getElementById("checkIn");
  const checkOutInput = document.getElementById("checkOut");
  const guestsInput = document.getElementById("guests");
  const bookingStatus = document.getElementById("bookingStatus");

  function getLocalDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function addDays(dateString, days) {
    const [year, month, day] = dateString.split("-").map(Number);

    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + days);

    return getLocalDateString(date);
  }

  // Set today's date as the earliest check-in date
  if (checkInInput && checkOutInput) {

    const today = getLocalDateString();

    checkInInput.min = today;
    checkOutInput.min = addDays(today, 1);

    checkInInput.addEventListener("change", () => {

      if (!checkInInput.value) return;

      const earliestCheckout = addDays(checkInInput.value, 1);

      checkOutInput.min = earliestCheckout;

      // Clear an earlier or equal checkout date
      if (
        checkOutInput.value &&
        checkOutInput.value < earliestCheckout
      ) {
        checkOutInput.value = "";
      }

      if (bookingStatus) {
        bookingStatus.textContent = "";
      }

    });

    checkOutInput.addEventListener("change", () => {

      if (bookingStatus) {
        bookingStatus.textContent = "";
      }

    });

  }


  // Handle booking enquiry form
  if (bookingForm) {

    bookingForm.addEventListener("submit", (event) => {

      event.preventDefault();

      if (
        !checkInInput ||
        !checkOutInput ||
        !guestsInput ||
        !bookingStatus
      ) {
        return;
      }

      const checkIn = checkInInput.value;
      const checkOut = checkOutInput.value;
      const guests = guestsInput.value;
      const today = getLocalDateString();

      // Check that dates have been entered
      if (!checkIn || !checkOut) {
        bookingStatus.textContent =
          "Please select both your check-in and check-out dates.";

        showToast("Please complete your travel dates.");
        return;
      }

      // Check the selected dates
      if (checkIn < today) {
        bookingStatus.textContent =
          "Your check-in date cannot be in the past.";

        showToast("Please select a valid check-in date.");
        return;
      }

      if (checkOut <= checkIn) {
        bookingStatus.textContent =
          "Check-out must be at least one day after check-in.";

        showToast("Please correct your check-out date.");
        return;
      }

      // Show the enquiry summary
      const formattedCheckIn = new Date(
        `${checkIn}T12:00:00`
      ).toLocaleDateString();

      const formattedCheckOut = new Date(
        `${checkOut}T12:00:00`
      ).toLocaleDateString();

      bookingStatus.textContent =
        `Your enquiry: ${formattedCheckIn} to ${formattedCheckOut}, ${guests} guest(s). Please contact the hotel to confirm availability.`;

      showToast(
        "Your booking enquiry details are ready."
      );

    });

  }


  // ========================================
  // 10. SMOOTH INTERNAL PAGE LINKS
  // ========================================

  const internalLinks = document.querySelectorAll(
    'a[href^="#"]'
  );

  internalLinks.forEach((link) => {

    link.addEventListener("click", (event) => {

      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }

    });

  });

});

// ==========================================
// GRANDVISTA - ROOMS COLLECTION FILTER
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

  const roomGrid = document.getElementById("roomCollectionGrid");

  // Only run on the rooms page
  if (!roomGrid) return;

  const filterButtons = document.querySelectorAll(".room-filter");
  const roomCards = roomGrid.querySelectorAll(".room-collection-card");

  const emptyState = document.getElementById("roomEmptyState");
  const resetButton = document.getElementById("resetRoomFilters");

  // Filter accommodation cards
  function filterRooms(category) {

    let visibleRooms = 0;

    roomCards.forEach((card) => {

      const roomCategory = card.dataset.roomCategory;

      const shouldShow =
        category === "all" || roomCategory === category;

      card.hidden = !shouldShow;

      if (shouldShow) {
        visibleRooms++;

        // Re-trigger the reveal animation when a card appears
        card.classList.remove("revealed");

        requestAnimationFrame(() => {
          card.classList.add("revealed");
        });
      }

    });

    // Display empty state if there are no matching rooms
    if (emptyState) {
      emptyState.hidden = visibleRooms !== 0;
    }

    // Update active filter button
    filterButtons.forEach((button) => {

      const isActive = button.dataset.roomFilter === category;

      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));

    });

  }

  // Handle category filter clicks
  filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

      const selectedCategory = button.dataset.roomFilter;

      filterRooms(selectedCategory);

    });

  });

  // Reset all filters
  if (resetButton) {

    resetButton.addEventListener("click", () => {

      filterRooms("all");

    });

  }

  // Show all accommodation by default
  filterRooms("all");

});

// ==========================================
// GRANDVISTA - DYNAMIC ROOM DETAILS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

  // Only run on the room details page
  const roomTitle = document.getElementById("roomDetailTitle");

  if (!roomTitle) return;

  // ========================================
  // 01. ROOM INFORMATION DATABASE
  // ========================================

  const roomsData = {

    "deluxe-room": {
      name: "Deluxe Room",
      collection: "Deluxe Collection",
      style: "Elegant Deluxe Room",
      category: "Standard Collection",
      design: "Comfort & Elegance",

      subtitle:
        "Comfort, elegance and a welcoming atmosphere come together in this thoughtfully presented accommodation concept.",

      description:
        "The Deluxe Room introduces a welcoming accommodation experience through thoughtful interior styling, carefully coordinated furnishings and a relaxing atmosphere.\n\nIts design places emphasis on comfort, functionality and the finer details that help make a guest room feel inviting and personal.",

      heroImage:
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1800&q=85",

      images: [
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1500&q=90",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1500&q=90",
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1500&q=90",
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1500&q=90"
      ],

      features: [
        {
          icon: "✦",
          title: "Elegant Interior",
          description: "A coordinated design approach with thoughtful furnishings and welcoming details."
        },
        {
          icon: "◇",
          title: "Comfortable Living",
          description: "A relaxing accommodation concept designed around comfort and convenience."
        },
        {
          icon: "✧",
          title: "Private Space",
          description: "An inviting personal environment for guests seeking a comfortable place to unwind."
        },
        {
          icon: "⌂",
          title: "Thoughtful Layout",
          description: "A considered room arrangement balancing practical use with attractive presentation."
        }
      ],

      amenities: [
        "Comfortable bedding concept",
        "Private bathroom concept",
        "Thoughtfully planned interiors",
        "Welcoming guest environment"
      ]
    },


    "executive-suite": {
      name: "Executive Suite",
      collection: "Executive Collection",
      style: "Spacious Executive Suite",
      category: "Suite Collection",
      design: "Space & Sophistication",

      subtitle:
        "Discover a spacious accommodation concept combining refined interiors, additional living space and a sophisticated atmosphere.",

      description:
        "The Executive Suite is imagined around generous proportions, a comfortable sleeping area and a distinct living environment.\n\nIts design direction combines elegant furnishings, practical room planning and a refined atmosphere for guests who appreciate additional space and privacy.",

      heroImage:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1800&q=85",

      images: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1500&q=90",
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1500&q=90",
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1500&q=90",
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1500&q=90"
      ],

      features: [
        {
          icon: "✦",
          title: "Generous Space",
          description: "A spacious accommodation concept with room for comfortable movement and relaxation."
        },
        {
          icon: "◇",
          title: "Living Area",
          description: "A separate lounge concept for relaxation and everyday convenience."
        },
        {
          icon: "✧",
          title: "Refined Interiors",
          description: "Coordinated materials and furnishings create an elegant visual experience."
        },
        {
          icon: "⌂",
          title: "Added Privacy",
          description: "A layout concept that gives guests a more private and comfortable environment."
        }
      ],

      amenities: [
        "Spacious room concept",
        "Separate living area concept",
        "Premium interior styling",
        "Comfortable bedroom arrangement"
      ]
    },


    "premium-suite": {
      name: "Premium Suite",
      collection: "Premium Collection",
      style: "Refined Premium Suite",
      category: "Signature Collection",
      design: "Refined Luxury",

      subtitle:
        "An expressive accommodation concept inspired by distinctive interiors, generous comfort and contemporary luxury.",

      description:
        "The Premium Suite brings together a sophisticated design direction, carefully selected visual details and a welcoming atmosphere.\n\nIts accommodation concept focuses on refined styling, comfortable proportions and a relaxing environment for guests who appreciate an elevated interior experience.",

      heroImage:
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1800&q=85",

      images: [
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1500&q=90",
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1500&q=90",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1500&q=90",
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1500&q=90"
      ],

      features: [
        {
          icon: "✦",
          title: "Signature Styling",
          description: "A distinctive interior direction inspired by elegant contemporary design."
        },
        {
          icon: "◇",
          title: "Premium Comfort",
          description: "An inviting room concept designed around rest and relaxation."
        },
        {
          icon: "✧",
          title: "Careful Details",
          description: "Thoughtful furnishings and coordinated finishes contribute to the atmosphere."
        },
        {
          icon: "⌂",
          title: "Private Retreat",
          description: "A welcoming personal space for guests who appreciate refined surroundings."
        }
      ],

      amenities: [
        "Premium interior concept",
        "Refined bedroom styling",
        "Comfortable seating concept",
        "Private accommodation environment"
      ]
    },


    "family-suite": {
      name: "Family Suite",
      collection: "Family Collection",
      style: "Spacious Family Suite",
      category: "Suite Collection",
      design: "Space for Togetherness",

      subtitle:
        "A welcoming accommodation concept inspired by shared comfort, generous space and enjoyable time together.",

      description:
        "The Family Suite is designed as an accommodation concept for guests travelling together who appreciate additional room and a welcoming atmosphere.\n\nIts layout emphasises shared living, practical arrangements and comfortable surroundings, creating a setting suited to family travel and group accommodation preferences.",

      heroImage:
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=85",

      images: [
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1500&q=90",
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1500&q=90",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1500&q=90",
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1500&q=90"
      ],

      features: [
        {
          icon: "✦",
          title: "Generous Layout",
          description: "A spacious arrangement imagined around the needs of guests travelling together."
        },
        {
          icon: "◇",
          title: "Shared Living",
          description: "A welcoming shared living concept for spending time together."
        },
        {
          icon: "✧",
          title: "Relaxing Interior",
          description: "Comfortable surroundings with coordinated decorative details."
        },
        {
          icon: "⌂",
          title: "Practical Design",
          description: "A considered layout with an emphasis on everyday convenience."
        }
      ],

      amenities: [
        "Family accommodation concept",
        "Generous shared space",
        "Comfortable sleeping arrangements",
        "Welcoming interior styling"
      ]
    },


    "presidential-suite": {
      name: "Presidential Suite",
      collection: "Signature Collection",
      style: "Grand Presidential Suite",
      category: "Signature Collection",
      design: "The Grand Collection",

      subtitle:
        "Discover a grand accommodation concept combining distinctive interiors, generous living spaces and timeless elegance.",

      description:
        "The Presidential Suite represents the most expressive accommodation concept in the GrandVista collection.\n\nIts design direction celebrates generous proportions, statement furnishings, considered living areas and a sophisticated residential atmosphere inspired by contemporary luxury.",

      heroImage:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85",

      images: [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1500&q=90",
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1500&q=90",
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1500&q=90",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1500&q=90"
      ],

      features: [
        {
          icon: "✦",
          title: "Grand Interior",
          description: "A distinctive accommodation concept with statement design details."
        },
        {
          icon: "◇",
          title: "Dedicated Lounge",
          description: "A generous lounge concept for relaxing and enjoying additional space."
        },
        {
          icon: "✧",
          title: "Sophisticated Design",
          description: "An elegant combination of visual details and carefully considered furnishings."
        },
        {
          icon: "⌂",
          title: "Generous Living",
          description: "A residential-inspired layout with an emphasis on space and privacy."
        }
      ],

      amenities: [
        "Grand interior concept",
        "Dedicated lounge concept",
        "Premium accommodation styling",
        "Spacious private environment"
      ]
    },


    "garden-view-room": {
      name: "Garden View Room",
      collection: "Tranquility Collection",
      style: "Garden-Inspired Deluxe Room",
      category: "Standard Collection",
      design: "A Quieter Kind of Luxury",

      subtitle:
        "A peaceful accommodation concept inspired by natural colours, relaxed interiors and the calming appeal of nature.",

      description:
        "The Garden View Room draws inspiration from the visual character of natural surroundings and the comfort of a quieter retreat.\n\nIts design concept combines softer colours, welcoming furnishings and a relaxed atmosphere for guests who appreciate a more peaceful accommodation style.",

      heroImage:
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1800&q=85",

      images: [
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1500&q=90",
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1500&q=90",
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1500&q=90",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1500&q=90"
      ],

      features: [
        {
          icon: "✦",
          title: "Nature-Inspired Styling",
          description: "A relaxed design direction influenced by natural colours and textures."
        },
        {
          icon: "◇",
          title: "Peaceful Atmosphere",
          description: "A welcoming environment imagined around rest and relaxation."
        },
        {
          icon: "✧",
          title: "Comfortable Interiors",
          description: "Coordinated furnishings and thoughtful details create a pleasant space."
        },
        {
          icon: "⌂",
          title: "Relaxed Layout",
          description: "An accommodation concept with a focus on simplicity and convenience."
        }
      ],

      amenities: [
        "Nature-inspired interior concept",
        "Comfortable bedroom arrangement",
        "Relaxed accommodation styling",
        "Private space concept"
      ]
    }

  };


  // ========================================
  // 02. READ THE ROOM FROM THE URL
  // ========================================

  const urlParameters = new URLSearchParams(window.location.search);

  const requestedRoom = urlParameters.get("room") || "deluxe-room";

  const room = roomsData[requestedRoom] || roomsData["deluxe-room"];

  const roomSlug = roomsData[requestedRoom] ? requestedRoom : "deluxe-room";


  // ========================================
  // 03. UPDATE PAGE TITLE AND DESCRIPTION
  // ========================================

  document.title = `${room.name} | GrandVista Luxury Hotel`;

  const metaDescription = document.querySelector(
    'meta[name="description"]'
  );

  if (metaDescription) {
    metaDescription.content =
      `${room.name} at GrandVista Luxury Hotel. Explore accommodation details, room features and enquiry information.`;
  }

  const roomSubtitle = document.getElementById("roomDetailSubtitle");

  if (roomSubtitle) {
    roomSubtitle.textContent = room.subtitle;
  }

  const roomDescription = document.getElementById("roomDetailDescription");

  if (roomDescription) {
    roomDescription.textContent = room.description;
  }


  // ========================================
  // 04. UPDATE ROOM HERO
  // ========================================

  const roomEyebrow = document.getElementById("roomDetailEyebrow");

  const roomHeroBackground = document.querySelector(
    ".room-detail-hero-background"
  );

  if (roomEyebrow) {
    roomEyebrow.textContent = room.collection.toUpperCase();
  }

  if (roomHeroBackground) {
    roomHeroBackground.style.backgroundImage =
      `url("${room.heroImage}")`;
  }


  // ========================================
  // 05. UPDATE ROOM INFORMATION
  // ========================================

  const informationFields = {
    roomInfoCollection: room.collection,
    roomInfoStyle: room.style,
    roomInfoDesign: room.design,
    roomInfoCategory: room.category
  };

  Object.entries(informationFields).forEach(([id, value]) => {

    const element = document.getElementById(id);

    if (element) {
      element.textContent = value;
    }

  });


  // ========================================
  // 06. UPDATE ACCOMMODATION ENQUIRY LINKS
  // ========================================

  const enquiryURL =
    `contact.html?room=${encodeURIComponent(roomSlug)}#contact-form`;

  const enquiryLinkIds = [
    "roomHeroEnquiry",
    "roomOverviewEnquiry",
    "roomInformationEnquiry",
    "roomFinalEnquiry"
  ];

  enquiryLinkIds.forEach((id) => {

    const link = document.getElementById(id);

    if (link) {
      link.href = enquiryURL;
    }

  });


  // ========================================
  // 07. UPDATE THE MAIN ROOM IMAGE
  // ========================================

  const mainImage = document.getElementById("roomMainImage");

  const thumbnailButtons = document.querySelectorAll(
    ".room-gallery-thumb"
  );

  if (mainImage) {

    mainImage.src = room.images[0];
    mainImage.alt = `${room.name} interior photograph`;
  }

  // Update all four thumbnails for the selected room
  thumbnailButtons.forEach((button, index) => {

    const thumbnailImage = button.querySelector("img");

    const imageURL = room.images[index];

    if (!imageURL || !thumbnailImage) return;

    button.dataset.image = imageURL;

    thumbnailImage.src = imageURL;

    thumbnailImage.alt =
      `${room.name} gallery photograph ${index + 1}`;

    button.classList.toggle("active", index === 0);

    button.setAttribute(
      "aria-pressed",
      String(index === 0)
    );

  });


  // ========================================
  // 08. ROOM GALLERY INTERACTION
  // ========================================

  thumbnailButtons.forEach((button) => {

    button.addEventListener("click", () => {

      const imageURL = button.dataset.image;

      if (!imageURL || !mainImage) return;

      mainImage.classList.add("changing");

      mainImage.src = imageURL;

      mainImage.onload = () => {
        mainImage.classList.remove("changing");
      };

      mainImage.alt = `${room.name} interior photograph`;

      thumbnailButtons.forEach((thumbnail) => {

        const isActive = thumbnail === button;

        thumbnail.classList.toggle("active", isActive);

        thumbnail.setAttribute(
          "aria-pressed",
          String(isActive)
        );

      });

    });

  });


  // ========================================
  // 09. BUILD ROOM FEATURE CARDS
  // ========================================

  const featuresContainer = document.getElementById(
    "roomDetailFeatures"
  );

  if (featuresContainer) {

    featuresContainer.replaceChildren();

    room.features.forEach((feature) => {

      const article = document.createElement("article");
      article.className = "room-detail-feature";

      const icon = document.createElement("span");
      icon.className = "room-feature-icon";
      icon.textContent = feature.icon;

      const heading = document.createElement("h3");
      heading.textContent = feature.title;

      const paragraph = document.createElement("p");
      paragraph.textContent = feature.description;

      article.append(icon, heading, paragraph);

      featuresContainer.appendChild(article);

    });

  }


  // ========================================
  // 10. BUILD ROOM AMENITIES LIST
  // ========================================

  const amenitiesContainer = document.getElementById(
    "roomDetailAmenities"
  );

  if (amenitiesContainer) {

    amenitiesContainer.replaceChildren();

    room.amenities.forEach((amenity) => {

      const item = document.createElement("div");
      item.className = "room-amenity-item";

      const icon = document.createElement("span");
      icon.textContent = "✦";

      const paragraph = document.createElement("p");
      paragraph.textContent = amenity;

      item.append(icon, paragraph);

      amenitiesContainer.appendChild(item);

    });

  }


  // ========================================
  // 11. FINISH PAGE SETUP
  // ========================================

  const backToTop = document.getElementById("backToTop");

  if (backToTop) {
    backToTop.setAttribute(
      "aria-label",
      `Back to top of ${room.name} details`
    );
  }

});

// ==========================================
// GRANDVISTA - RESTAURANT MENU FILTERS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

  const menuGrid = document.getElementById("menuHighlightsGrid");

  // Only run on the restaurant page
  if (!menuGrid) return;

  const filterButtons = document.querySelectorAll(".menu-filter");

  const menuCards = menuGrid.querySelectorAll(
    ".menu-highlight-card"
  );

  const emptyState = document.getElementById("menuEmptyState");

  const resetButton = document.getElementById("resetMenuFilters");


  // ========================================
  // FILTER MENU ITEMS
  // ========================================

  function filterMenu(category) {

    let visibleItems = 0;

    menuCards.forEach((card) => {

      const itemCategory = card.dataset.menuCategory;

      const shouldShow =
        category === "all" || itemCategory === category;

      card.hidden = !shouldShow;

      if (shouldShow) {
        visibleItems++;

        // Show the card with a subtle animation
        card.classList.remove("revealed");

        requestAnimationFrame(() => {
          card.classList.add("revealed");
        });
      }

    });


    // Display the empty state when necessary
    if (emptyState) {
      emptyState.hidden = visibleItems !== 0;
    }


    // Update the selected filter button
    filterButtons.forEach((button) => {

      const isActive =
        button.dataset.menuFilter === category;

      button.classList.toggle("active", isActive);

      button.setAttribute(
        "aria-pressed",
        String(isActive)
      );

    });

  }


  // ========================================
  // FILTER BUTTON EVENTS
  // ========================================

  filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

      const selectedCategory = button.dataset.menuFilter;

      filterMenu(selectedCategory);

    });

  });


  // ========================================
  // RESET MENU FILTERS
  // ========================================

  if (resetButton) {

    resetButton.addEventListener("click", () => {

      filterMenu("all");

    });

  }


  // ========================================
  // INITIAL MENU DISPLAY
  // ========================================

  filterMenu("all");

});

// ==========================================
// GRANDVISTA - CONTACT FORM VALIDATION
// WHATSAPP ENQUIRY INTEGRATION
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

  const contactForm = document.getElementById("contactForm");

  // Only run on the contact page
  if (!contactForm) return;


  // ========================================
  // 01. GET FORM ELEMENTS
  // ========================================

  const nameInput = document.getElementById("contactName");
  const emailInput = document.getElementById("contactEmail");
  const phoneInput = document.getElementById("contactPhone");
  const subjectInput = document.getElementById("contactSubject");

  const checkInInput = document.getElementById("contactCheckIn");
  const checkOutInput = document.getElementById("contactCheckOut");
  const guestsInput = document.getElementById("contactGuests");

  const messageInput = document.getElementById("contactMessage");
  const consentInput = document.getElementById("contactConsent");

  const submitButton = document.getElementById("contactSubmit");
  const statusMessage = document.getElementById("contactFormStatus");


  // ========================================
  // 02. GET ERROR ELEMENTS
  // ========================================

  const errors = {
    name: document.getElementById("nameError"),
    email: document.getElementById("emailError"),
    phone: document.getElementById("phoneError"),
    subject: document.getElementById("subjectError"),
    checkIn: document.getElementById("checkInError"),
    checkOut: document.getElementById("checkOutError"),
    message: document.getElementById("messageError"),
    consent: document.getElementById("consentError")
  };


  // ========================================
  // 03. HELPER FUNCTIONS
  // ========================================

  function showError(input, errorElement, message) {

    if (!input || !errorElement) return;

    errorElement.textContent = message;
    input.classList.add("invalid");
    input.setAttribute("aria-invalid", "true");

  }


  function clearError(input, errorElement) {

    if (!input || !errorElement) return;

    errorElement.textContent = "";
    input.classList.remove("invalid");
    input.setAttribute("aria-invalid", "false");

  }


  function clearAllErrors() {

    clearError(nameInput, errors.name);
    clearError(emailInput, errors.email);
    clearError(phoneInput, errors.phone);
    clearError(subjectInput, errors.subject);
    clearError(checkInInput, errors.checkIn);
    clearError(checkOutInput, errors.checkOut);
    clearError(messageInput, errors.message);
    clearError(consentInput, errors.consent);

  }


  function getToday() {

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

  }


  // ========================================
  // 04. DATE INPUT RESTRICTIONS
  // ========================================

  if (checkInInput && checkOutInput) {

    const today = getToday();

    checkInInput.min = today;
    checkOutInput.min = today;

    checkInInput.addEventListener("change", () => {

      const checkInDate = checkInInput.value;

      if (checkInDate) {

        // Checkout must be after check-in
        const date = new Date(`${checkInDate}T12:00:00`);

        date.setDate(date.getDate() + 1);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        const earliestCheckout = `${year}-${month}-${day}`;

        checkOutInput.min = earliestCheckout;

        if (
          checkOutInput.value &&
          checkOutInput.value < earliestCheckout
        ) {

          checkOutInput.value = "";

        }

      }

      clearError(checkInInput, errors.checkIn);
      clearError(checkOutInput, errors.checkOut);

    });

    checkOutInput.addEventListener("change", () => {

      clearError(checkOutInput, errors.checkOut);

    });

  }


  // ========================================
  // 05. FORM VALIDATION
  // ========================================

  function validateForm() {

    clearAllErrors();

    let isValid = true;
    let firstInvalidField = null;


    function markInvalid(input, errorElement, message) {

      showError(input, errorElement, message);

      isValid = false;

      if (!firstInvalidField) {
        firstInvalidField = input;
      }

    }


    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const subject = subjectInput.value;
    const message = messageInput.value.trim();

    const checkIn = checkInInput.value;
    const checkOut = checkOutInput.value;


    // NAME VALIDATION
    if (name.length < 2) {

      markInvalid(
        nameInput,
        errors.name,
        "Please enter your full name."
      );

    }


    // EMAIL VALIDATION
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

      markInvalid(
        emailInput,
        errors.email,
        "Please enter a valid email address."
      );

    }


    // OPTIONAL PHONE VALIDATION
    if (phone !== "") {

      const cleanPhone = phone.replace(/[\s()-]/g, "");
      const phoneDigits = cleanPhone.replace(/\D/g, "");

      if (
        !/^\+?\d+$/.test(cleanPhone) ||
        phoneDigits.length < 7 ||
        phoneDigits.length > 15
      ) {

        markInvalid(
          phoneInput,
          errors.phone,
          "Please enter a valid phone number."
        );

      }

    }


    // SUBJECT VALIDATION
    if (!subject) {

      markInvalid(
        subjectInput,
        errors.subject,
        "Please select an enquiry category."
      );

    }


    // OPTIONAL CHECK-IN AND CHECK-OUT VALIDATION
    if (checkIn && !checkOut) {

      markInvalid(
        checkOutInput,
        errors.checkOut,
        "Please select your check-out date."
      );

    }

    if (checkOut && !checkIn) {

      markInvalid(
        checkInInput,
        errors.checkIn,
        "Please select your check-in date."
      );

    }

    if (checkIn && checkIn < getToday()) {

      markInvalid(
        checkInInput,
        errors.checkIn,
        "Check-in cannot be in the past."
      );

    }

    if (checkIn && checkOut && checkOut <= checkIn) {

      markInvalid(
        checkOutInput,
        errors.checkOut,
        "Check-out must be after check-in."
      );

    }


    // MESSAGE VALIDATION
    if (message.length < 10) {

      markInvalid(
        messageInput,
        errors.message,
        "Please enter a message of at least 10 characters."
      );

    }


    // CONSENT VALIDATION
    if (!consentInput.checked) {

      markInvalid(
        consentInput,
        errors.consent,
        "Please confirm your information before continuing."
      );

    }


    // FOCUS ON THE FIRST INVALID FIELD
    if (firstInvalidField) {

      firstInvalidField.focus();

    }

    return isValid;

  }


  // ========================================
  // 06. CLEAR ERRORS WHILE EDITING
  // ========================================

  nameInput.addEventListener("input", () => {
    clearError(nameInput, errors.name);
  });

  emailInput.addEventListener("input", () => {
    clearError(emailInput, errors.email);
  });

  phoneInput.addEventListener("input", () => {
    clearError(phoneInput, errors.phone);
  });

  subjectInput.addEventListener("change", () => {
    clearError(subjectInput, errors.subject);
  });

  messageInput.addEventListener("input", () => {
    clearError(messageInput, errors.message);
  });

  consentInput.addEventListener("change", () => {
    clearError(consentInput, errors.consent);
  });


  // ========================================
  // 07. READ ROOM INFORMATION FROM URL
  // ========================================

  const urlParameters = new URLSearchParams(window.location.search);

  const roomSlug = urlParameters.get("room");

  const roomNames = {
    "deluxe-room": "Deluxe Room",
    "executive-suite": "Executive Suite",
    "premium-suite": "Premium Suite",
    "family-suite": "Family Suite",
    "presidential-suite": "Presidential Suite",
    "garden-view-room": "Garden View Room"
  };

  const selectedRoom = roomNames[roomSlug] || "";


  // ========================================
  // 08. HANDLE FORM SUBMISSION
  // ========================================

  contactForm.addEventListener("submit", (event) => {

    event.preventDefault();

    statusMessage.textContent = "";

    // Stop if validation fails
    if (!validateForm()) {

      statusMessage.textContent =
        "Please correct the highlighted fields before continuing.";

      return;

    }


    // ======================================
    // COLLECT CUSTOMER INFORMATION
    // ======================================

    const customerName = nameInput.value.trim();
    const customerEmail = emailInput.value.trim();
    const customerPhone = phoneInput.value.trim();

    const enquirySubject = subjectInput.value;

    const checkIn = checkInInput.value || "Not specified";
    const checkOut = checkOutInput.value || "Not specified";

    const guestNumber = guestsInput.value || "Not specified";

    const customerMessage = messageInput.value.trim();


    // ======================================
    // BUILD WHATSAPP MESSAGE
    // ======================================

    const whatsappMessage = `
GRANDVISTA LUXURY HOTEL
CUSTOMER ENQUIRY

--------------------------------

CUSTOMER DETAILS

Name: ${customerName}

Email: ${customerEmail}

Phone: ${customerPhone || "Not provided"}

--------------------------------

ENQUIRY INFORMATION

Subject: ${enquirySubject}

${selectedRoom ? `Preferred Room: ${selectedRoom}` : ""}

Check-In: ${checkIn}

Check-Out: ${checkOut}

Number of Guests: ${guestNumber}

--------------------------------

CUSTOMER MESSAGE

${customerMessage}

--------------------------------

Please provide further information about this enquiry.

Thank you.
    `.trim();


    // ======================================
    // BUILD WHATSAPP DESTINATION
    // ======================================

    const hotelWhatsAppNumber = "2349133819307";

    const whatsappURL =
      `https://wa.me/${hotelWhatsAppNumber}?text=` +
      encodeURIComponent(whatsappMessage);


    // ======================================
    // OPEN WHATSAPP
    // ======================================

    statusMessage.textContent =
      "Your enquiry is ready. WhatsApp will open so you can review the message and press Send.";

    submitButton.disabled = true;

    submitButton.querySelector("span:first-child").textContent =
      "Opening WhatsApp...";

    window.open(whatsappURL, "_blank");


    // Restore the button shortly afterwards
    setTimeout(() => {

      submitButton.disabled = false;

      submitButton.querySelector("span:first-child").textContent =
        "Prepare My Enquiry";

    }, 2000);

  });


});
