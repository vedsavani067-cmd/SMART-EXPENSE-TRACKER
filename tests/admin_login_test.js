const { Builder, By, until } = require('selenium-webdriver');

async function testAdminLogin() {
  console.log("Starting browser...");
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    console.log("Navigating to admin login page...");
    await driver.get('http://localhost:3000/admin-login');
    await driver.manage().window().maximize();

    const emailField = await driver.wait(until.elementLocated(By.css("input[type='email']")), 10000);
    const passwordField = await driver.findElement(By.css("input[placeholder='••••••••']"));
    const submitBtn = await driver.findElement(By.css("button[type='submit']"));

    const testEmail = "admin@expense.com";
    const testPassword = "adminPass99";

    console.log(`Entering Admin Email: ${testEmail}`);
    await emailField.sendKeys(testEmail);

    console.log("Entering Admin Security Key...");
    await passwordField.sendKeys(testPassword);

    console.log("Clicking Access Dashboard...");
    await driver.executeScript("arguments[0].click();", submitBtn);

    await driver.wait(until.urlContains('/admin'), 5000);
    console.log("\n✅ TEST PASSED: Successfully logged in as admin and redirected to the Admin Dashboard!");

  } catch (error) {
    console.log(`\n❌ TEST FAILED: ${error.message}`);
  } finally {
    await driver.sleep(3000);
    console.log("Closing browser...");
    await driver.quit();
  }
}

testAdminLogin();
