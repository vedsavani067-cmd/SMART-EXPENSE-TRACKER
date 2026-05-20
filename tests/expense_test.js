const { Builder, By, until } = require('selenium-webdriver');

async function testAddExpense() {
  console.log("Starting browser...");
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    // 1. Initial Login
    console.log("Navigating to login page...");
    await driver.get('http://localhost:3000/login');
    await driver.manage().window().maximize();

    await driver.wait(until.elementLocated(By.id('userEmail')), 10000);

    const emailField = await driver.findElement(By.id('userEmail'));
    const passwordField = await driver.findElement(By.id('userPass'));
    const loginBtn = await driver.findElement(By.css("button[type='submit']"));

    console.log("Logging in as test@05gmail.com...");
    await emailField.sendKeys("test@05gmail.com");
    await passwordField.sendKeys("Test@05");
    await driver.executeScript("arguments[0].click();", loginBtn);

    // Verify Dashboard renders
    await driver.wait(until.urlContains('/dashboard'), 5000);
    console.log("Logged in successfully.");

    // 2. Add Expense
    console.log("Navigating to Add Expense form...");
    await driver.get('http://localhost:3000/add-expense');

    // Wait for the number input to attach
    await driver.wait(until.elementLocated(By.css("input[type='number']")), 10000);

    const amountInput = await driver.findElement(By.css("input[type='number']"));
    const noteInput = await driver.findElement(By.css("input[type='text']"));
    const expenseSubmitBtn = await driver.findElement(By.css("button[type='submit']"));

    console.log("Entering amount: 500");
    await amountInput.sendKeys("500");
    await driver.sleep(500);

    console.log("Entering note: Auto test expense");
    await noteInput.sendKeys("Auto test expense");
    await driver.sleep(500);

    console.log("Submitting expense form...");
    await driver.executeScript("arguments[0].click();", expenseSubmitBtn);

    // Wait until the success message finishes and the input goes blank again!
    await driver.wait(async () => {
      const value = await amountInput.getAttribute('value');
      return value === '';
    }, 5000, "Form did not reset properly indicating failure.");

    console.log("\n✅ TEST PASSED: Successfully added expense and form was gracefully cleared for the next entry!");

  } catch (error) {
    console.log(`\n❌ TEST FAILED: ${error.message}`);
  } finally {
    await driver.sleep(3000);
    console.log("Closing browser...");
    await driver.quit();
  }
}

testAddExpense();
