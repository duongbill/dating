// Script để setup flow đến datetime step
console.log("🎬 Setting up flow to datetime step...");

// Function to wait for element
function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }
    
    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${selector} not found within ${timeout}ms`));
    }, timeout);
  });
}

// Function to click and wait
function clickAndWait(element, waitTime = 1000) {
  return new Promise((resolve) => {
    element.click();
    setTimeout(resolve, waitTime);
  });
}

// Main setup function
async function setupFlow() {
  try {
    console.log("1️⃣ Looking for Yes button...");
    const yesBtn = await waitForElement('#yes-btn');
    console.log("✅ Yes button found, clicking...");
    await clickAndWait(yesBtn, 1500);
    
    console.log("2️⃣ Looking for location selection...");
    const locationBtn = await waitForElement('[data-location="cafe"]');
    console.log("✅ Location button found, selecting cafe...");
    await clickAndWait(locationBtn, 500);
    
    console.log("3️⃣ Looking for confirm location button...");
    const confirmLocationBtn = await waitForElement('#confirm-location-btn');
    console.log("✅ Confirm location button found, clicking...");
    await clickAndWait(confirmLocationBtn, 1500);
    
    console.log("4️⃣ Looking for food selection...");
    const foodBtn = await waitForElement('[data-food="pizza"]');
    console.log("✅ Food button found, selecting pizza...");
    await clickAndWait(foodBtn, 500);
    
    console.log("5️⃣ Looking for drinks next button...");
    const drinksNextBtn = await waitForElement('#drinks-next-btn');
    console.log("✅ Drinks next button found, clicking...");
    await clickAndWait(drinksNextBtn, 1500);
    
    console.log("6️⃣ Looking for drink selection...");
    const drinkBtn = await waitForElement('[data-drink="coffee"]');
    console.log("✅ Drink button found, selecting coffee...");
    await clickAndWait(drinkBtn, 500);
    
    console.log("7️⃣ Looking for completion next button...");
    const completionNextBtn = await waitForElement('#completion-next-btn');
    console.log("✅ Completion next button found, clicking...");
    await clickAndWait(completionNextBtn, 1500);
    
    console.log("🎯 Setup complete! Now at datetime step.");
    console.log("📅 Datetime card should be visible now.");
    
    // Verify we're at datetime step
    const datetimeCard = document.getElementById("datetime-card");
    if (datetimeCard && !datetimeCard.classList.contains("hidden")) {
      console.log("✅ SUCCESS: Datetime card is visible!");
      
      // Now run the test
      console.log("🧪 Running datetime test...");
      
      // Load and execute test script
      const script = document.createElement('script');
      script.src = 'test-flow.js';
      document.head.appendChild(script);
      
    } else {
      console.log("❌ FAILED: Datetime card not visible");
    }
    
  } catch (error) {
    console.error("❌ Setup failed:", error);
  }
}

// Start setup
setTimeout(setupFlow, 1000);
