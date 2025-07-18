// Test script để kiểm tra flow hoàn chỉnh
console.log("🚀 Starting automated test flow...");

// Wait for page to load
setTimeout(() => {
  console.log("📋 Testing datetime confirmation flow...");
  
  // Check if confirmDatetimeBtn exists
  const confirmBtn = document.getElementById("confirm-datetime");
  console.log("🔍 Confirm button found:", !!confirmBtn);
  
  if (confirmBtn) {
    console.log("📝 Button text:", confirmBtn.textContent);
    console.log("🎯 Button classes:", confirmBtn.className);
    console.log("🔒 Button disabled:", confirmBtn.disabled);
    
    // Check if datetime card is visible
    const datetimeCard = document.getElementById("datetime-card");
    console.log("👁️ Datetime card visible:", !datetimeCard.classList.contains("hidden"));
    
    // Check datetime inputs
    const dateInputs = document.querySelectorAll(".date-picker");
    const timeInputs = document.querySelectorAll(".time-picker");
    console.log("📅 Date inputs found:", dateInputs.length);
    console.log("⏰ Time inputs found:", timeInputs.length);
    
    // Fill in test data
    if (dateInputs.length > 0 && timeInputs.length > 0) {
      console.log("✏️ Filling test data...");
      
      // Set tomorrow's date
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split('T')[0];
      
      dateInputs[0].value = dateStr;
      timeInputs[0].value = "18:00";
      
      console.log("📅 Set date:", dateStr);
      console.log("⏰ Set time:", "18:00");
      
      // Trigger change events
      dateInputs[0].dispatchEvent(new Event('change'));
      timeInputs[0].dispatchEvent(new Event('change'));
      
      // Wait a bit then try to click
      setTimeout(() => {
        console.log("🖱️ Attempting to click confirm button...");
        
        // Check if button is clickable
        const rect = confirmBtn.getBoundingClientRect();
        console.log("📐 Button position:", {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          visible: rect.width > 0 && rect.height > 0
        });
        
        // Try clicking
        try {
          confirmBtn.click();
          console.log("✅ Button clicked successfully!");
        } catch (error) {
          console.error("❌ Error clicking button:", error);
        }
        
        // Check what happened after click
        setTimeout(() => {
          const reviewCard = document.getElementById("review-card");
          const isReviewVisible = reviewCard && !reviewCard.classList.contains("hidden");
          console.log("📊 Review card visible after click:", isReviewVisible);
          
          if (isReviewVisible) {
            console.log("🎉 SUCCESS: Flow worked correctly!");
            
            // Test final submission
            setTimeout(() => {
              console.log("🔄 Testing final submission...");
              const finalBtn = document.getElementById("confirm-final-btn");
              if (finalBtn) {
                console.log("🎯 Final button found, clicking...");
                finalBtn.click();
                
                // Check completion
                setTimeout(() => {
                  const completionCard = document.getElementById("completion-card");
                  const isCompletionVisible = completionCard && !completionCard.classList.contains("hidden");
                  console.log("🏁 Completion card visible:", isCompletionVisible);
                  
                  if (isCompletionVisible) {
                    console.log("🎊 FULL SUCCESS: Complete flow working!");
                  } else {
                    console.log("⚠️ Final submission may have failed");
                  }
                }, 2000);
              }
            }, 1000);
          } else {
            console.log("❌ FAILED: Review card not shown");
          }
        }, 1000);
        
      }, 500);
    } else {
      console.log("❌ No datetime inputs found");
    }
  } else {
    console.log("❌ Confirm button not found");
  }
}, 1000);
