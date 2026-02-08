document.addEventListener("DOMContentLoaded", () => {
  // 1. Mouse Glow Effect
  const glow = document.getElementById("cursor-glow");
  if (glow) {
    document.addEventListener("mousemove", (e) => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
      glow.style.opacity = "0.8";
    });
    
    document.addEventListener("mouseleave", () => {
      glow.style.opacity = "0";
    });
  }

  // 2. Scroll Reveal Animation
  const observerOptions = {
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, observerOptions);

  document.querySelectorAll(".reveal-content, .work-item").forEach((el) => {
    observer.observe(el);
  });

  // 3. Video Hover Effects (muted autoplay)
  const videoItems = document.querySelectorAll(".work-item");
  videoItems.forEach((item) => {
    const video = item.querySelector("video");
    if (!video) return;

    // Store original muted state
    video.dataset.originalMuted = video.muted;
    
    // Hover to play muted
    item.addEventListener("mouseenter", () => {
      if (!video.playing) {
        video.muted = true;
        video.play().catch(e => {
          // Auto-play was prevented
          console.log("Autoplay prevented on hover");
        });
      }
    });

    item.addEventListener("mouseleave", () => {
      if (!video.clicked) { // Only pause if not clicked
        video.pause();
        video.currentTime = 0;
      }
    });
  });

  // 4. Video Click Modal System
  const modal = document.getElementById("video-modal");
  const modalVideo = document.getElementById("modal-video");
  const videoTitle = document.getElementById("video-title");
  const videoCategory = document.getElementById("video-category");
  const closeModal = document.getElementById("close-modal");
  const closeModal2 = document.getElementById("close-modal-2");

  // Track all video containers
  const videoContainers = document.querySelectorAll(".video-container");
  
  videoContainers.forEach(container => {
    container.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const video = container.querySelector("video");
      const title = container.querySelector("h4")?.textContent || "Video Preview";
      const category = container.querySelector("span")?.textContent || "Video";
      
      if (video) {
        // Set modal content
        const source = video.querySelector("source");
        if (source) {
          modalVideo.src = source.src;
          modalVideo.load();
        } else {
          modalVideo.src = video.src;
          modalVideo.load();
        }
        
        // Set title and category
        videoTitle.textContent = title;
        videoCategory.textContent = category;
        
        // Mark video as clicked
        video.clicked = true;
        
        // Show modal
        modal.classList.remove("hidden");
        modal.classList.add("flex");
        document.body.style.overflow = "hidden";
        
        // Play video with sound
        setTimeout(() => {
          modalVideo.muted = false;
          modalVideo.volume = 0.5;
          modalVideo.play().catch(e => {
            console.log("Modal video play failed:", e);
          });
        }, 300);
      }
    });
  });

  // Close modal functions
  function closeVideoModal() {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.style.overflow = "auto";
    
    // Pause and reset modal video
    modalVideo.pause();
    modalVideo.currentTime = 0;
    modalVideo.src = "";
    
    // Reset all clicked states
    videoItems.forEach(item => {
      const video = item.querySelector("video");
      if (video) {
        video.clicked = false;
        video.pause();
        video.currentTime = 0;
      }
    });
  }

  if (closeModal) {
    closeModal.addEventListener("click", closeVideoModal);
  }
  
  if (closeModal2) {
    closeModal2.addEventListener("click", closeVideoModal);
  }

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeVideoModal();
    }
  });

  // Close modal when clicking outside
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeVideoModal();
    }
  });

  // 5. Filtering Logic
  const filterButtons = document.querySelectorAll(".filter-btn");
  const workItems = document.querySelectorAll(".work-item");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // Update button styles
      filterButtons.forEach((b) => b.classList.remove("active"));
      e.target.classList.add("active");

      const filterValue = e.target.getAttribute("data-filter");

      workItems.forEach((item) => {
        if (filterValue === "all" || item.getAttribute("data-category") === filterValue) {
          item.classList.remove("hidden");
          setTimeout(() => {
            item.classList.add("active");
          }, 10);
        } else {
          item.classList.remove("active");
          setTimeout(() => {
            item.classList.add("hidden");
          }, 10);
        }
      });
    });
  });

  // 6. Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      if (this.getAttribute("href") === "#") return;
      
      e.preventDefault();
      
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth"
        });
      }
    });
  });

  // 7. Navbar background on scroll
  const nav = document.querySelector("nav");
  
  if (nav) {
    window.addEventListener("scroll", () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 50) {
        nav.style.backgroundColor = "rgba(15, 15, 15, 0.95)";
        nav.style.backdropFilter = "blur(10px)";
        nav.style.borderBottom = "1px solid rgba(184, 184, 178, 0.1)";
      } else {
        nav.style.backgroundColor = "transparent";
        nav.style.backdropFilter = "none";
        nav.style.borderBottom = "none";
      }
    });
  }

  // 8. Set current year in footer
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 9. Add typing effect to hero text
  const heroText = document.querySelector(".reveal-content h1");
  if (heroText && window.innerWidth > 768) {
    const originalText = heroText.textContent;
    heroText.textContent = "";
    
    let i = 0;
    const typeWriter = () => {
      if (i < originalText.length) {
        heroText.textContent += originalText.charAt(i);
        i++;
        setTimeout(typeWriter, 30);
      }
    };
    
    // Start typing after page load
    window.addEventListener("load", () => {
      setTimeout(typeWriter, 500);
    });
  }

  // 10. Video error handling
  const videos = document.querySelectorAll("video");
  videos.forEach((video) => {
    video.addEventListener("error", (e) => {
      console.log("[Video Error] Failed to load:", video.querySelector("source")?.src || video.src);
    });
    
    video.addEventListener("loadeddata", () => {
      console.log("[Video Success] Loaded:", video.querySelector("source")?.src || video.src);
    });
  });

  // 11. Profile picture click effect
  const profilePics = document.querySelectorAll('#profile-pic, .profile-glow img');
  profilePics.forEach(pic => {
    pic.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Add a temporary glow enhancement
      const container = pic.closest('.profile-glow');
      if (container) {
        container.style.animation = 'glow-pulse 0.5s ease-in-out';
        setTimeout(() => {
          container.style.animation = 'glow-pulse 3s ease-in-out infinite';
        }, 500);
      }
    });
  });
});

// Preload profile image
window.addEventListener("load", () => {
  const img = new Image();
  img.src = "image.png";
  img.onload = () => {
    console.log("Profile image preloaded successfully");
  };
  img.onerror = () => {
    console.log("Profile image failed to preload");
  };
});