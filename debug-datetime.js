// Debug script để kiểm tra datetime step
console.log("🔍 DEBUG: Checking datetime functionality...");

// Check elements
const confirmBtn = document.getElementById("confirm-datetime");
const datetimeCard = document.getElementById("datetime-card");
const dateInputs = document.querySelectorAll(".date-picker");
const timeInputs = document.querySelectorAll(".time-picker");

console.log("📋 Element Check:");
console.log("- Confirm button:", !!confirmBtn);
console.log("- Datetime card:", !!datetimeCard);
console.log("- Date inputs:", dateInputs.length);
console.log("- Time inputs:", timeInputs.length);

if (confirmBtn) {
  console.log("🎯 Button details:");
  console.log("- Text:", confirmBtn.textContent);
  console.log("- Disabled:", confirmBtn.disabled);
  console.log("- Classes:", confirmBtn.className);
  console.log("- Event listeners:", getEventListeners ? getEventListeners(confirmBtn) : "Cannot check");
}

if (datetimeCard) {
  console.log("📅 Datetime card:");
  console.log("- Hidden:", datetimeCard.classList.contains("hidden"));
  console.log("- Display:", window.getComputedStyle(datetimeCard).display);
}

// Test manual click
if (confirmBtn) {
  console.log("🖱️ Adding test click handler...");
  
  // Remove existing listeners and add new one
  const newBtn = confirmBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);
  
  newBtn.addEventListener("click", function() {
    console.log("✅ TEST CLICK WORKED!");
    
    // Check if we have valid data
    const dateValue = dateInputs[0]?.value;
    const timeValue = timeInputs[0]?.value;
    
    console.log("📝 Input values:");
    console.log("- Date:", dateValue);
    console.log("- Time:", timeValue);
    
    if (!dateValue || !timeValue) {
      console.log("⚠️ Missing date/time, filling with test data...");
      
      if (dateInputs[0]) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().split('T')[0];
        dateInputs[0].value = dateStr;
        console.log("📅 Set date:", dateStr);
      }
      
      if (timeInputs[0]) {
        timeInputs[0].value = "18:00";
        console.log("⏰ Set time: 18:00");
      }
    }
    
    // Manually trigger the flow
    console.log("🚀 Manually triggering review flow...");
    
    // Hide datetime card
    const datetimeCard = document.getElementById("datetime-card");
    const reviewCard = document.getElementById("review-card");
    
    if (datetimeCard && reviewCard) {
      datetimeCard.style.transform = "scale(0.8)";
      datetimeCard.style.opacity = "0";
      
      setTimeout(() => {
        datetimeCard.classList.add("hidden");
        reviewCard.classList.remove("hidden");
        reviewCard.style.transform = "scale(1)";
        reviewCard.style.opacity = "1";
        
        console.log("✅ Manually switched to review card!");
      }, 500);
    }
  });
  
  console.log("🎯 Test handler added. Click the button to test!");
}

// Auto-fill and test if requested
window.autoTestDatetime = function() {
  console.log("🤖 Auto-testing datetime...");
  
  // Fill data
  if (dateInputs[0]) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    dateInputs[0].value = dateStr;
  }
  
  if (timeInputs[0]) {
    timeInputs[0].value = "18:00";
  }
  
  // Click button
  setTimeout(() => {
    const btn = document.getElementById("confirm-datetime");
    if (btn) {
      btn.click();
      console.log("🖱️ Auto-clicked confirm button");
    }
  }, 500);
};

console.log("💡 Run 'autoTestDatetime()' in console to auto-test!");
