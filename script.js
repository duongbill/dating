// Main Application Script

// Progress Indicator System
const progressManager = {
  currentStep: 1,
  totalSteps: 5,

  updateProgress(step) {
    this.currentStep = step;
    const progressFill = document.getElementById("progress-fill");
    const steps = document.querySelectorAll(".step");

    // Update progress bar
    const percentage = (step / this.totalSteps) * 100;
    if (progressFill) {
      progressFill.style.width = `${percentage}%`;
    }

    // Update step indicators
    steps.forEach((stepEl, index) => {
      const stepNumber = index + 1;
      stepEl.classList.remove("active", "completed");

      if (stepNumber < step) {
        stepEl.classList.add("completed");
      } else if (stepNumber === step) {
        stepEl.classList.add("active");
      }
    });

    // Add haptic feedback on mobile
    if ("vibrate" in navigator) {
      navigator.vibrate(50);
    }
  },

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.updateProgress(this.currentStep + 1);
    }
  },

  prevStep() {
    if (this.currentStep > 1) {
      this.updateProgress(this.currentStep - 1);
    }
  },

  hide() {
    const container = document.getElementById("progress-container");
    if (container) {
      container.style.transform = "translateY(-100%)";
      container.style.opacity = "0";
      // Adjust body padding
      document.body.style.paddingTop = "20px";
    }
  },

  show() {
    const container = document.getElementById("progress-container");
    if (container) {
      container.style.transform = "translateY(0)";
      container.style.opacity = "1";
      // Restore body padding
      if (window.innerWidth <= 480) {
        document.body.style.paddingTop = "80px";
      } else if (window.innerWidth <= 768) {
        document.body.style.paddingTop = "90px";
      } else {
        document.body.style.paddingTop = "100px";
      }
    }
  },
};

