const { Builder, By, until } = require('selenium-webdriver');

async function testAddIncome() {
  console.log("Starting browser...");
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    // 1. Login Flow
    console.log("Navigating to login page...");
    await driver.get('http://localhost:3000/login');
    await driver.manage().window().maximize();

    const emailField = await driver.wait(until.elementLocated(By.id('userEmail')), 10000);
    const passwordField = await driver.findElement(By.id('userPass'));
    const submitBtn = await driver.findElement(By.css("button[type='submit']"));

    console.log("Logging in as test@05gmail.com...");
    await emailField.sendKeys("test@05gmail.com");
    await passwordField.sendKeys("Test@05");
    await driver.executeScript("arguments[0].click();", submitBtn);

    await driver.wait(until.urlContains('/dashboard'), 5000);
    console.log("Logged in successfully.");

    // 2. Add Income Flow
    console.log("Navigating to Add Income form...");
    await driver.get('http://localhost:3000/add-income');

    const amountInput = await driver.wait(until.elementLocated(By.css("input[type='number']")), 10000);
    const noteInput = await driver.findElement(By.css("input[type='text'][placeholder='Optional note...']"));
    const incomeSubmitBtn = await driver.findElement(By.css("button[type='submit']"));

    console.log("Entering amount: 1500");
    await amountInput.sendKeys("1500");
    await driver.sleep(500);

    console.log("Entering note: Auto test income js");
    await noteInput.sendKeys("Auto test income js");
    await driver.sleep(500);

    console.log("Submitting income form...");
    await driver.executeScript("arguments[0].click();", incomeSubmitBtn);

    // Wait for the readiness clearance inside AddIncome.jsx
    await driver.wait(async () => {
      const val = await driver.findElement(By.css("input[type='number']")).getAttribute('value');
      return val === '';
    }, 10000);

    console.log("\n✅ TEST PASSED: Successfully added income and form was gracefully cleared for the next entry!");

  } catch (error) {
    console.log(`\n❌ TEST FAILED: ${error.message}`);
  } finally {
    await driver.sleep(3000);
    console.log("Closing browser...");
    await driver.quit();
  }
}

testAddIncome();