// Enhanced Toast Notification System
const toastManager = {
  container: null,
  toasts: [],

  init() {
    this.container = document.getElementById("toast-container");
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.id = "toast-container";
      this.container.className = "toast-container";
      document.body.appendChild(this.container);
    }
  },

  show(message, type = "info", title = "", duration = 4000) {
    const toast = this.createToast(message, type, title, duration);
    this.container.appendChild(toast);
    this.toasts.push(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add("show"), 100);

    // Auto remove
    setTimeout(() => this.remove(toast), duration);

    return toast;
  },

  createToast(message, type, title, duration) {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    const icons = {
      success: "✅",
      error: "❌",
      warning: "⚠️",
      info: "ℹ️",
    };

    const titles = {
      success: title || "Thành công!",
      error: title || "Có lỗi xảy ra!",
      warning: title || "Cảnh báo!",
      info: title || "Thông tin",
    };

    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || icons.info}</div>
      <div class="toast-content">
        <div class="toast-title">${titles[type]}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" onclick="toastManager.remove(this.parentElement)">×</button>
      <div class="toast-progress"></div>
    `;

    // Progress bar animation
    const progressBar = toast.querySelector(".toast-progress");
    let width = 100;
    const interval = setInterval(() => {
      width -= 100 / (duration / 100);
      progressBar.style.width = `${Math.max(0, width)}%`;
      if (width <= 0) clearInterval(interval);
    }, 100);

    return toast;
  },

  remove(toast) {
    if (toast && toast.parentElement) {
      toast.classList.remove("show");
      setTimeout(() => {
        if (toast.parentElement) {
          toast.parentElement.removeChild(toast);
          this.toasts = this.toasts.filter((t) => t !== toast);
        }
      }, 400);
    }
  },

  success(message, title) {
    hapticManager.light();
    return this.show(message, "success", title);
  },

  error(message, title) {
    hapticManager.error();
    return this.show(message, "error", title);
  },

  warning(message, title) {
    hapticManager.medium();
    return this.show(message, "warning", title);
  },

  info(message, title) {
    hapticManager.light();
    return this.show(message, "info", title);
  },
};

// Enhanced Confetti Animation System
const confettiManager = {
  colors: ["#ff6b95", "#7600ff", "#ff8bb3", "#9d4edd", "#ffd23f", "#06ffa5"],

  createConfetti(count = 100) {
    const container = document.createElement("div");
    container.className = "confetti-container";
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `;
    document.body.appendChild(container);

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        this.createSingleConfetti(container);
      }, i * 20);
    }

    // Remove container after animation
    setTimeout(() => {
      container.remove();
    }, 5000);
  },

  createSingleConfetti(container) {
    const confetti = document.createElement("div");
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    const size = Math.random() * 8 + 4;
    const startX = Math.random() * window.innerWidth;
    const endX = startX + (Math.random() - 0.5) * 200;
    const duration = Math.random() * 3 + 2;
    const rotation = Math.random() * 360;
    const rotationSpeed = Math.random() * 360 + 180;

    confetti.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      top: -10px;
      left: ${startX}px;
      border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
      transform: rotate(${rotation}deg);
      animation: confettiFall ${duration}s linear forwards;
    `;

    // Add CSS animation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes confettiFall {
        to {
          transform: translateY(${window.innerHeight + 20}px) translateX(${
      endX - startX
    }px) rotate(${rotation + rotationSpeed}deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    container.appendChild(confetti);

    // Clean up
    setTimeout(() => {
      confetti.remove();
      style.remove();
    }, duration * 1000);
  },

  celebrate() {
    // Create multiple bursts
    this.createConfetti(50);
    setTimeout(() => this.createConfetti(30), 500);
    setTimeout(() => this.createConfetti(20), 1000);
  },
};

// Enhanced Loading State Manager
const loadingManager = {
  show(element, text = "Đang tải...") {
    if (!element) return;

    element.classList.add("loading");
    element.setAttribute("data-original-text", element.textContent);
    element.innerHTML = `${text} <div class="loading-spinner"></div>`;
    element.disabled = true;
  },

  hide(element) {
    if (!element) return;

    element.classList.remove("loading");
    const originalText = element.getAttribute("data-original-text");
    if (originalText) {
      element.textContent = originalText;
      element.removeAttribute("data-original-text");
    }
    element.disabled = false;
  },

  showSkeleton(container) {
    if (!container) return;

    container.innerHTML = `
      <div class="loading-skeleton skeleton-title"></div>
      <div class="loading-skeleton skeleton-text"></div>
      <div class="loading-skeleton skeleton-text" style="width: 80%;"></div>
      <div class="loading-skeleton skeleton-button"></div>
    `;
  },
};

// Enhanced Transition Manager
const transitionManager = {
  slideOut(element, direction = "down") {
    return new Promise((resolve) => {
      element.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
      element.style.transform =
        direction === "down"
          ? "translateY(100px) scale(0.9)"
          : "translateY(-100px) scale(0.9)";
      element.style.opacity = "0";

      setTimeout(() => {
        element.style.display = "none";
        resolve();
      }, 600);
    });
  },

  slideIn(element, direction = "up") {
    return new Promise((resolve) => {
      element.style.display = "block";
      element.style.transform =
        direction === "up"
          ? "translateY(100px) scale(0.9)"
          : "translateY(-100px) scale(0.9)";
      element.style.opacity = "0";
      element.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";

      setTimeout(() => {
        element.style.transform = "translateY(0) scale(1)";
        element.style.opacity = "1";
        resolve();
      }, 50);
    });
  },
};

// Haptic Feedback Manager
const hapticManager = {
  vibrate(pattern) {
    if ("vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  },

  light() {
    this.vibrate(50);
  },

  medium() {
    this.vibrate(100);
  },

  heavy() {
    this.vibrate([100, 50, 100]);
  },

  success() {
    this.vibrate([50, 50, 50, 50, 100]);
  },

  error() {
    this.vibrate([200, 100, 200]);
  },
};

document.addEventListener("DOMContentLoaded", function () {
  // Initialize systems
  toastManager.init();
  progressManager.updateProgress(1);

  // Welcome toast
  setTimeout(() => {
    toastManager.info("Chào mừng bạn đến với trang web! 💕", "Xin chào!");
    hapticManager.light();
  }, 1000);

  // Handle window resize for progress indicator
  window.addEventListener("resize", () => {
    progressManager.show(); // Recalculate padding
  });

  // Main UI elements with null checks
  const yesBtn = document.getElementById("yes-btn");
  const noBtn = document.getElementById("no-btn");
  const mainCard = document.getElementById("main-card");
  const successCard = document.getElementById("success-card");
  const heartsContainer = document.getElementById("hearts-container");
  const celebration = document.getElementById("celebration");
  const cherryBlossoms = document.getElementById("cherry-blossoms");
  const nervousCat = document.querySelector(".nervous-cat");
  const floatingHeartsContainer = document.getElementById(
    "floating-hearts-container"
  );
  const perpetualHearts = document.getElementById("perpetual-hearts");
  const darkmodeToggle = document.getElementById("darkmode-toggle");

  // Check if essential elements exist
  if (!yesBtn || !noBtn || !mainCard || !successCard) {
    console.error("Essential elements not found!");
    return;
  }

  // Arrow pointers
  const yesArrow = document.getElementById("yes-arrow");
  const successArrow = document.getElementById("success-arrow");

  // Location selection elements
  const chooseLocationBtn = document.getElementById("choose-location-btn");
  const locationCard = document.getElementById("location-card");
  const locationButtons = document.querySelectorAll(".location-btn");
  const selectedLocationMessage = document.getElementById(
    "selected-location-message"
  );
  const locationCelebration = document.getElementById("location-celebration");
  const confirmLocationBtn = document.getElementById("confirm-location-btn");
  const locationDetailContainer = document.getElementById(
    "location-detail-container"
  );
  const locationDetailInput = document.getElementById("location-detail-input");
  const selectedInfo = document.getElementById("selected-info");
  const selectedType = selectedInfo?.querySelector(".selected-type");
  const selectedDetail = selectedInfo?.querySelector(".selected-detail");
  const locationOptions = document.querySelector(".location-options");

  // Date & time selection elements
  const datetimeCard = document.getElementById("datetime-card");
  const confirmDatetimeBtn = document.getElementById("confirm-datetime");
  const addDatetimeBtn = document.getElementById("add-datetime");
  const datetimeRowTemplate = document.getElementById("datetime-row-template");
  const datetimeContainer = document.querySelector(".datetime-container");
  const selectedDatetimeMessage = document.getElementById(
    "selected-datetime-message"
  );

  // Food selection elements
  const foodNextBtn = document.getElementById("food-next-btn");
  const foodCard = document.getElementById("food-card");
  const foodButtons = document.querySelectorAll(".food-btn");
  const selectedFoodMessage = document.getElementById("selected-food-message");
  const foodCelebration = document.getElementById("food-celebration");
  const confirmFoodBtn = document.getElementById("confirm-food-btn");
  const customFoodContainer = document.getElementById("custom-food-container");
  const customFoodInput = document.getElementById("custom-food-input");
  const addCustomFoodBtn = document.getElementById("add-custom-food");
  const finalMessage = document.getElementById("final-message");
  const finalMessageElement = document.getElementById("final-message");
  const drinksNextBtn = document.getElementById("drinks-next-btn");

  // Drinks selection elements
  const drinksCard = document.getElementById("drinks-card");
  const drinkButtons = document.querySelectorAll(".drink-btn");
  const selectedDrinkMessage = document.getElementById(
    "selected-drink-message"
  );
  const drinksCelebration = document.getElementById("drinks-celebration");
  const confirmDrinkBtn = document.getElementById("confirm-drink-btn");
  const finalDrinkMessage = document.getElementById("final-drink-message");

  // Completion page elements
  const completionCard = document.getElementById("completion-card");
  const completionNextBtn = document.getElementById("completion-next-btn");
  const completionHearts = document.getElementById("completion-hearts");

  // State management
  const state = {
    selectedLocations: [],
    selectedLocationDetails: {}, // Store location details like {cafe: "Highlands Coffee", travel: "Lào Cai"}
    selectedFoods: [],
    selectedDrinks: [],
    userInfo: null,
    dateOptions: [],
    darkMode: localStorage.getItem("darkMode") || null,
    currentSelectedLocation: null, // Track currently selected location for detail input
  };

  // Telegram Bot Configuration
  const TELEGRAM_CONFIG = {
    BOT_TOKEN: "8188463035:AAEQtz13139Qsnmb_Gzgb18NU5m2u9VibOM", // Token bot của bạn
    CHAT_ID: "1898063540", // Chat ID của bạn
    API_URL: "https://api.telegram.org/bot",
  };

  // User tracking utilities
  const userTracker = {
    // Generate or get existing user ID
    getUserId() {
      let userId = localStorage.getItem("user_id");
      if (!userId) {
        userId =
          "user_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
        localStorage.setItem("user_id", userId);
      }
      return userId;
    },

    // Get user's IP address
    async getUserIP() {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        return data.ip;
      } catch (error) {
        console.error("Error getting IP:", error);
        return "Unknown";
      }
    },

    // Get user agent info
    getUserAgent() {
      return navigator.userAgent;
    },

    // Get device info
    getDeviceInfo() {
      const ua = navigator.userAgent;
      let device = "Unknown";
      let browser = "Unknown";
      let os = "Unknown";

      // Detect device type
      if (/Mobile|Android|iPhone|iPad/.test(ua)) {
        device = "Mobile";
      } else if (/Tablet|iPad/.test(ua)) {
        device = "Tablet";
      } else {
        device = "Desktop";
      }

      // Detect browser
      if (ua.includes("Chrome")) browser = "Chrome";
      else if (ua.includes("Firefox")) browser = "Firefox";
      else if (ua.includes("Safari")) browser = "Safari";
      else if (ua.includes("Edge")) browser = "Edge";

      // Detect OS
      if (ua.includes("Windows")) os = "Windows";
      else if (ua.includes("Mac")) os = "macOS";
      else if (ua.includes("Linux")) os = "Linux";
      else if (ua.includes("Android")) os = "Android";
      else if (ua.includes("iOS")) os = "iOS";

      return { device, browser, os };
    },

    // Get session info
    getSessionInfo() {
      const sessionStart = sessionStorage.getItem("session_start");
      if (!sessionStart) {
        sessionStorage.setItem("session_start", Date.now().toString());
        return { isNewSession: true, sessionStart: Date.now() };
      }
      return { isNewSession: false, sessionStart: parseInt(sessionStart) };
    },

    // Track user interactions
    trackInteraction(action, details = {}) {
      const interactions = JSON.parse(
        localStorage.getItem("user_interactions") || "[]"
      );
      const interaction = {
        action,
        details,
        timestamp: Date.now(),
        url: window.location.href,
      };
      interactions.push(interaction);

      // Keep only last 50 interactions to avoid storage bloat
      if (interactions.length > 50) {
        interactions.splice(0, interactions.length - 50);
      }

      localStorage.setItem("user_interactions", JSON.stringify(interactions));
    },

    // Get user interactions summary
    getInteractionsSummary() {
      const interactions = JSON.parse(
        localStorage.getItem("user_interactions") || "[]"
      );
      const summary = {};
      interactions.forEach((interaction) => {
        summary[interaction.action] = (summary[interaction.action] || 0) + 1;
      });
      return summary;
    },
  };

  // Telegram Bot Functions
  const telegramBot = {
    async sendMessage(message) {
      try {
        const url = `${TELEGRAM_CONFIG.API_URL}${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`;

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: TELEGRAM_CONFIG.CHAT_ID,
            text: message,
            parse_mode: "HTML",
          }),
        });

        const result = await response.json();

        if (result.ok) {
          console.log("Message sent successfully to Telegram");
          return true;
        } else {
          console.error("Telegram API Error:", result);
          return false;
        }
      } catch (error) {
        console.error("Error sending message to Telegram:", error);
        return false;
      }
    },

    async formatFormData() {
      const locationNames = {
        cafe: "☕ Café",
        restaurant: "🍽️ Đi ănnn",
        cinema: "🎬 Rạp phim",
        park: "🌳 Công viên",
        mall: "🛍️ Trung tâm thương mại",
        street: "🏍️ Lên phố",
        hotel: "🏨 Khách sạn",
        travel: "🌍 Du lịch",

        karaoke: "🎤 Karaoke",
        home: "🏠 Ở nhà(mình)",
        custom: "✨ Nơi khác",
      };

      // Get tracking information
      const userIP = await userTracker.getUserIP();
      const deviceInfo = userTracker.getDeviceInfo();
      const sessionInfo = userTracker.getSessionInfo();
      const userId = userTracker.getUserId();
      const userAgent = userTracker.getUserAgent();
      const currentTime = new Date().toLocaleString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      let message = `🌸 <b>THÔNG TIN HẸN HÒ MỚI</b> 🌸\n\n`;

      // Get user interactions summary
      const interactionsSummary = userTracker.getInteractionsSummary();
      const lastSessionDuration = localStorage.getItem("last_session_duration");

      // Add tracking information at the top
      message += `🔍 <b>THÔNG TIN TRACKING:</b>\n`;
      message += `• User ID: <code>${userId}</code>\n`;
      message += `• IP Address: <code>${userIP}</code>\n`;
      message += `• Device: ${deviceInfo.device} | ${deviceInfo.browser} | ${deviceInfo.os}\n`;
      message += `• Session: ${sessionInfo.isNewSession ? "Mới" : "Cũ"}\n`;
      message += `• Thời gian: ${currentTime}\n`;

      // Add interaction summary
      if (Object.keys(interactionsSummary).length > 0) {
        message += `• Tương tác: `;
        const interactions = Object.entries(interactionsSummary)
          .map(([action, count]) => `${action}(${count})`)
          .join(", ");
        message += `${interactions}\n`;
      }

      if (lastSessionDuration) {
        const duration = Math.round(parseInt(lastSessionDuration) / 1000);
        message += `• Thời gian session trước: ${duration}s\n`;
      }

      message += `• User Agent: <code>${userAgent.substring(
        0,
        100
      )}...</code>\n\n`;

      // Thông tin cá nhân
      if (state.userInfo && state.userInfo.name) {
        message += `👤 <b>THÔNG TIN CÁ NHÂN:</b>\n`;
        message += `• Tên: ${state.userInfo.name}\n`;

        if (state.userInfo.phone) {
          message += `• Số điện thoại: ${state.userInfo.phone}\n`;
        }

        if (state.userInfo.email) {
          message += `• Email: ${state.userInfo.email}\n`;
        }

        if (state.userInfo.address) {
          message += `• Địa chỉ đón: ${state.userInfo.address}\n`;
        }

        if (state.userInfo.note) {
          message += `• Ghi chú: ${state.userInfo.note}\n`;
        }

        message += `\n`;
      }

      // Địa điểm
      if (state.selectedLocations.length > 0) {
        message += `📍 <b>ĐỊA ĐIỂM MUỐN ĐI:</b>\n`;
        state.selectedLocations.forEach((location) => {
          message += `• ${locationNames[location] || location}\n`;

          // Add specific location detail if available
          if (
            state.selectedLocationDetails &&
            state.selectedLocationDetails[location]
          ) {
            message += `  🏷️ <i>Địa điểm cụ thể: ${state.selectedLocationDetails[location]}</i>\n`;
          }
        });
        message += `\n`;
      }

      // Đồ ăn
      if (state.selectedFoods.length > 0) {
        message += `🍽️ <b>ĐỒ ĂN YÊU THÍCH:</b>\n`;
        state.selectedFoods.forEach((food) => {
          if (food.startsWith("custom:")) {
            message += `• ${food.replace("custom:", "")}\n`;
          } else {
            const foodNames = {
              pizza: "🍕 Pizza",
              sushi: "🍣 Sushi",
              burger: "🍔 Burger",
              pasta: "🍝 Pasta",
              pho: "🍜 Phở",
              "banh-mi": "🥖 Bánh mì",
              "com-tam": "🍚 Cơm tấm",
              "bun-bo": "🍲 Bún bò",
            };
            message += `• ${foodNames[food] || food}\n`;
          }
        });
        message += `\n`;
      }

      // Đồ uống
      if (state.selectedDrinks.length > 0) {
        message += `🥤 <b>ĐỒ UỐNG YÊU THÍCH:</b>\n`;
        state.selectedDrinks.forEach((drink) => {
          if (drink.startsWith("custom:")) {
            message += `• ${drink.replace("custom:", "")}\n`;
          } else {
            const drinkNames = {
              coffee: "☕ Cà phê",
              tea: "🍵 Trà",
              juice: "🧃 Nước ép",
              smoothie: "🥤 Sinh tố",
              beer: "🍺 Bia",
              wine: "🍷 Rượu vang",
              cocktail: "🍸 Cocktail",
              "soft-drink": "🥤 Nước ngọt",
            };
            message += `• ${drinkNames[drink] || drink}\n`;
          }
        });
        message += `\n`;
      }

      // Thời gian
      if (state.dateOptions.length > 0) {
        message += `📅 <b>THỜI GIAN CÓ THỂ HẸN:</b>\n`;
        state.dateOptions.forEach((option, index) => {
          message += `• Lựa chọn ${index + 1}: ${option.date} lúc ${
            option.time
          }\n`;
        });
        message += `\n`;
      }

      message += `⏰ <b>Thời gian gửi:</b> ${new Date().toLocaleString(
        "vi-VN"
      )}\n`;
      message += `🌐 <b>Từ website:</b> ${window.location.href}`;

      return message;
    },

    // Send visitor tracking info
    async sendVisitorInfo() {
      try {
        const userIP = await userTracker.getUserIP();
        const deviceInfo = userTracker.getDeviceInfo();
        const sessionInfo = userTracker.getSessionInfo();
        const userId = userTracker.getUserId();
        const userAgent = userTracker.getUserAgent();
        const currentTime = new Date().toLocaleString("vi-VN", {
          timeZone: "Asia/Ho_Chi_Minh",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        const message =
          `🔍 <b>VISITOR TRACKING</b> 🔍\n\n` +
          `• User ID: <code>${userId}</code>\n` +
          `• IP Address: <code>${userIP}</code>\n` +
          `• Device: ${deviceInfo.device}\n` +
          `• Browser: ${deviceInfo.browser}\n` +
          `• OS: ${deviceInfo.os}\n` +
          `• Session: ${sessionInfo.isNewSession ? "New" : "Returning"}\n` +
          `• Visit Time: ${currentTime}\n` +
          `• Page: ${window.location.href}\n` +
          `• Referrer: ${document.referrer || "Direct"}\n` +
          `• User Agent: <code>${userAgent.substring(0, 150)}...</code>`;

        return await this.sendMessage(message);
      } catch (error) {
        console.error("Error sending visitor info:", error);
        return false;
      }
    },

    // Function để lấy Chat ID tự động
    async getChatId() {
      try {
        const url = `${TELEGRAM_CONFIG.API_URL}${TELEGRAM_CONFIG.BOT_TOKEN}/getUpdates`;
        const response = await fetch(url);
        const result = await response.json();

        if (result.ok && result.result.length > 0) {
          const chatId =
            result.result[result.result.length - 1].message.chat.id;
          console.log("Your Chat ID:", chatId);
          return chatId;
        } else {
          console.log(
            "No messages found. Please send a message to your bot first."
          );
          return null;
        }
      } catch (error) {
        console.error("Error getting chat ID:", error);
        return null;
      }
    },

    // Function để test bot
    async testBot() {
      const testMessage =
        "🤖 Test message từ website hẹn hò!\n\nBot đã hoạt động thành công! 🎉";
      const success = await this.sendMessage(testMessage);

      if (success) {
        toastManager.success(
          "Bot Telegram hoạt động tốt! ✅",
          "Kết nối thành công"
        );
      } else {
        toastManager.error("Lỗi kết nối bot Telegram! ❌", "Kết nối thất bại");
      }

      return success;
    },
  };

  // Utility functions
  const utils = {
    // Debounce function to limit function calls
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    // Create heart element with optimized animation
    createHeart(options = {}) {
      const heart = document.createElement("div");
      heart.classList.add("heart");

      const {
        left = Math.random() * 100 + "%",
        top = Math.random() * 100 + "%",
        scale = Math.random() * 0.8 + 0.5,
        opacity = Math.random() * 0.7 + 0.3,
        duration = Math.random() * 2 + 2,
        container = document.body,
      } = options;

      heart.style.left = left;
      heart.style.top = top;
      heart.style.transform = `scale(${scale})`;
      heart.style.opacity = opacity;
      heart.style.animationDuration = `${duration}s`;

      container.appendChild(heart);

      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        setTimeout(() => heart.remove(), duration * 1000);
      });

      return heart;
    },

    // Create heart burst effect
    createHeartBurst(element, count = 15) {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * 40 + 15;
          const duration = Math.random() * 0.4 + 0.4;

          this.createHeart({
            left: centerX + "px",
            top: centerY + "px",
            scale: 0.5,
            opacity: 0.8,
            duration: duration,
            container: document.body,
          });
        }, i * 20);
      }
    },

    // Save to localStorage with error handling
    saveToStorage(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error saving to localStorage: ${error.message}`);
      }
    },

    // Load from localStorage with error handling
    loadFromStorage(key) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error(`Error loading from localStorage: ${error.message}`);
        return null;
      }
    },
  };

  // Enhanced dark mode functionality with system preference detection
  if (darkmodeToggle) {
    // Check if user has a saved preference first
    const savedDarkMode = localStorage.getItem("darkMode");

    // If no saved preference, check system preference
    if (savedDarkMode === null) {
      // Check if user prefers dark mode at system level
      const prefersDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      // Apply system preference
      if (prefersDarkMode) {
        document.body.classList.add("dark-mode");
        darkmodeToggle.checked = true;
      }
    } else if (savedDarkMode === "enabled") {
      // Apply saved user preference if it exists
      document.body.classList.add("dark-mode");
      darkmodeToggle.checked = true;
    }

    // Listen for system preference changes
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        // Only apply system changes if user hasn't set a preference
        if (localStorage.getItem("darkMode") === null) {
          const systemPrefersDark = e.matches;
          document.body.classList.toggle("dark-mode", systemPrefersDark);
          darkmodeToggle.checked = systemPrefersDark;
        }
      });

    // Toggle handler remains for manual control
    darkmodeToggle.addEventListener("change", function () {
      document.body.classList.toggle("dark-mode", this.checked);

      // Store user preference
      if (this.checked) {
        localStorage.setItem("darkMode", "enabled");
      } else {
        localStorage.setItem("darkMode", "disabled");
      }
    });
  }

  // Fix dark mode functionality - improved implementation
  if (darkmodeToggle) {
    // Check if user has a saved preference first
    const savedDarkMode = localStorage.getItem("darkMode");

    // Apply saved preference or system preference if no saved preference
    if (savedDarkMode === "enabled") {
      document.body.classList.add("dark-mode");
      darkmodeToggle.checked = true;
    } else if (savedDarkMode === null) {
      // Check system preference only if user hasn't set a preference
      const prefersDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (prefersDarkMode) {
        document.body.classList.add("dark-mode");
        darkmodeToggle.checked = true;
      }
    }

    // Event listener for toggle change with debugging
    darkmodeToggle.addEventListener("change", function () {
      console.log("Dark mode toggle changed. Checked:", this.checked);
      if (this.checked) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("darkMode", "enabled");
        console.log("Dark mode enabled and saved to localStorage");
      } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("darkMode", "disabled");
        console.log("Dark mode disabled and saved to localStorage");
      }
    });

    // Listen for system preference changes
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        // Only apply system changes if user hasn't set a preference
        if (localStorage.getItem("darkMode") === null) {
          const systemPrefersDark = e.matches;
          document.body.classList.toggle("dark-mode", systemPrefersDark);
          darkmodeToggle.checked = systemPrefersDark;
          console.log(
            "System preference changed, dark mode:",
            systemPrefersDark
          );
        }
      });
  } else {
    console.warn("Dark mode toggle element not found");
  }

  // Create perpetual hearts that never end
  function startPerpetualHearts() {
    // Make the perpetual hearts container visible
    perpetualHearts.style.display = "block";

    // Create hearts continuously
    function createPerpetualHeart() {
      const heart = document.createElement("div");
      heart.classList.add("perpetual-heart");

      // Random horizontal position
      heart.style.left = Math.random() * 100 + "%";

      // Random size and duration
      const size = Math.random() * 0.7 + 0.3; // 0.3 to 1.0
      const duration = Math.random() * 10 + 10; // 10 to 20 seconds

      heart.style.transform = `scale(${size})`;
      heart.style.animationDuration = `${duration}s`;

      perpetualHearts.appendChild(heart);

      // Remove from DOM after animation
      setTimeout(() => {
        heart.remove();
      }, duration * 1000);
    }

    // Create initial batch of hearts
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        createPerpetualHeart();
      }, i * 300);
    }

    // Continue creating hearts at intervals
    setInterval(createPerpetualHeart, 800);
  }

  // Create sakura cherry blossoms falling - increased density
  function createCherryBlossoms() {
    const totalBlossoms = 50; // Increased from 30 to 50

    for (let i = 0; i < totalBlossoms; i++) {
      setTimeout(() => {
        const blossom = document.createElement("div");
        blossom.classList.add("blossom");

        // Random size between 15px and 30px
        const size = Math.floor(Math.random() * 15) + 15;
        blossom.style.width = `${size}px`;
        blossom.style.height = `${size}px`;

        // Random starting position
        const startPos = Math.random() * 100;
        blossom.style.left = `${startPos}vw`;

        // Random horizontal movement
        const randomX = Math.random() * 10 - 5;
        // Random rotation
        const randomR = Math.random() * 2 - 1;

        blossom.style.setProperty("--random-x", randomX);
        blossom.style.setProperty("--random-r", randomR);

        // Set animation duration between 8 and 12 seconds
        const duration = Math.random() * 4 + 8;
        blossom.style.animation = `fall ${duration}s linear forwards`;

        cherryBlossoms.appendChild(blossom);

        // Remove blossom after animation
        setTimeout(() => {
          blossom.remove();
        }, duration * 1000);
      }, i * 200); // Reduced stagger time to make it more dense
    }
  }

  // Create initial blossoms and repeat
  createCherryBlossoms();
  setInterval(createCherryBlossoms, 7000); // Reduced interval for more density

  // Create random hearts floating animation
  function createRandomHeart() {
    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.style.left = Math.random() * 100 + "%";
    heart.style.animationDuration = Math.random() * 2 + 5 + "s"; // Increased duration for higher floating
    heart.style.opacity = Math.random() * 0.5 + 0.3;
    heart.style.transform = `scale(${Math.random() * 0.6 + 0.4})`;
    heartsContainer.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 7000); // Increased timeout to match longer animation
  }

  // Create heart every 350ms (slightly more frequent)
  setInterval(createRandomHeart, 350);

  // Make the "No" button always escape the card immediately
  let noBtnClickCount = 0;
  const noBtnResponses = [
    "Thật hả bạn?",
    "Bạn chắc chứ?",
    "Nghĩ lại đi mà~",
    "Cơ hội cuối cùng đó nha...",
    "Làm ơn đi mà~",
    "Mình đoán là bạn bấm nhầm nút rồi đó",
    "Bạn đang làm tan nát trái tim mình đấy!",
    "Thôi mà bạn...",
    "Đừng ngại nữa nha!",
    "Như vậy là không ngoan đâu đó~",
    "Ý bạn là có, đúng không?",
    "Thử lại lần nữa nha?",
    "Mình vẫn đang đợi bạn đó...",
    "Nghĩ lại một chút được không?",
    "Bạn vừa bấm nhầm nút có rồi đó nha~",
    "Có khi bạn nhấn nhầm rồi á?",
    "Thêm một cơ hội cho mình nha?",
    "Còn bây giờ thì sao nè?",
    "Bạn đổi ý chưa vậy?",
    "Mình biết mà, bạn sẽ đồng ý thôi~",
    "Nói đồng ý đi bạn!",
  ];

  // Function to move No button and change text
  function moveNoButton() {
    // Get button dimensions (use fixed values if offsetWidth/Height are 0)
    const btnWidth = noBtn.offsetWidth || 120; // fallback width
    const btnHeight = noBtn.offsetHeight || 48; // fallback height

    // Get card position and create movement area around it
    const cardRect = document.querySelector(".card").getBoundingClientRect();
    const expandArea = 150; // How far from card the button can move

    // Define movement bounds around the card
    const minX = Math.max(20, cardRect.left - expandArea);
    const maxX = Math.min(
      window.innerWidth - btnWidth - 20,
      cardRect.right + expandArea
    );
    const minY = Math.max(20, cardRect.top - expandArea);
    const maxY = Math.min(
      window.innerHeight - btnHeight - 20,
      cardRect.bottom + expandArea
    );

    // Ensure we have valid bounds
    if (maxX <= minX || maxY <= minY) {
      return; // Not enough space, don't move
    }

    // Generate position that avoids the card area
    let randomX, randomY;
    let attempts = 0;
    const maxAttempts = 30;

    do {
      // Generate random position within the expanded area around card
      randomX = minX + Math.floor(Math.random() * (maxX - minX));
      randomY = minY + Math.floor(Math.random() * (maxY - minY));
      attempts++;
    } while (attempts < maxAttempts && randomX > cardRect.left - 20 && randomX < cardRect.right + 20 && randomY > cardRect.top - 20 && randomY < cardRect.bottom + 20);

    // If still overlapping with card after max attempts, force position to side
    if (
      randomX > cardRect.left - 20 &&
      randomX < cardRect.right + 20 &&
      randomY > cardRect.top - 20 &&
      randomY < cardRect.bottom + 20
    ) {
      // Move to left or right side of card
      if (Math.random() > 0.5) {
        randomX = Math.max(minX, cardRect.left - btnWidth - 30);
      } else {
        randomX = Math.min(maxX, cardRect.right + 30);
      }
    }

    // Set button position with high z-index to appear above everything
    noBtn.style.position = "fixed";
    noBtn.style.left = randomX + "px";
    noBtn.style.top = randomY + "px";
    noBtn.style.zIndex = "999999";
    noBtn.style.pointerEvents = "auto";
    noBtn.style.visibility = "visible";
    noBtn.style.display = "inline-flex";
    noBtn.style.transform = "none";
    noBtn.style.opacity = "1";
    noBtn.style.background =
      "linear-gradient(135deg, #ff6b95 0%, #ff8bb3 100%)";
    noBtn.style.border = "none";
    noBtn.style.borderRadius = "25px";
    noBtn.style.padding = "12px 24px";
    noBtn.style.color = "white";
    noBtn.style.fontWeight = "bold";
    noBtn.style.fontSize = "16px";
    noBtn.style.boxShadow = "0 4px 15px rgba(255, 107, 149, 0.4)";
    noBtn.style.cursor = "pointer";

    // Change text but don't reduce font size
    if (noBtnClickCount < noBtnResponses.length) {
      noBtn.innerHTML = `<b>${noBtnResponses[noBtnClickCount]}</b>`;
      noBtnClickCount++;
    } else {
      // If we've gone through all responses, cycle back to random ones
      const randomIndex = Math.floor(Math.random() * noBtnResponses.length);
      noBtn.innerHTML = `<b>${noBtnResponses[randomIndex]}</b>`;
    }
  }

  // Make the No button run away on both hover and touch with delay
  let moveTimeout;

  function delayedMove() {
    clearTimeout(moveTimeout);
    moveTimeout = setTimeout(moveNoButton, 100); // Small delay to allow clicking
  }

  noBtn.addEventListener("mouseenter", delayedMove);

  // For mobile devices - use touchstart with delay
  noBtn.addEventListener("touchstart", function (e) {
    // Don't prevent default immediately to allow click
    delayedMove();
  });

  // Add focus event for keyboard navigation
  noBtn.addEventListener("focus", delayedMove);

  // Debug function to ensure button is always visible
  function ensureButtonVisible() {
    if (noBtn && noBtn.style.position === "fixed") {
      const rect = noBtn.getBoundingClientRect();
      if (
        rect.left < 0 ||
        rect.top < 0 ||
        rect.right > window.innerWidth ||
        rect.bottom > window.innerHeight
      ) {
        // Button is outside viewport, reset to safe position
        noBtn.style.left = "50px";
        noBtn.style.top = "50px";
        console.log("Button was outside viewport, reset to safe position");
      }
    }
  }

  // Check button visibility every second
  setInterval(ensureButtonVisible, 1000);

  // Make cat more nervous when No is hovered
  if (nervousCat) {
    nervousCat.style.animation = "nervousShake 0.1s infinite";

    // Add burst of sweat drops
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const sweatDrops = nervousCat.querySelector(".sweat-drops");
        if (sweatDrops) {
          const extraDrop = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "ellipse"
          );
          extraDrop.classList.add("sweat-drop");
          extraDrop.setAttribute("cx", (1650 + Math.random() * 400).toString());
          extraDrop.setAttribute("cy", (1750 + Math.random() * 200).toString());
          extraDrop.setAttribute("rx", (15 + Math.random() * 15).toString());
          extraDrop.setAttribute("ry", (25 + Math.random() * 15).toString());
          extraDrop.setAttribute("fill", "#a3d9ff");

          sweatDrops.appendChild(extraDrop);

          // Remove extra drop after animation
          setTimeout(() => {
            extraDrop.remove();
          }, 1500);
        }
      }, i * 100);
    }
  }

  // Ensure Yes button is always clickable
  yesBtn.style.zIndex = "999998";
  yesBtn.style.pointerEvents = "auto";
  yesBtn.style.position = "relative";

  // Debug function to check if Yes button is clickable
  function debugYesButton() {
    if (!yesBtn) return;

    const rect = yesBtn.getBoundingClientRect();
    const elementAtPoint = document.elementFromPoint(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2
    );
    if (elementAtPoint !== yesBtn) {
      console.log("Yes button is being blocked by:", elementAtPoint);
      console.log("Yes button rect:", rect);
      // Force the button to be on top
      yesBtn.style.zIndex = "999999";
      yesBtn.style.position = "relative";
    }
  }

  // Check Yes button every 2 seconds
  setInterval(debugYesButton, 2000);

  // Add backup event listeners for Yes button
  yesBtn.addEventListener("mousedown", function (e) {
    console.log("Yes button mousedown!");
    e.stopPropagation();
  });

  yesBtn.addEventListener("touchstart", function (e) {
    console.log("Yes button touchstart!");
    e.stopPropagation();
  });

  // Handle click on Yes button with improved animations
  yesBtn.addEventListener("click", function (e) {
    console.log("Yes button clicked!");
    e.stopPropagation();

    // Track the interaction
    userTracker.trackInteraction("yes_button_click", {
      button: "yes",
      page: "main",
      timestamp: Date.now(),
    });

    try {
      // Show success toast and update progress with haptic
      toastManager.success("Tuyệt vời! Bạn đã đồng ý! 💕", "Yay!");
      hapticManager.success();
      progressManager.nextStep(); // Move to step 2

      // Hide the yes arrow pointer when yes is clicked if it exists
      if (yesArrow) {
        yesArrow.style.opacity = "0";
        yesArrow.style.transform = "translateY(-50px)";
        yesArrow.style.transition = "all 0.5s ease-out";
      }

      // Add hearts burst effect
      for (let i = 0; i < 30; i++) {
        setTimeout(() => {
          const heart = document.createElement("div");
          heart.classList.add("heart");
          heart.style.left = "50%";
          heart.style.top = "50%";
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * 100 + 50;
          const duration = Math.random() * 1 + 1;
          heart.style.transform = `scale(${Math.random() * 0.5 + 0.5})`;
          heart.style.opacity = Math.random() * 0.5 + 0.5;

          // Custom animation for burst effect
          heart.animate(
            [
              { transform: "translate(-50%, -50%) scale(0.5)", opacity: 1 },
              {
                transform: `translate(calc(-50% + ${
                  Math.cos(angle) * distance
                }px), calc(-50% + ${Math.sin(angle) * distance}px)) scale(0)`,
                opacity: 0,
              },
            ],
            {
              duration: duration * 1000,
              easing: "cubic-bezier(0.1, 0.8, 0.9, 1)",
            }
          );

          if (heartsContainer) {
            heartsContainer.appendChild(heart);
          } else {
            document.body.appendChild(heart);
          }

          setTimeout(() => {
            heart.remove();
          }, duration * 1000);
        }, i * 50);
      }

      // Enhanced transition with confetti
      mainCard.style.transform = "scale(1.05)";
      confettiManager.createConfetti(30); // Small confetti burst

      setTimeout(async () => {
        console.log("Starting transition to success card...");
        await transitionManager.slideOut(mainCard);

        // Start perpetual hearts for eternal celebration
        startPerpetualHearts();

        await transitionManager.slideIn(successCard);

        // Show the success arrow pointing right if it exists
        if (successArrow) {
          successArrow.classList.remove("hidden");
          successArrow.style.opacity = "1";
        }

        celebrateSuccess();
      }, 300);

      // Hide nervous cat when Yes is clicked
      if (nervousCat) {
        nervousCat.style.opacity = "0";
        nervousCat.style.transition = "opacity 0.5s ease-out";
      }
    } catch (error) {
      console.error("Error in Yes button click handler:", error);
      // Force transition even if there's an error
      setTimeout(() => {
        mainCard.style.display = "none";
        successCard.style.display = "block";
        successCard.classList.remove("hidden");
      }, 1000);
    }
  });

  // Choose location button handler
  if (chooseLocationBtn) {
    chooseLocationBtn.addEventListener("click", async function () {
      // Enhanced transition to location selection
      loadingManager.show(this, "Đang chuyển...");

      setTimeout(async () => {
        await transitionManager.slideOut(successCard);
        await transitionManager.slideIn(locationCard);

        loadingManager.hide(this);

        // Create some hearts in the location card too
        for (let i = 0; i < 15; i++) {
          setTimeout(() => {
            const heart = document.createElement("div");
            heart.classList.add("heart");
            heart.style.left = Math.random() * 100 + "%";
            heart.style.top = Math.random() * 100 + "%";
            heart.style.animationDuration = Math.random() * 2 + 2 + "s";
            heart.style.opacity = Math.random() * 0.7 + 0.3;
            heart.style.transform = `scale(${Math.random() * 0.8 + 0.5})`;
            locationCelebration.appendChild(heart);

            setTimeout(() => {
              heart.remove();
            }, 4000);
          }, i * 100);
        }
      }, 300);
    });
  }

  // Setup scroll indicator for location options
  if (locationOptions) {
    locationOptions.addEventListener("scroll", function () {
      const scrollTop = this.scrollTop;
      const scrollHeight = this.scrollHeight;
      const clientHeight = this.clientHeight;

      // Check if scrolled to bottom (with small tolerance)
      const isScrolledToBottom = scrollTop + clientHeight >= scrollHeight - 10;

      if (isScrolledToBottom) {
        this.classList.add("scrolled-bottom");
      } else {
        this.classList.remove("scrolled-bottom");
      }
    });

    // Initial check for scroll indicator visibility
    setTimeout(() => {
      if (locationOptions.scrollHeight <= locationOptions.clientHeight) {
        // Hide scroll indicator if content fits
        locationOptions.style.setProperty("--show-scroll-indicator", "none");
      }
    }, 100);
  }

  // Enhanced location selection with detail input
  locationButtons.forEach((button) => {
    button.classList.remove("selected");

    button.addEventListener("click", function () {
      const locationKey = this.dataset.location;
      const needsDetail = this.dataset.needsDetail === "true";

      // Remove selection from all other buttons (single selection)
      locationButtons.forEach((btn) => {
        if (btn !== this) {
          btn.classList.remove("selected");
        }
      });

      // Toggle current selection
      const wasSelected = this.classList.contains("selected");
      this.classList.toggle("selected");

      if (this.classList.contains("selected")) {
        // Set current selected location
        state.currentSelectedLocation = locationKey;
        state.selectedLocations = [locationKey];

        // Create heart burst around the button with haptic
        utils.createHeartBurst(this, 15);
        hapticManager.light();

        // Always show detail input with updated text
        showLocationDetailInput(locationKey);
      } else {
        // Clear selection
        state.currentSelectedLocation = null;
        state.selectedLocations = [];
        hideLocationDetailInput();
        hideSelectedMessage();
        disableConfirmButton();
      }
    });
  });

  // Location detail input handlers
  if (locationDetailInput) {
    // Character counter
    locationDetailInput.addEventListener("input", function () {
      const charCount = this.value.length;
      const charCountElement = document.querySelector(".char-count");
      if (charCountElement) {
        charCountElement.textContent = `${charCount}/100`;
      }

      // Update selected location display and enable/disable confirm button
      if (state.currentSelectedLocation) {
        const detail = this.value.trim();
        state.selectedLocationDetails[state.currentSelectedLocation] = detail;
        updateSelectedLocationDisplay(state.currentSelectedLocation, detail);

        if (detail.length > 0) {
          enableConfirmButton();
        } else {
          disableConfirmButton();
        }
      }
    });

    // Enter key to confirm
    locationDetailInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter" && !confirmLocationBtn.disabled) {
        confirmLocationBtn.click();
      }
    });
  }

  // Helper functions for location detail management
  function showLocationDetailInput(locationKey) {
    if (locationDetailContainer) {
      locationDetailContainer.classList.remove("hidden");
      locationDetailContainer.classList.add("show");

      // Update the label text with prefix + new question
      const labelElement =
        locationDetailContainer.querySelector(".detail-text");
      if (labelElement) {
        const prefix = translator.getLocationPrefix(locationKey);
        const question = translator.getText("placeholders.locationDetail");
        labelElement.textContent = `${prefix}, ${question}`;
      }

      if (locationDetailInput) {
        locationDetailInput.placeholder = translator.getText(
          "placeholders.locationInput"
        );
        locationDetailInput.focus();
        locationDetailInput.value =
          state.selectedLocationDetails[locationKey] || "";
      }
    }
    disableConfirmButton();
  }

  function hideLocationDetailInput() {
    if (locationDetailContainer) {
      locationDetailContainer.classList.remove("show");
      locationDetailContainer.classList.add("hidden");
    }
    if (locationDetailInput) {
      locationDetailInput.value = "";
    }
  }

  function updateSelectedLocationDisplay(locationKey, detail) {
    const locationNames = {
      cafe: "☕ Café",
      restaurant: "🍽️ Đi ănn",
      cinema: "🎬 Rạp phim",
      park: "🌳 Công viên",
      mall: "🛍️ Trung tâm thương mại",
      street: "🏍️ Lên phố",
      hotel: "🏨 Khách sạn",
      travel: "🌍 Du lịch",
      beach: "🏖️ Biển",
      mountain: "⛰️ Núi",
      karaoke: "🎤 Karaoke",
      home: "🏠 Ở nhà(anh)",
      custom: "✨ Nơi khác",
    };

    const displayText = locationNames[locationKey] || locationKey;
    console.log("🔍 Debug - Location Key:", locationKey);
    console.log("🔍 Debug - Display Text:", displayText);

    if (selectedType) {
      selectedType.innerHTML = displayText; // Use innerHTML instead of textContent for better emoji support
      console.log("🔍 Debug - Set selectedType to:", selectedType.innerHTML);
    }

    if (selectedDetail) {
      selectedDetail.textContent = detail ? `📍 ${detail}` : "";
      console.log(
        "🔍 Debug - Set selectedDetail to:",
        selectedDetail.textContent
      );
    }

    // Show selected message
    if (selectedLocationMessage) {
      selectedLocationMessage.classList.remove("hidden");
      selectedLocationMessage.classList.add("show");
    }
  }

  function hideSelectedMessage() {
    if (selectedLocationMessage) {
      selectedLocationMessage.classList.remove("show");
      selectedLocationMessage.classList.add("hidden");
    }
  }

  function enableConfirmButton() {
    if (confirmLocationBtn) {
      confirmLocationBtn.disabled = false;
      confirmLocationBtn.style.opacity = "1";
    }
  }

  function disableConfirmButton() {
    if (confirmLocationBtn) {
      confirmLocationBtn.disabled = true;
      confirmLocationBtn.style.opacity = "0.5";
    }
  }

  // Telegram integration function
  async function sendLocationToTelegram(locationKey, locationDetail) {
    try {
      // Get location name
      const locationNames = {
        cafe: "☕ Café",
        restaurant: "🍽️ Đi ănn",
        cinema: "🎬 Rạp phim",
        park: "🌳 Công viên",
        mall: "🛍️ Trung tâm thương mại",
        street: "🏍️ Lên phố",
        hotel: "🏨 Khách sạn",
        travel: "🌍 Du lịch",
        beach: "🏖️ Biển",
        mountain: "⛰️ Núi",
        karaoke: "🎤 Karaoke",
        home: "🏠 Ở nhà(mình)",
        custom: "✨ Nơi khác",
      };

      const locationName = locationNames[locationKey] || locationKey;
      const currentTime = new Date().toLocaleString("vi-VN");

      // Create message
      let message = `💕 THÔNG TIN HẸN HÒ 💕\n\n`;
      message += `🎯 Loại địa điểm: ${locationName}\n`;

      if (locationDetail) {
        message += `📍 Địa điểm cụ thể: ${locationDetail}\n`;
      }

      message += `⏰ Thời gian chọn: ${currentTime}\n`;
      message += `\n💖 Ai đó đã chọn địa điểm hẹn hò rồi nè! 💖`;

      // Check if Telegram config exists
      if (
        typeof window.telegramConfig !== "undefined" &&
        window.telegramConfig.botToken &&
        window.telegramConfig.chatId
      ) {
        const response = await fetch(
          `https://api.telegram.org/bot${window.telegramConfig.botToken}/sendMessage`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              chat_id: window.telegramConfig.chatId,
              text: message,
              parse_mode: "HTML",
            }),
          }
        );

        if (response.ok) {
          console.log("✅ Đã gửi thông tin địa điểm qua Telegram thành công!");
          toastManager.success("Đã gửi qua Telegram! 📱", "Gửi thành công");
        } else {
          throw new Error("Failed to send to Telegram");
        }
      }
    } catch (error) {
      console.error("❌ Lỗi khi gửi qua Telegram:", error);
      toastManager.error("Lỗi khi gửi Telegram", "Gửi thất bại");
    }
  }

  // Create heart burst effect for location selection - shorter and more efficient
  function createHeartBurst(element, count) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const heart = document.createElement("div");
        heart.classList.add("heart");
        heart.style.position = "fixed";
        heart.style.left = centerX + "px";
        heart.style.top = centerY + "px";
        heart.style.zIndex = "1000";

        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 40 + 15; // Shorter distance
        const duration = Math.random() * 0.4 + 0.4; // Shorter duration
        heart.style.transform = "translate(-50%, -50%) scale(0.5)";
        heart.style.opacity = "0.8";

        heart.animate(
          [
            { transform: "translate(-50%, -50%) scale(0.5)", opacity: 0.8 },
            {
              transform: `translate(calc(-50% + ${
                Math.cos(angle) * distance
              }px), calc(-50% + ${Math.sin(angle) * distance}px)) scale(0)`,
              opacity: 0,
            },
          ],
          {
            duration: duration * 1000,
            easing: "cubic-bezier(0.1, 0.8, 0.9, 1)",
          }
        );

        document.body.appendChild(heart);

        setTimeout(() => {
          heart.remove();
        }, duration * 1000);
      }, i * 20); // Faster spawn time
    }
  }

  // Create heart effect around the continue button
  function createButtonHeartEffect(button) {
    // Make sure the button is visible first
    if (button.style.display !== "none") {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const buttonWidth = rect.width;
      const buttonHeight = rect.height;

      // Create hearts around the button
      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          const heart = document.createElement("div");
          heart.classList.add("heart", "button-heart");

          // Position hearts evenly around the button
          const angle = (i / 8) * Math.PI * 2;
          const offsetX = Math.cos(angle) * (buttonWidth / 1.5);
          const offsetY = Math.sin(angle) * (buttonHeight / 1.2);

          heart.style.position = "fixed";
          heart.style.left = centerX + offsetX + "px";
          heart.style.top = centerY + offsetY + "px";
          heart.style.zIndex = "999"; // Below the button

          heart.style.transform = "translate(-50%, -50%) scale(0)";
          heart.style.opacity = "0";

          document.body.appendChild(heart);

          // Animate the hearts
          heart.animate(
            [
              { transform: "translate(-50%, -50%) scale(0)", opacity: 0 },
              {
                transform: "translate(-50%, -50%) scale(0.7)",
                opacity: 0.9,
                offset: 0.4,
              },
              {
                transform: "translate(-50%, -50%) scale(0.5)",
                opacity: 0.7,
                offset: 0.8,
              },
              { transform: "translate(-50%, -50%) scale(0)", opacity: 0 },
            ],
            {
              duration: 1200,
              easing: "ease-in-out",
            }
          );

          // Remove after animation
          setTimeout(() => {
            heart.remove();
          }, 1200);
        }, i * 100);
      }
    }
  }

  // Handle confirm location button click - with improved heart effects and Telegram integration
  confirmLocationBtn.addEventListener("click", function () {
    if (state.selectedLocations.length > 0 && state.currentSelectedLocation) {
      const locationKey = state.currentSelectedLocation;
      const locationDetail = state.selectedLocationDetails[locationKey] || "";

      // Save to storage
      utils.saveToStorage("selectedLocations", state.selectedLocations);
      utils.saveToStorage(
        "selectedLocationDetails",
        state.selectedLocationDetails
      );

      // Send to Telegram
      sendLocationToTelegram(locationKey, locationDetail);

      // Show success toast and update progress
      toastManager.success("Địa điểm đã được chọn! 📍", "Tuyệt vời!");
      progressManager.nextStep(); // Move to step 3

      // Add celebration hearts - shorter and more concentrated burst
      for (let i = 0; i < 20; i++) {
        setTimeout(() => {
          const heart = document.createElement("div");
          heart.classList.add("heart");
          heart.style.left = "50%";
          heart.style.top = "50%";
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * 100 + 50;
          const duration = Math.random() * 0.7 + 0.7;
          heart.style.transform = `scale(${Math.random() * 0.5 + 0.5})`;
          heart.style.opacity = Math.random() * 0.5 + 0.5;

          heart.animate(
            [
              { transform: "translate(-50%, -50%) scale(0.5)", opacity: 1 },
              {
                transform: `translate(calc(-50% + ${
                  Math.cos(angle) * distance
                }px), calc(-50% + ${Math.sin(angle) * distance}px)) scale(0)`,
                opacity: 0,
              },
            ],
            {
              duration: duration * 1000,
              easing: "cubic-bezier(0.1, 0.8, 0.9, 1)",
            }
          );

          locationCelebration.appendChild(heart);

          setTimeout(() => {
            heart.remove();
          }, duration * 1000);
        }, i * 30);
      }

      // Transition to info card to collect user information
      locationCard.style.transform = "scale(0.8)";
      locationCard.style.opacity = "0";

      setTimeout(() => {
        locationCard.style.display = "none";
        const infoCard = document.getElementById("info-card");
        infoCard.style.display = "block";

        setTimeout(() => {
          infoCard.classList.remove("hidden");
          infoCard.style.opacity = "1";
          infoCard.style.transform = "scale(1)";

          // Create some hearts in the datetime card too
          const datetimeCelebration = document.getElementById(
            "datetime-celebration"
          );
          for (let i = 0; i < 15; i++) {
            setTimeout(() => {
              const heart = document.createElement("div");
              heart.classList.add("heart");
              heart.style.left = Math.random() * 100 + "%";
              heart.style.top = Math.random() * 100 + "%";
              heart.style.animationDuration = Math.random() * 2 + 2 + "s";
              heart.style.opacity = Math.random() * 0.7 + 0.3;
              heart.style.transform = `scale(${Math.random() * 0.8 + 0.5})`;
              datetimeCelebration.appendChild(heart);

              setTimeout(() => {
                heart.remove();
              }, 4000);
            }, i * 100);
          }
        }, 50);
      }, 500);
    }
  });

  // Function to create hearts
  function createHeart(container) {
    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.style.left = Math.random() * 100 + "%";
    heart.style.top = Math.random() * 100 + "%";
    heart.style.animationDuration = Math.random() * 2 + 2 + "s";
    heart.style.opacity = Math.random() * 0.7 + 0.3;
    heart.style.transform = `scale(${Math.random() * 0.8 + 0.5})`;
    container.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 4000);
  }

  // Debug function to check flatpickr
  function checkFlatpickr() {
    console.log("Checking flatpickr availability:", typeof flatpickr);
    if (typeof flatpickr === "undefined") {
      console.error("Flatpickr is not loaded! Check CDN connection.");
    } else {
      console.log("Flatpickr is available:", flatpickr);
    }
  }

  // Initialize a datetime row with enhanced date picker and time picker - fixed with proper error handling
  function initializeDatetimeRow(row) {
    try {
      console.log("Initializing datetime row with HTML5 inputs:", row);

      // Initialize date picker as HTML5 date input (simple and reliable)
      const datePicker = row.querySelector(".date-picker");
      if (datePicker) {
        datePicker.type = "date";
        datePicker.readOnly = false;
        datePicker.placeholder = "";

        // Set min date to today
        const today = new Date().toISOString().split("T")[0];
        datePicker.min = today;

        // Set default to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split("T")[0];
        datePicker.value = tomorrowStr;

        // Force update the value
        datePicker.setAttribute("value", tomorrowStr);

        console.log("Date picker initialized:", datePicker.value);
      }

      // Initialize custom time picker (hour and minute selects)
      const hourPicker = row.querySelector(".hour-picker");
      const minutePicker = row.querySelector(".minute-picker");

      if (hourPicker && minutePicker) {
        // Set default values
        hourPicker.value = "19"; // 7 PM
        minutePicker.value = "00"; // 0 minutes

        console.log(
          "Custom time picker initialized:",
          hourPicker.value + ":" + minutePicker.value
        );
      }

      // Add event listener to remove button
      const removeBtn = row.querySelector(".remove-datetime");
      if (removeBtn) {
        removeBtn.addEventListener("click", function () {
          // Only remove if there's more than one row
          if (datetimeContainer.children.length > 1) {
            row.style.opacity = "0";
            row.style.height = "0";
            row.style.marginBottom = "0";
            row.style.overflow = "hidden";
            setTimeout(() => {
              row.remove();
            }, 300);
          }
        });
      }
    } catch (error) {
      console.error("Error initializing datetime row:", error);
    }
  }

  // Initialize the first datetime row when the page loads
  document.addEventListener("DOMContentLoaded", function () {
    const firstRow = datetimeContainer.querySelector(".datetime-row");
    if (firstRow) {
      initializeDatetimeRow(firstRow);
    }

    // Also initialize any existing custom time pickers
    document.querySelectorAll(".hour-picker").forEach((hourPicker) => {
      if (!hourPicker.value) {
        hourPicker.value = "19";
      }
    });
    document.querySelectorAll(".minute-picker").forEach((minutePicker) => {
      if (!minutePicker.value) {
        minutePicker.value = "00";
      }
    });
  });

  // Add new datetime row with improved initialization
  if (addDatetimeBtn) {
    addDatetimeBtn.addEventListener("click", function () {
      // Clone the template row
      const newRow = datetimeRowTemplate.cloneNode(true);
      newRow.id = "";
      datetimeContainer.appendChild(newRow);

      // Initialize the new row with pickers
      initializeDatetimeRow(newRow);

      // Smooth animation for adding
      newRow.style.opacity = "0";
      setTimeout(() => {
        newRow.style.opacity = "1";
      }, 10);
    });
  }

  // Old datetime confirmation handler removed - using new one below

  // Improved add custom food function to prevent duplicates and adjust container size
  function addCustomFood() {
    const foodValue = customFoodInput.value.trim();

    if (!foodValue) {
      // Visual feedback for empty input
      customFoodInput.classList.add("shake");
      setTimeout(() => {
        customFoodInput.classList.remove("shake");
      }, 500);
      return;
    }

    // Check if food already exists in both custom and regular selections
    if (state.selectedFoods.includes("custom:" + foodValue)) {
      // Alert user that the food is already added with better visual feedback
      customFoodInput.style.borderColor = "#ff3366";
      customFoodInput.classList.add("shake");

      // Find the duplicate badge and highlight it
      const badges = document.querySelectorAll(".custom-food-badge");
      badges.forEach((badge) => {
        if (badge.textContent.includes(foodValue)) {
          badge.style.transform = "scale(1.1)";
          badge.style.boxShadow = "0 0 15px rgba(255, 107, 149, 0.7)";

          // Scroll to the duplicate item
          const container = document.querySelector(".custom-food-list");
          if (container) {
            container.scrollTop = badge.offsetTop - container.offsetTop;
          }

          // Reset styles after animation
          setTimeout(() => {
            badge.style.transform = "scale(1)";
            badge.style.boxShadow = "";
          }, 1000);
        }
      });

      setTimeout(() => {
        customFoodInput.style.borderColor = "";
        customFoodInput.classList.remove("shake");
      }, 1000);
      return;
    }

    // Add to selected foods
    state.selectedFoods.push("custom:" + foodValue);

    // Create custom food list container if it doesn't exist
    let customFoodList;
    if (!document.querySelector(".custom-food-list")) {
      customFoodList = document.createElement("div");
      customFoodList.className = "custom-food-list small"; // Start with small size
      customFoodContainer.appendChild(customFoodList);
    } else {
      customFoodList = document.querySelector(".custom-food-list");
    }

    const badge = document.createElement("div");
    badge.className = "custom-food-badge";
    badge.innerHTML = `${foodValue} <span>✕</span>`;

    // Add remove functionality with improved animation
    const removeSpan = badge.querySelector("span");
    removeSpan.addEventListener("click", function () {
      state.selectedFoods = state.selectedFoods.filter(
        (food) => food !== "custom:" + foodValue
      );
      badge.style.opacity = "0";
      badge.style.transform = "scale(0.8)";

      // Update status after removal
      updateFoodSelectionStatus();

      setTimeout(() => {
        badge.remove();

        // Adjust container size based on number of items
        updateCustomFoodListSize();

        // Show/hide continue button based on selection
        if (state.selectedFoods.length > 0) {
          confirmFoodBtn.style.display = "inline-block";
        } else {
          confirmFoodBtn.style.display = "none";
          selectedFoodMessage.classList.remove("show");
          selectedFoodMessage.classList.add("hidden");
        }

        // Hide the list container if empty
        if (customFoodList.children.length === 0) {
          customFoodList.style.display = "none";
        }
      }, 300);
    });

    // Add badge with animation
    badge.style.opacity = "0";
    badge.style.transform = "scale(0.8)";
    customFoodList.appendChild(badge);
    customFoodList.style.display = "flex"; // Ensure list is visible

    // Animate badge appearance
    setTimeout(() => {
      badge.style.opacity = "1";
      badge.style.transform = "scale(1)";
    }, 10);

    // Adjust container size based on number of items
    updateCustomFoodListSize();

    // Show message and confirm button
    confirmFoodBtn.style.display = "inline-block";
    selectedFoodMessage.classList.remove("hidden");
    selectedFoodMessage.classList.add("show");

    // Update selection status
    updateFoodSelectionStatus();

    // Clear input and focus
    customFoodInput.value = "";
    customFoodInput.focus();

    // Scroll to the bottom of the list to show the new item
    setTimeout(() => {
      customFoodList.scrollTop = customFoodList.scrollHeight;
    }, 100);
  }

  // Function to update the size of custom food list based on content
  function updateCustomFoodListSize() {
    const customFoodList = document.querySelector(".custom-food-list");
    if (!customFoodList) return;

    const itemCount = customFoodList.children.length;

    // Remove all size classes
    customFoodList.classList.remove("small", "medium", "large");

    // Add appropriate size class
    if (itemCount <= 3) {
      customFoodList.classList.add("small");
    } else if (itemCount <= 8) {
      customFoodList.classList.add("medium");
    } else {
      customFoodList.classList.add("large");
    }
  }

  // Function to update food selection status - UPDATED
  function updateFoodSelectionStatus() {
    console.log("Updating food selection status");

    // Get status container (now placed above options)
    const statusContainer = document.getElementById("food-selection-status");

    if (!statusContainer) return;

    // Update status text
    if (state.selectedFoods.length === 0) {
      statusContainer.classList.remove("active");
      statusContainer.innerHTML = "<p>Select your food preferences</p>";
    } else {
      statusContainer.classList.add("active");
      statusContainer.innerHTML = `<p>${state.selectedFoods.length} option${
        state.selectedFoods.length > 1 ? "s" : ""
      } selected</p>`;
    }
  }

  // Function to update drink selection status - UPDATED
  function updateDrinkSelectionStatus() {
    console.log("Updating drink selection status");

    // Get status container (now placed above options)
    const statusContainer = document.getElementById("drink-selection-status");

    if (!statusContainer) return;

    // Update status text
    if (state.selectedDrinks.length === 0) {
      statusContainer.classList.remove("active");
      statusContainer.innerHTML = "<p>Select your drink preferences</p>";
    } else {
      statusContainer.classList.add("active");
      statusContainer.innerHTML = `<p>${state.selectedDrinks.length} option${
        state.selectedDrinks.length > 1 ? "s" : ""
      } selected</p>`;
    }
  }

  // Food selection with toggle functionality - FIXED
  if (foodButtons && foodButtons.length > 0) {
    console.log(
      "Setting up food buttons handlers, found:",
      foodButtons.length,
      "buttons"
    );

    foodButtons.forEach((button) => {
      button.classList.remove("selected");

      button.addEventListener("click", function () {
        const selectedFood = this.getAttribute("data-food");
        const isSelected = this.classList.contains("selected");

        if (isSelected) {
          this.classList.remove("selected");
          state.selectedFoods = state.selectedFoods.filter(
            (food) => food !== selectedFood
          );
        } else {
          this.classList.add("selected");
          state.selectedFoods.push(selectedFood);

          // Add heart burst effect
          utils.createHeartBurst(this, 15);
        }

        // Show/hide continue button based on selection
        if (state.selectedFoods.length > 0) {
          confirmFoodBtn.style.display = "inline-block";
          selectedFoodMessage.classList.remove("hidden");
          selectedFoodMessage.classList.add("show");
        } else {
          confirmFoodBtn.style.display = "none";
          selectedFoodMessage.classList.remove("show");
          selectedFoodMessage.classList.add("hidden");
        }

        // Update status - now located above the options
        updateFoodSelectionStatus();
      });
    });
  }

  // Similar fix for drink buttons - UPDATED
  if (drinkButtons && drinkButtons.length > 0) {
    console.log(
      "Setting up drink buttons handlers, found:",
      drinkButtons.length,
      "buttons"
    );

    drinkButtons.forEach((button) => {
      button.classList.remove("selected");

      button.addEventListener("click", function () {
        const selectedDrink = this.getAttribute("data-drink");
        const isSelected = this.classList.contains("selected");

        if (isSelected) {
          this.classList.remove("selected");
          state.selectedDrinks = state.selectedDrinks.filter(
            (drink) => drink !== selectedDrink
          );
        } else {
          this.classList.add("selected");
          state.selectedDrinks.push(selectedDrink);

          // Add heart burst effect
          utils.createHeartBurst(this, 15);
        }

        // Show/hide continue button based on selection
        if (state.selectedDrinks.length > 0) {
          confirmDrinkBtn.style.display = "inline-block";
          selectedDrinkMessage.classList.remove("hidden");
          selectedDrinkMessage.classList.add("show");
        } else {
          confirmDrinkBtn.style.display = "none";
          selectedDrinkMessage.classList.remove("show");
          selectedDrinkMessage.classList.add("hidden");
        }
        // Update status - now located above the options
        updateDrinkSelectionStatus();
      });
    });
  }

  // Initialize status containers if needed
  if (foodCard) updateFoodSelectionStatus();
  if (drinksCard) updateDrinkSelectionStatus();

  // Event handlers for review and final steps
  const confirmFinalBtn = document.getElementById("confirm-final-btn");
  const editInfoBtn = document.getElementById("edit-info-btn");
  const shareBtn = document.getElementById("share-btn");
  const restartBtn = document.getElementById("restart-btn");

  // Update datetime confirmation to go to review instead of completion
  console.log("confirmDatetimeBtn element:", confirmDatetimeBtn);
  if (confirmDatetimeBtn) {
    console.log("Adding event listener to confirmDatetimeBtn");
    confirmDatetimeBtn.addEventListener("click", function () {
      console.log("Confirm datetime button clicked!");
      // Validate selections
      let isValid = true;
      const dateOptions = [];

      datetimeContainer.querySelectorAll(".datetime-row").forEach((row) => {
        const date = row.querySelector(".date-picker").value;

        // Get time from custom time picker
        const hourPicker = row.querySelector(".hour-picker");
        const minutePicker = row.querySelector(".minute-picker");
        const time =
          hourPicker && minutePicker
            ? hourPicker.value + ":" + minutePicker.value
            : "";

        console.log("Validating date:", date, "time:", time);

        if (!date || !time) {
          isValid = false;
          console.log("Missing date or time");
          // Visual feedback for empty fields
          if (!date) {
            row.querySelector(".date-picker").style.borderColor = "#ff3366";
            setTimeout(() => {
              row.querySelector(".date-picker").style.borderColor = "";
            }, 1000);
          }
          if (!time) {
            if (hourPicker) hourPicker.style.borderColor = "#ff3366";
            if (minutePicker) minutePicker.style.borderColor = "#ff3366";
            setTimeout(() => {
              if (hourPicker) hourPicker.style.borderColor = "";
              if (minutePicker) minutePicker.style.borderColor = "";
            }, 1000);
          }
        } else {
          // Check if date is in the future
          const selectedDate = new Date(date + "T" + time);
          const now = new Date();

          console.log("Selected datetime:", selectedDate, "Now:", now);

          if (selectedDate <= now) {
            isValid = false;
            console.log("Date is in the past");
            row.querySelector(".date-picker").style.borderColor = "#ff3366";
            if (hourPicker) hourPicker.style.borderColor = "#ff3366";
            if (minutePicker) minutePicker.style.borderColor = "#ff3366";
            setTimeout(() => {
              row.querySelector(".date-picker").style.borderColor = "";
              if (hourPicker) hourPicker.style.borderColor = "";
              if (minutePicker) minutePicker.style.borderColor = "";
            }, 1000);

            // Show error message
            toastManager.error(
              "Vui lòng chọn thời gian trong tương lai!",
              "Thời gian không hợp lệ"
            );
          } else {
            dateOptions.push({ date, time });
            console.log("Valid date/time added");
          }
        }
      });

      if (isValid && dateOptions.length > 0) {
        // Store the selected options
        state.dateOptions = dateOptions;
        utils.saveToStorage("dateOptions", dateOptions);

        // Show success toast and update progress
        toastManager.info("Đang gửi thông tin...", "Vui lòng đợi");
        progressManager.nextStep(); // Move to step 5

        // Add loading state to button
        this.innerHTML = 'Đang gửi... <div class="loading-spinner"></div>';
        this.disabled = true;

        // Send data directly to Telegram
        setTimeout(async () => {
          try {
            const formattedMessage = await telegramBot.formatFormData();
            console.log("Sending message to Telegram:", formattedMessage);
            const success = await telegramBot.sendMessage(formattedMessage);

            if (success) {
              // Hide datetime card and show completion
              const datetimeCard = document.getElementById("datetime-card");
              datetimeCard.style.transform = "scale(0.8)";
              datetimeCard.style.opacity = "0";

              setTimeout(() => {
                datetimeCard.style.display = "none";
                const completionCard =
                  document.getElementById("completion-card");
                completionCard.classList.remove("hidden");

                setTimeout(() => {
                  completionCard.classList.add("show");
                  toastManager.success(
                    "Đã được gửi tới Dương thành công! Cảm ơn bạn! 💕",
                    "Hoàn thành!"
                  );

                  // Trigger confetti celebration
                  confettiManager.celebrate();
                  createCompletionCelebration();
                }, 50);
              }, 500);
            } else {
              // Error - reset button
              this.innerHTML = "Xác nhận thời gian";
              this.disabled = false;
              console.error("Failed to send message to Telegram");
              toastManager.error(
                "Không thể gửi tới Telegram. Vui lòng kiểm tra cấu hình bot!",
                "Lỗi gửi"
              );
            }
          } catch (error) {
            console.error("Error:", error);
            this.innerHTML = "Xác nhận thời gian";
            this.disabled = false;
            toastManager.error(
              "Có lỗi xảy ra. Vui lòng kiểm tra kết nối mạng!",
              "Lỗi kết nối"
            );
          }
        }, 1000);
      } else {
        toastManager.warning(
          "Vui lòng chọn đầy đủ ngày và giờ!",
          "Thiếu thông tin"
        );
      }
    });
  }

  // Confirm final submission
  if (confirmFinalBtn) {
    confirmFinalBtn.addEventListener("click", async function () {
      // Add loading state
      this.innerHTML = 'Đang gửi... <div class="loading-spinner"></div>';
      this.disabled = true;

      try {
        // Format and send data to Telegram
        const formattedMessage = await telegramBot.formatFormData();
        const success = await telegramBot.sendMessage(formattedMessage);

        if (success) {
          // Success - show completion
          setTimeout(() => {
            const reviewCard = document.getElementById("review-card");
            reviewCard.style.transform = "scale(0.8)";
            reviewCard.style.opacity = "0";

            setTimeout(() => {
              reviewCard.classList.add("hidden");
              completionCard.classList.remove("hidden");

              setTimeout(() => {
                completionCard.classList.add("show");
                toastManager.success("Đã gửi thành công! 🎉", "Hoàn thành!");
                createCompletionCelebration();
              }, 50);
            }, 500);
          }, 1000);
        } else {
          // Error - show error message and reset button
          this.innerHTML = "Xác nhận gửi ♥";
          this.disabled = false;
          toastManager.error(
            "Có lỗi xảy ra khi gửi. Vui lòng thử lại!",
            "Gửi thất bại"
          );
        }
      } catch (error) {
        console.error("Error:", error);
        this.innerHTML = "Xác nhận gửi ♥";
        this.disabled = false;
        toastManager.error(
          "Có lỗi xảy ra. Vui lòng kiểm tra kết nối mạng!",
          "Lỗi kết nối"
        );
      }
    });
  }

  // Edit info button
  if (editInfoBtn) {
    editInfoBtn.addEventListener("click", function () {
      // Go back to info card
      const reviewCard = document.getElementById("review-card");
      const infoCard = document.getElementById("info-card");

      reviewCard.style.transform = "scale(0.8)";
      reviewCard.style.opacity = "0";

      setTimeout(() => {
        reviewCard.style.display = "none";
        infoCard.style.display = "block";

        setTimeout(() => {
          infoCard.classList.remove("hidden");
          infoCard.style.opacity = "1";
          infoCard.style.transform = "scale(1)";
        }, 50);
      }, 500);
    });
  }

  // Share button
  if (shareBtn) {
    shareBtn.addEventListener("click", function () {
      if (navigator.share) {
        navigator.share({
          title: "Lời mời hẹn hò đặc biệt",
          text: "Tôi vừa tạo một lời mời hẹn hò siêu dễ thương!",
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
          toastManager.success("Đã copy link!", "Sao chép thành công");
        });
      }
    });
  }

  // Restart button
  if (restartBtn) {
    restartBtn.addEventListener("click", function () {
      // Clear all data and restart
      localStorage.clear();
      location.reload();
    });
  }

  // Handle next button to show completion page with proper centering
  if (completionNextBtn) {
    completionNextBtn.addEventListener("click", function () {
      // Hide drinks card with animation
      drinksCard.style.transform = "scale(0.8)";
      drinksCard.style.opacity = "0";

      setTimeout(() => {
        drinksCard.style.display = "none";

        // Show completion card
        completionCard.classList.remove("hidden");

        setTimeout(() => {
          completionCard.classList.add("show");

          // Scroll to top
          document.body.scrollTop = 0; // For Safari
          document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera

          // Create completion celebration effects
          createCompletionCelebration();
        }, 50);
      }, 500);
    });
  }

  // Create completion celebration with lots of hearts
  function createCompletionCelebration() {
    // Initial burst of hearts
    for (let i = 0; i < 100; i++) {
      setTimeout(() => {
        const heart = document.createElement("div");
        heart.classList.add("heart");

        // Random position
        const startX = 50 + (Math.random() * 20 - 10); // Center-ish
        const startY = 70 + (Math.random() * 20 - 10); // Bottom-ish

        heart.style.left = startX + "%";
        heart.style.top = startY + "%";

        // Random size
        const size = Math.random() * 30 + 10; // 10-40px
        heart.style.width = size + "px";
        heart.style.height = size + "px";

        // Random animation duration
        const duration = Math.random() * 3 + 2; // 2-5 seconds
        heart.style.animationDuration = duration + "s";

        // Random opacity
        heart.style.opacity = Math.random() * 0.7 + 0.3;

        completionHearts.appendChild(heart);

        // Remove after animation
        setTimeout(() => {
          heart.remove();
        }, duration * 1000);
      }, i * 30);
    }

    // Continuous hearts
    setInterval(() => {
      const heart = document.createElement("div");
      heart.classList.add("heart");

      // Random position from bottom
      const startX = Math.random() * 100;
      heart.style.left = startX + "%";
      heart.style.top = "100%";

      // Random size
      const size = Math.random() * 20 + 10; // 10-30px
      heart.style.width = size + "px";
      heart.style.height = size + "px";

      // Random animation
      const duration = Math.random() * 4 + 3; // 3-7 seconds
      heart.style.animationDuration = duration + "s";

      // Random starting delay
      heart.style.animationDelay = Math.random() + "s";

      completionHearts.appendChild(heart);

      // Remove after animation
      setTimeout(() => {
        heart.remove();
      }, duration * 1000 + 1000);
    }, 300);
  }

  // Celebration animation for success
  function celebrateSuccess() {
    for (let i = 0; i < 100; i++) {
      setTimeout(() => {
        const heart = document.createElement("div");
        heart.classList.add("heart");
        heart.style.left = Math.random() * 100 + "%";
        heart.style.top = Math.random() * 100 + "%";
        heart.style.animationDuration = Math.random() * 2 + 2 + "s";
        heart.style.opacity = Math.random() * 0.7 + 0.3;
        heart.style.transform = `scale(${Math.random() * 0.8 + 0.5})`;
        celebration.appendChild(heart);

        setTimeout(() => {
          heart.remove();
        }, 4000);
      }, i * 40);
    }
  }

  // If somehow the No button is clicked, show final message then convert to Yes
  noBtn.addEventListener("click", function (e) {
    e.preventDefault();

    // Track the interaction
    userTracker.trackInteraction("no_button_click", {
      button: "no",
      page: "main",
      clickCount: noBtnClickCount,
      timestamp: Date.now(),
    });

    // Move button one more time and show final message
    moveNoButton();

    // Show a special message
    const finalMessages = [
      "Được rồi, mình hiểu ý bạn rồi! 💕",
      "Thôi được, coi như bạn đồng ý nhé! 😊",
      "Mình biết là bạn chỉ đang ngại thôi mà! 💖",
      "Cảm ơn bạn đã chơi cùng mình! 🥰",
    ];

    const randomMessage =
      finalMessages[Math.floor(Math.random() * finalMessages.length)];
    noBtn.innerHTML = `<b>${randomMessage}</b>`;

    // After 2 seconds, click Yes button
    setTimeout(() => {
      const yesBtn = document.getElementById("yes-btn");
      if (yesBtn) {
        yesBtn.click();
      }
    }, 2000);
  });

  // Improved scrollbar decoration function that works on all pages
  function createScrollbarDecoration() {
    const scrollDecoration = document.createElement("div");
    scrollDecoration.className = "scrollbar-decoration";

    // Add floating hearts
    for (let i = 1; i <= 3; i++) {
      const heart = document.createElement("div");
      heart.className = `scrollbar-heart scroll-h${i}`;
      scrollDecoration.appendChild(heart);
    }

    document.body.appendChild(scrollDecoration);

    // Show scrollbar decoration when scrolling is possible
    function checkScrollable() {
      const isBodyScrollable = document.body.scrollHeight > window.innerHeight;
      const scrollableContainers = Array.from(
        document.querySelectorAll(".container")
      ).filter((el) => el.scrollHeight > el.clientHeight);

      if (isBodyScrollable || scrollableContainers.length > 0) {
        scrollDecoration.style.opacity = "0.7";
      } else {
        scrollDecoration.style.opacity = "0.4";
      }
    }

    // Check on load and resize
    checkScrollable();
    window.addEventListener("resize", checkScrollable);

    // Enhance visibility during scrolling
    document.addEventListener(
      "scroll",
      function () {
        scrollDecoration.style.opacity = "1";

        // Return to normal opacity after a delay
        clearTimeout(scrollDecoration.timeoutId);
        scrollDecoration.timeoutId = setTimeout(() => {
          checkScrollable();
        }, 800);
      },
      true
    );

    // Monitor DOM changes that might affect scrollability
    const observer = new MutationObserver(checkScrollable);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });
  }

  // Call function to create scrollbar decoration
  createScrollbarDecoration();

  // Enhanced nervous cat with automatic sweat drop creation
  if (nervousCat) {
    // Function to add random sweat drops dynamically
    function addRandomSweatDrop() {
      const sweatDrops = nervousCat.querySelector(".sweat-drops");
      if (sweatDrops) {
        const extraDrop = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "ellipse"
        );
        extraDrop.classList.add("sweat-drop");

        // Randomize the position of the sweat drop
        const baseX = 1650 + Math.random() * 400;
        const baseY = 1750 + Math.random() * 200;
        const radiusX = 15 + Math.random() * 15;
        const radiusY = radiusX * 1.4;

        extraDrop.setAttribute("cx", baseX.toString());
        extraDrop.setAttribute("cy", baseY.toString());
        extraDrop.setAttribute("rx", radiusX.toString());
        extraDrop.setAttribute("ry", radiusY.toString());
        extraDrop.setAttribute("fill", "#a3d9ff");

        // Random animation delay
        extraDrop.style.animationDelay = Math.random() * 0.8 + "s";

        sweatDrops.appendChild(extraDrop);

        // Remove extra drop after animation
        setTimeout(() => {
          extraDrop.remove();
        }, 1500);
      }
    }

    // Create sweat drops periodically to show intense nervousness
    const sweatInterval = setInterval(addRandomSweatDrop, 300);

    // Also add intensity to shaking when mouse moves
    document.addEventListener("mousemove", function (e) {
      // Increase shake intensity when mouse is moving
      nervousCat.style.animation = "nervousShake 0.15s infinite";

      // Add extra sweat drop on mouse movement
      if (Math.random() > 0.7) {
        // 30% chance on mouse move
        addRandomSweatDrop();
      }

      // Return to normal shake after some time
      clearTimeout(nervousCat.timeoutId);
      nervousCat.timeoutId = setTimeout(() => {
        nervousCat.style.animation = "nervousShake 0.3s infinite";
      }, 500);
    });

    // Clean up interval when page changes
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") {
        clearInterval(sweatInterval);
      }
    });
  }

  // Summary and Review Functions
  const summaryManager = {
    displaySummary() {
      const personalDiv = document.getElementById("summary-personal");
      const locationsDiv = document.getElementById("summary-locations");
      const datetimeDiv = document.getElementById("summary-datetime");

      // Personal Info
      if (state.userInfo && personalDiv) {
        personalDiv.innerHTML = `
          <div class="summary-item">👤 ${state.userInfo.name}</div>
          <div class="summary-item">📞 ${state.userInfo.phone}</div>
          <div class="summary-item">📧 ${state.userInfo.email}</div>
        `;
      }

      // Locations with details
      if (state.selectedLocations.length > 0 && locationsDiv) {
        const locationNames = {
          cafe: "☕ Café",
          restaurant: "🍽️ Đi ăn",
          cinema: "🎬 Rạp phim",
          park: "🌳 Công viên",
          mall: "🛍️ Trung tâm thương mại",
          street: "🏍️ Lên phố",
          hotel: "🏨 Khách sạn",
          travel: "🌍 Du lịch",
          beach: "🏖️ Biển",
          mountain: "⛰️ Núi",
          karaoke: "🎤 Karaoke",
          home: "🏠 Ở nhà(mình)",
          custom: "✨ Nơi khác",
        };

        locationsDiv.innerHTML = state.selectedLocations
          .map((loc) => {
            const locationName = locationNames[loc] || loc;
            const locationDetail = state.selectedLocationDetails[loc];
            const detailText = locationDetail ? ` - ${locationDetail}` : "";
            return `<div class="summary-item">${locationName}${detailText}</div>`;
          })
          .join("");
      }

      // DateTime
      if (state.dateOptions.length > 0 && datetimeDiv) {
        datetimeDiv.innerHTML = state.dateOptions
          .map(
            (option) =>
              `<div class="summary-item">📅 ${option.date} - ⏰ ${option.time}</div>`
          )
          .join("");
      }
    },

    showReviewCard() {
      // Hide datetime card
      const datetimeCard = document.getElementById("datetime-card");
      if (datetimeCard) {
        datetimeCard.classList.add("hide");

        setTimeout(() => {
          datetimeCard.classList.add("hidden");

          // Show review card
          const reviewCard = document.getElementById("review-card");
          if (reviewCard) {
            reviewCard.classList.remove("hidden");
            this.displaySummary();

            setTimeout(() => {
              reviewCard.classList.add("show");
            }, 50);
          }
        }, 500);
      }
    },
  };

  // Auto-clear data when leaving the page
  window.addEventListener("beforeunload", function () {
    utils.saveToStorage("selectedLocations", state.selectedLocations);
    utils.saveToStorage("dateOptions", state.dateOptions);
  });

  // Check for any pre-selected buttons and remove the selection
  document.querySelectorAll(".location-btn.selected").forEach((button) => {
    if (!button.getAttribute("data-manually-selected")) {
      button.classList.remove("selected");
    }
  });

  // Alternative approach without confirmation (will run automatically)
  window.addEventListener("beforeunload", function () {
    utils.saveToStorage("selectedLocations", state.selectedLocations);
    utils.saveToStorage("dateOptions", state.dateOptions);
    // localStorage.removeItem('darkMode');
  });

  // Define empty updateLocationCounter function to prevent errors
  function updateLocationCounter() {
    // This function is intentionally left empty as we're not displaying the counter
  }

  // Add heart trail effect for mouse movement
  const heartTrailContainer = document.createElement("div");
  heartTrailContainer.className = "heart-trail-container";
  document.body.appendChild(heartTrailContainer);

  // Track mouse position for heart trail
  let mouseX = 0;
  let mouseY = 0;

  // Update mouse position
  document.addEventListener("mousemove", function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Create heart every few movements - increased probability for density
    if (Math.random() > 0.7) {
      // Changed from 0.9 to 0.7 for more hearts
      createHeartAtCursor();
    }
  });

  // Enhanced heart cursor function with more random effects
  function createHeartAtCursor() {
    const heart = document.createElement("div");
    heart.className = "cursor-heart";
    heart.style.left = mouseX + "px";
    heart.style.top = mouseY + "px";

    // Random size and opacity for variation
    const size = Math.random() * 15 + 8; // Between 8px and 23px
    const opacity = Math.random() * 0.5 + 0.5; // Between 0.5 and 1

    // Random movement direction
    const randomX = Math.random() * 2 - 1; // Between -1 and 1
    heart.style.setProperty("--random-x", randomX);

    heart.style.width = size + "px";
    heart.style.height = size + "px";
    heart.style.opacity = opacity;

    heartTrailContainer.appendChild(heart);

    // Remove heart after animation completes
    setTimeout(() => {
      heart.remove();
    }, 1500); // Match this with CSS animation duration
  }

  // Enhanced form validation functions
  const validation = {
    validateName(name) {
      if (!name || name.trim().length < 2) {
        return "Tên phải có ít nhất 2 ký tự";
      }
      if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(name.trim())) {
        return "Tên chỉ được chứa chữ cái và khoảng trắng";
      }
      return null;
    },

    validatePhone(phone) {
      if (!phone || phone.trim().length === 0) {
        return "Số điện thoại không được để trống";
      }
      const phoneRegex = /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/;
      if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
        return "Số điện thoại không hợp lệ (VD: 0912345678)";
      }
      return null;
    },

    validateEmail(email) {
      if (!email || email.trim().length === 0) {
        return "Email không được để trống";
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return "Email không hợp lệ";
      }
      return null;
    },

    showError(input, message) {
      // Remove existing error
      const existingError = input.parentNode.querySelector(".error-message");
      if (existingError) {
        existingError.remove();
      }

      // Add error styling
      input.style.borderColor = "#ff3366";
      input.style.boxShadow = "0 0 0 3px rgba(255, 51, 102, 0.2)";

      // Create error message
      const errorDiv = document.createElement("div");
      errorDiv.className = "error-message";
      errorDiv.textContent = message;
      errorDiv.style.color = "#ff3366";
      errorDiv.style.fontSize = "14px";
      errorDiv.style.marginTop = "5px";
      errorDiv.style.animation = "fadeIn 0.3s ease";

      input.parentNode.appendChild(errorDiv);

      // Shake animation
      input.style.animation = "shake 0.5s ease-in-out";
      setTimeout(() => {
        input.style.animation = "";
      }, 500);
    },

    clearError(input) {
      const existingError = input.parentNode.querySelector(".error-message");
      if (existingError) {
        existingError.remove();
      }
      input.style.borderColor = "";
      input.style.boxShadow = "";
    },
  };

  // Character counter for textarea
  const noteInput = document.getElementById("note");
  const charCountElement = document.querySelector(".char-count");

  if (noteInput && charCountElement) {
    noteInput.addEventListener("input", function () {
      const currentLength = this.value.length;
      const maxLength = this.getAttribute("maxlength") || 200;
      charCountElement.textContent = `${currentLength}/${maxLength}`;

      // Change color when approaching limit
      if (currentLength > maxLength * 0.8) {
        charCountElement.style.color = "#ff6b6b";
      } else {
        charCountElement.style.color = "";
      }
    });
  }

  // Handle info form submission with enhanced validation
  const infoForm = document.getElementById("info-form");
  if (infoForm) {
    infoForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const nameInput = document.getElementById("name");
      const phoneInput = document.getElementById("phone");
      const emailInput = document.getElementById("email");
      const addressInput = document.getElementById("address");
      const noteInput = document.getElementById("note");

      const name = nameInput.value.trim();
      const phone = phoneInput.value.trim();
      const email = emailInput.value.trim();
      const address = addressInput.value.trim();
      const note = noteInput.value.trim();

      // Clear previous errors
      validation.clearError(nameInput);
      validation.clearError(phoneInput);
      validation.clearError(emailInput);
      validation.clearError(addressInput);

      // Validate all fields
      let hasErrors = false;

      const nameError = validation.validateName(name);
      if (nameError) {
        validation.showError(nameInput, nameError);
        hasErrors = true;
      }

      const phoneError = validation.validatePhone(phone);
      if (phoneError) {
        validation.showError(phoneInput, phoneError);
        hasErrors = true;
      }

      // Validate email (optional, but if provided must be valid)
      if (email) {
        const emailError = validation.validateEmail(email);
        if (emailError) {
          validation.showError(emailInput, emailError);
          hasErrors = true;
        }
      }

      // Validate address (required)
      if (!address) {
        validation.showError(addressInput, "Vui lòng nhập địa chỉ đón");
        hasErrors = true;
      }

      // If there are errors, don't proceed
      if (hasErrors) {
        return;
      }

      // Store user info in localStorage
      state.userInfo = { name, phone, email, address, note };
      utils.saveToStorage("userInfo", state.userInfo);

      // Show success toast and update progress
      toastManager.success(
        "Thông tin đã được lưu thành công! 📝",
        "Hoàn thành!"
      );
      progressManager.nextStep(); // Move to step 4

      // Add celebration hearts
      const infoCelebration = document.getElementById("info-celebration");
      for (let i = 0; i < 20; i++) {
        setTimeout(() => {
          const heart = document.createElement("div");
          heart.classList.add("heart");
          heart.style.left = "50%";
          heart.style.top = "50%";
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * 100 + 50;
          const duration = Math.random() * 0.7 + 0.7;
          heart.style.transform = `scale(${Math.random() * 0.5 + 0.5})`;
          heart.style.opacity = Math.random() * 0.5 + 0.5;

          heart.animate(
            [
              { transform: "translate(-50%, -50%) scale(0.5)", opacity: 1 },
              {
                transform: `translate(calc(-50% + ${
                  Math.cos(angle) * distance
                }px), calc(-50% + ${Math.sin(angle) * distance}px)) scale(0)`,
                opacity: 0,
              },
            ],
            {
              duration: duration * 1000,
              easing: "cubic-bezier(0.1, 0.8, 0.9, 1)",
            }
          );

          infoCelebration.appendChild(heart);

          setTimeout(() => {
            heart.remove();
          }, duration * 1000);
        }, i * 30);
      }

      // Transition to datetime card
      const infoCard = document.getElementById("info-card");
      infoCard.style.transform = "scale(0.8)";
      infoCard.style.opacity = "0";

      setTimeout(() => {
        infoCard.style.display = "none";
        const datetimeCard = document.getElementById("datetime-card");
        datetimeCard.style.display = "block";

        setTimeout(() => {
          datetimeCard.classList.remove("hidden");
          datetimeCard.style.opacity = "1";
          datetimeCard.style.transform = "scale(1)";

          // Initialize datetime pickers in the new card with delay
          setTimeout(() => {
            const datetimeRow = datetimeCard.querySelector(".datetime-row");
            if (datetimeRow) {
              initializeDatetimeRow(datetimeRow);
            }
          }, 100);

          // Create some hearts in the datetime card too
          const datetimeCelebration = document.getElementById(
            "datetime-celebration"
          );
          for (let i = 0; i < 15; i++) {
            setTimeout(() => {
              const heart = document.createElement("div");
              heart.classList.add("heart");
              heart.style.left = Math.random() * 100 + "%";
              heart.style.top = Math.random() * 100 + "%";
              heart.style.animationDuration = Math.random() * 2 + 2 + "s";
              heart.style.opacity = Math.random() * 0.7 + 0.3;
              heart.style.transform = `scale(${Math.random() * 0.8 + 0.5})`;
              datetimeCelebration.appendChild(heart);

              setTimeout(() => {
                heart.remove();
              }, 4000);
            }, i * 100);
          }
        }, 50);
      }, 500);
    });
  }

  // Telegram Setup Event Handlers
  const telegramSetup = document.getElementById("telegram-setup");
  const getChatIdBtn = document.getElementById("get-chat-id-btn");
  const testBotBtn = document.getElementById("test-bot-btn");
  const closeSetupBtn = document.getElementById("close-setup-btn");

  // Show setup panel if Chat ID is not configured
  if (TELEGRAM_CONFIG.CHAT_ID === "YOUR_CHAT_ID_HERE") {
    setTimeout(() => {
      telegramSetup.style.display = "flex";
      setTimeout(() => telegramSetup.classList.add("show"), 100);
    }, 2000);
  } else {
    // Chat ID đã được cấu hình, ẩn setup panel
    console.log(
      "✅ Telegram Bot đã được cấu hình với Chat ID:",
      TELEGRAM_CONFIG.CHAT_ID
    );
  }

  // Get Chat ID button
  if (getChatIdBtn) {
    getChatIdBtn.addEventListener("click", async function () {
      this.innerHTML = 'Đang lấy... <div class="loading-spinner"></div>';
      this.disabled = true;

      const chatId = await telegramBot.getChatId();

      if (chatId) {
        // Update config
        TELEGRAM_CONFIG.CHAT_ID = chatId.toString();

        toastManager.success(
          `Chat ID: ${chatId}`,
          "Lấy Chat ID thành công",
          5000
        );
        this.innerHTML = "Đã lấy Chat ID ✅";

        // Enable test button
        if (testBotBtn) testBotBtn.disabled = false;
      } else {
        toastManager.error(
          "Không tìm thấy tin nhắn. Hãy gửi tin nhắn cho bot trước!",
          "Không tìm thấy Chat ID"
        );
        this.innerHTML = "Lấy Chat ID";
        this.disabled = false;
      }
    });
  }

  // Test bot button
  if (testBotBtn) {
    testBotBtn.addEventListener("click", async function () {
      this.innerHTML = 'Đang test... <div class="loading-spinner"></div>';
      this.disabled = true;

      const success = await telegramBot.testBot();

      if (success) {
        this.innerHTML = "Test thành công ✅";
        setTimeout(() => {
          telegramSetup.classList.remove("show");
          setTimeout(() => (telegramSetup.style.display = "none"), 300);
        }, 1500);
      } else {
        this.innerHTML = "Test Bot";
        this.disabled = false;
      }
    });
  }

  // Close setup button
  if (closeSetupBtn) {
    closeSetupBtn.addEventListener("click", function () {
      telegramSetup.classList.remove("show");
      setTimeout(() => (telegramSetup.style.display = "none"), 300);
    });
  }

  // Add keyboard shortcut to open setup (Ctrl + T)
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.key === "t") {
      e.preventDefault();
      telegramSetup.style.display = "flex";
      setTimeout(() => telegramSetup.classList.add("show"), 100);
    }
  });

  // Send visitor tracking info when page loads
  setTimeout(async () => {
    try {
      const sessionInfo = userTracker.getSessionInfo();
      // Only send visitor info for new sessions to avoid spam
      if (sessionInfo.isNewSession) {
        console.log("Sending visitor tracking info...");
        await telegramBot.sendVisitorInfo();
        console.log("Visitor tracking info sent successfully");
      }
    } catch (error) {
      console.error("Error sending visitor tracking:", error);
    }
  }, 2000); // Wait 2 seconds after page load

  // Track page visibility changes
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      // User is leaving the page
      const sessionDuration =
        Date.now() - userTracker.getSessionInfo().sessionStart;
      localStorage.setItem("last_session_duration", sessionDuration.toString());
    }
  });

  // Track when user leaves the page
  window.addEventListener("beforeunload", () => {
    const sessionDuration =
      Date.now() - userTracker.getSessionInfo().sessionStart;
    localStorage.setItem("last_session_duration", sessionDuration.toString());
  });
});
